/**
 * Unique Id generator hook
 */
let serial = 0;
export const useUniqueId = (debug) => {
    return {
        nextId: () => {
            console.log('nextid called', debug);
            ++serial;
            return serial;
        },
    };
};
