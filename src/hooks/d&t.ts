/**
 ** 防抖和节流钩子函数
 @author shepard
 */

import { useCallback, useRef } from "react";

/**
 * 防抖钩子函数
 * @param fn 被防抖函数，返回值将被舍弃
 * @param ms 延迟时间milliseconds
 * @returns 
 */
export function useDebounce<T extends (...args: any) => unknown>
    (fn: T, ms: number): (...args: Parameters<T>) => void {

    const paramsRef = useRef({ fn, ms, timeOut: null });
    Object.assign(paramsRef.current, { fn, ms });

    return useCallback(function (...args: Parameters<T>) {
        const { fn, ms, timeOut } = paramsRef.current;
        clearTimeout(timeOut);
        paramsRef.current.timeOut = setTimeout(() => fn.apply(this, args), ms);
    }, []);
}

/**
 * 节流钩子函数
 * @param fn 被节流函数，返回值将被舍弃
 * @param ms 延迟时间milliseconds
 * @returns 
 */
export function useThrottle<T extends (...args: any) => unknown>
    (fn: T, ms: number): (...args: Parameters<T>) => void {
    const paramsRef = useRef({ fn, ms, shouldRun: true });
    Object.assign(paramsRef.current, { fn, ms });

    return useCallback(function (...args: Parameters<T>) {
        const { shouldRun, ms, fn } = paramsRef.current;
        if (!shouldRun) return;
        paramsRef.current.shouldRun = false;
        setTimeout(() => { fn.apply(this, args); paramsRef.current.shouldRun = true; }, ms);
    }, []);
}

/**
 * 同步节流钩子函数，被节流函数首次调用将立即执行，此后一段时间内只能执行一次
 * @param fn 被节流函数
 * @param ms 延迟时间milliseconds
 * @returns fn
 */
export function useThrottleSync<T extends (...args: any) => unknown>
    (fn: T, ms: number): (...args: Parameters<T>) => ReturnType<T> | undefined {

    const paramsRef = useRef({ fn, ms, lastTime: Date.now() - ms });
    Object.assign(paramsRef.current, { fn, ms });

    return useCallback(function (...args: Parameters<T>) {
        const { lastTime, fn, ms } = paramsRef.current;

        if (Date.now() - lastTime < ms) return undefined;
        paramsRef.current.lastTime = Date.now();
        return fn.apply(this, args);
    }, []);
}