import json5 from "json5";
import Resource from "terriajs-cesium/Source/Core/Resource";
import makeRealPromise from "./makeRealPromise";
const defaultHeaders = {
    Accept: "application/json5,application/json;q=0.8,*/*;q=0.01"
};
/*
 * A modified version of Cesium's loadJson function, supporting the more flexible JSON5 specification.
 */
export default function loadJson5(urlOrResource, headers) {
    let resource;
    if (urlOrResource instanceof Resource) {
        resource = urlOrResource;
    }
    else {
        resource = new Resource({
            url: urlOrResource,
            headers: {
                ...defaultHeaders,
                ...headers
            }
        });
    }
    const promise = makeRealPromise(resource.fetchText());
    return promise.then(function (value) {
        return json5.parse(value);
    });
}
// Use these headers if passing a Cesium Resource to loadJson5
loadJson5.defaultHeaders = defaultHeaders;
//# sourceMappingURL=loadJson5.js.map