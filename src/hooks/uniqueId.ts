/**
 * Unique Id generator hook
 */

import { useRef } from "react";

let serial = - Number.MAX_SAFE_INTEGER;

export const useUniqueId = () => {
    const idRef = useRef<number>(null);
    if (idRef.current === null) idRef.current = serial++;
    return idRef.current;
}