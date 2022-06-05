/**
 * The global state hook
 */

import React, { useEffect, useRef, useState } from 'react';

type StateSetterFunction<T> = React.Dispatch<React.SetStateAction<T>>;
type GlobalStateId = string;

interface GlobalStateMeta<T = any> {
    state: T,
    subscribers: Set<StateSetterFunction<T>>
}

const globalStateMap: Map<GlobalStateId, GlobalStateMeta> = new Map();

// Strict Mode detector
const __consoleLog = console.log;
// Temporarily store the prevously added setter function
let lastSubscriber: StateSetterFunction<any>;

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
 * -------
 * Strict Mode
 * 
 * If the component that uses this hook is wrapped in <React.StrictMode>, it would be mounted, unmounted and
 * mounted again for testing state reusability. Problem is, the cleanup function of useEffect hooks will not be
 * invoked after unmounted, thus causing global state update subscription from unmounted component instance.
 * 
 * A new workround has been introduced to solve this problem. The hook now detects strict mode and tries to remove
 * previous subscription on first render.
 * 
 * @param stateId An unique ID to access a global state, must not mutate
 * @param initialState Initial value.
 * @param debug Debug information to print on key points.
 * @returns [state, setState] just like the return value of useState hook.
 */
export function useGlobalState<T>(stateId: string, initialState?: T | (() => T), debug?: string): [T, StateSetterFunction<T>] {

    // Make sure the state id is immutable.
    const stateIdRef = useRef<string>(stateId);
    if (stateId !== stateIdRef.current)
        throw new Error('[HOOK] useGlobalState: The id of the global state should not mutate.');

    // State meta reference used during the full lifecycle of the component
    const stateMetaRef = useRef<GlobalStateMeta>();

    // Initialize state. The initializer function will be called only during the first render.
    const [state, setState] = useState<T>(() => {

        let stateMeta = stateMetaRef.current = globalStateMap.get(stateIdRef.current);

        // Initialize global state if not exists
        if (!stateMeta) {
            stateMeta = stateMetaRef.current = {
                // The value initialized here will be the initial value of the global state
                state: ((typeof initialState === 'function') ? (initialState as Function)() : initialState),
                subscribers: new Set()
            };
            globalStateMap.set(stateIdRef.current, stateMeta);

            if (debug) console.log(`[HOOK] useGlobalState: ${debug} - initialized global state '${stateId}'.`);
        }

        if (debug) console.log(`[HOOK] useGlobalState: ${debug} - global state '${stateId}' initialized as`, stateMeta.state);

        // The state will be initialized as the current value of the global state.
        return stateMeta.state;
    });

    // This bunch of logic runs only during the first render
    const onceRef = useRef<boolean>(false);
    if (onceRef.current === false) {
        if (debug) console.log(`[HOOK] useGlobalState: ${debug} - component first render, subscribing global state '${stateId}'.`);
        const stateMeta = stateMetaRef.current;

        // Subscribe state change on first render. The subscription will be cancelled after unmount.
        stateMeta.subscribers.add(setState);

        /**
         * Detect React Strict Mode and clean up previous subscription as the unmount cleanup of useEffect
         * was not invoked.
         * @see https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
         */
        if (__consoleLog !== console.log) {
            __consoleLog(`[HOOK] useGlobalState: ${debug || ''} - Strict Mode detected... Cleaning up previous subscriber.`);
            stateMeta.subscribers.delete(lastSubscriber);
        }

        onceRef.current = true;
        lastSubscriber = setState;
    }

    // Use the unmount cleanup functionality of useEffect
    useEffect(() => {
        const stateId = stateIdRef.current
        const stateMeta = stateMetaRef.current;

        return () => {
            if (debug) console.log(`[HOOK] useGlobalState: ${debug} - component unmounted and unsubscribing '${stateId}'.`);

            // Remove subscriber from subscribers when unmounts
            stateMeta.subscribers.delete(setState);
            // Remove the state meta if there is no subscribers.
            if (stateMeta.subscribers.size === 0) {
                if (debug) console.log(`[HOOK] useGlobalState: ${debug} - the last component unmounts, removing state meta of '${stateId}'`);
                globalStateMap.delete(stateId);
            }
        }
    }, [debug]);

    return [
        state,
        (newState: T) => {
            const stateMeta = stateMetaRef.current;

            if (debug) console.log(`[HOOK] useGlobalState: ${debug} - component setting global state '${stateId}', syncing across subscribers(${stateMeta.subscribers.size})`, newState);

            // Sync state across the mounted subscribers.
            stateMeta.state = newState;
            const subscribers = stateMeta.subscribers.values();
            for (const stateSetter of subscribers) {
                stateSetter(newState);
            }
        }
    ]

}


