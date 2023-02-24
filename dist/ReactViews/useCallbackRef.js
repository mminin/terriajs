import { useState } from "react";
// taken from
// https://github.com/theKashey/use-callback-ref/blob/master/src/useRef.ts
export function useCallbackRef(initialValue, callback) {
    const [ref] = useState(() => ({
        // value
        value: initialValue,
        // last callback
        callback,
        // "memoized" public interface
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                const last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    ref.callback(value, last);
                }
            }
        }
    }));
    // update callback
    ref.callback = callback;
    return ref.facade;
}
//# sourceMappingURL=useCallbackRef.js.map