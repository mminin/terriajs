import makeRealPromise from "./makeRealPromise";
import Resource from "terriajs-cesium/Source/Core/Resource";
export default function loadJson(urlOrResource, headers, body, asForm = false) {
    let responseType = "json";
    let jsonPromise;
    let params = {
        url: urlOrResource,
        headers: headers
    };
    if (body !== undefined) {
        // We need to send a POST
        params.headers = headers !== null && headers !== void 0 ? headers : {};
        params.headers["Content-Type"] = "application/json";
        if (asForm) {
            const data = new FormData();
            Object.entries(body).forEach(([key, value]) => data.append(key, JSON.stringify(value)));
            params.data = data;
        }
        else {
            params.data = JSON.stringify(body);
        }
        params.responseType = responseType;
        jsonPromise =
            urlOrResource instanceof Resource
                ? urlOrResource.post(body, {
                    responseType: responseType
                })
                : Resource.post(params);
    }
    else {
        // Make a GET instead
        jsonPromise =
            urlOrResource instanceof Resource
                ? urlOrResource.fetchJson()
                : Resource.fetchJson(params);
    }
    return makeRealPromise(jsonPromise);
}
//# sourceMappingURL=loadJson.js.map