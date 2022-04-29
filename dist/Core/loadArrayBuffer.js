import makeRealPromise from "./makeRealPromise";
import Resource from "terriajs-cesium/Source/Core/Resource";
export default function loadArrayBuffer(urlOrResource, headers) {
    return makeRealPromise(Resource.fetchArrayBuffer({ url: urlOrResource, headers: headers }));
}
module.exports = loadArrayBuffer;
//# sourceMappingURL=loadArrayBuffer.js.map