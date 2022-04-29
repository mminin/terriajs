import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
export class LoadableStratumClass {
}
export default function LoadableStratum(Traits) {
    class LoadableStratum {
    }
    // All traits return undefined by default, and throw if set.
    const traits = Traits.traits;
    Object.keys(traits).forEach(propertyName => {
        if (!(propertyName in LoadableStratum.prototype)) {
            Object.defineProperty(LoadableStratum.prototype, propertyName, {
                get: function () {
                    return undefined;
                },
                set: function (value) {
                    throw new DeveloperError("Traits of a LoadableStratum may not be set.");
                },
                enumerable: true,
                configurable: true
            });
        }
    });
    // The cast is necessary because TypeScript can't see that we've
    // manually defined all the necessary properties.
    return LoadableStratum;
}
export function isLoadableStratum(x) {
    return "duplicateLoadableStratum" in x;
}
//# sourceMappingURL=LoadableStratum.js.map