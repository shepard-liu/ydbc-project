/**
 * The global state hook
 */
import { useEffect, useRef, useState } from 'react';
import { useUniqueId } from './uniqueId';
const globalStateMap = new Map();
/**
 * The global state hook.
 *
 * -------
 * General Behavior
 *
 * Synchronize state defined by state id across all components that uses this hook.
 * You can't mutate the stateId parsed to the hook call.
 *
 * -------
 * Mounting and Unmounting
 *
 * If a component that uses this hook is currently unmounted, the state will be later synchronized
 * during the first render of re-mounting. Mounted component will receive state update **in the order of mounting**.
 *
 * -------
 * Initial State
 *
 * The initial state depends on the parameter parsed to the first call of all calls of
 * this hook across all components.
 *
 * @param stateId An unique ID to access a global state, must not mutate
 * @param initialState Initial value.
 * @param debug Debug information to print on key points.
 * @returns [state, setState] just like the return value of useState hook.
 */
export function useGlobalState(stateId, initialState, debug) {
    if (!debug) {
        console.log('no debug');
    }
    // Make sure the state id is immutable.
    const stateIdRef = useRef(stateId);
    if (stateId !== stateIdRef.current)
        throw new Error('[HOOK] useGlobalState: The id of the global state should not mutate.');
    // State meta reference used during the full lifecycle of the component
    const stateMetaRef = useRef();
    // Initialize state. The initializer function will be called only during the first render.
    const [state, setState] = useState(() => {
        let stateMeta = stateMetaRef.current = globalStateMap.get(stateIdRef.current);
        // Initialize global state if not exists
        if (!stateMeta) {
            stateMeta = stateMetaRef.current = {
                // The value initialized here will be the initial value of the global state
                state: ((typeof initialState === 'function') ? initialState() : initialState),
                subscriberCount: 0,
                subscribers: new Map()
            };
            globalStateMap.set(stateIdRef.current, stateMeta);
            if (debug)
                console.log(`[HOOK] useGlobalState: ${debug} - initialized global state '${stateId}'.`);
        }
        if (debug)
            console.log(`[HOOK] useGlobalState: ${debug} - global state '${stateId}' initialized as`, stateMeta.state);
        /**
         * The state will be initialized as the current value of the global state.
         */
        return stateMeta.state;
    });
    // Unique id generator for component instance
    const { nextId } = useUniqueId(debug);
    const instanceIdRef = useRef(null);
    // This bunch of logic happens only during first render
    if (instanceIdRef.current === null) {
        if (debug)
            console.log(`[HOOK] useGlobalState: ${debug} - component first render, subscribing global state '${stateId}'.`);
        const stateMeta = stateMetaRef.current;
        // Subscribe state change on first render. The subscription will be cancelled after unmount.
        instanceIdRef.current = nextId();
        if (debug)
            console.log(`[HOOK] useGlobalState: ${debug} - component gets instance id`, instanceIdRef.current);
        stateMeta.subscribers.set(instanceIdRef.current, setState);
        ++stateMeta.subscriberCount;
    }
    // Use the unmount cleanup functionality of useEffect
    useEffect(() => {
        const stateMeta = stateMetaRef.current;
        const instanceId = instanceIdRef.current;
        console.log('instance id:', instanceId);
        return () => {
            if (debug)
                console.log(`[HOOK] useGlobalState: ${debug} - component unmounted and unsubscribing '${stateId}'.`);
            // Remove subscriber from subscribers when unmounts
            stateMeta.subscribers.delete(instanceId);
            --stateMeta.subscriberCount;
            // Remove the state meta if there is no subscribers.
            if (stateMeta.subscriberCount === 0) {
                if (debug)
                    console.log(`[HOOK] useGlobalState: ${debug} - the last component unmounts, removing state meta of '${stateId}'`);
                globalStateMap.delete(stateIdRef.current);
            }
        };
    }, []); //eslint-disable-line
    return [
        state,
        (newState) => {
            const stateMeta = stateMetaRef.current;
            if (debug)
                console.log(`[HOOK] useGlobalState: ${debug} - component setting global state '${stateId}', syncing across subscribers.`, newState);
            // Sync state across the mounted subscribers.
            if (debug)
                console.log(`[HOOK] useGlobalState: ${debug} - subscriber instance ids(${stateMeta.subscriberCount}):`, [...stateMeta.subscribers.keys()].join(','));
            stateMeta.state = newState;
            const subscribers = stateMeta.subscribers.entries();
            for (const [_, stateSetter] of subscribers) {
                stateSetter(newState);
            }
        }
    ];
}
