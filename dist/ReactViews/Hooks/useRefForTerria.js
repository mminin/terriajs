import { useRef, useEffect } from "react";
// really unsure if we update the app ref or leave it to the component to set,
// but it makes most sense to run it this way for now
export function useRefForTerria(refName, viewState // todo: reach into store without passing viewstate(?)
) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref && ref.current) {
            viewState.updateAppRef(refName, ref);
        }
        // cleanup callback
        return function removeRefFromTerria() {
            viewState.deleteAppRef(refName);
        };
    }, [ref]);
    return ref;
}
//# sourceMappingURL=useRefForTerria.js.map