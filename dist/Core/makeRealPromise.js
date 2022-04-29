import when from "terriajs-cesium/Source/ThirdParty/when";
/**
 * Turns a Cesium when.js promise into a normal native promise.
 * @param promise The Cesium promise.
 * @returns The native promise;
 */
export default function makeRealPromise(promise) {
    return new Promise((resolve, reject) => {
        when(promise, resolve, reject);
    });
}
//# sourceMappingURL=makeRealPromise.js.map