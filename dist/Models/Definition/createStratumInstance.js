import { observable } from "mobx";
function createStratumInstance(traitsSource, values) {
    const defaults = values || {};
    const traits = traitsSource.traits;
    const propertyNames = Object.keys(traits);
    const reduced = propertyNames.reduce((p, c) => ({ ...p, [c]: defaults[c] }), {});
    return observable(reduced);
}
export default createStratumInstance;
//# sourceMappingURL=createStratumInstance.js.map