import Resource from "terriajs-cesium/Source/Core/Resource";
export default function loadArrayBuffer(urlOrResource, headers) {
    return Resource.fetchArrayBuffer({ url: urlOrResource, headers: headers });
}
module.exports = loadArrayBuffer;
//# sourceMappingURL=loadArrayBuffer.js.map