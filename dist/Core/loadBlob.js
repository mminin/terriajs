import Resource from "terriajs-cesium/Source/Core/Resource";
import loadJson from "./loadJson";
import makeRealPromise from "./makeRealPromise";
const zip = require("terriajs-cesium/Source/ThirdParty/zip").default;
export default function loadBlob(urlOrResource, headers, body) {
    if (body !== undefined) {
        return makeRealPromise(Resource.post({
            url: urlOrResource,
            headers: headers,
            data: JSON.stringify(body),
            responseType: "blob"
        }));
    }
    else {
        return makeRealPromise(Resource.fetchBlob({ url: urlOrResource, headers: headers }));
    }
}
export function isJson(uri) {
    return /(\.geojson)|(\.json)\b/i.test(uri);
}
export function isZip(uri) {
    return /(\.zip\b)/i.test(uri);
}
/** Parse zipped blob into JsonValue */
export function parseZipJsonBlob(blob) {
    return new Promise((resolve, reject) => {
        zip.createReader(new zip.BlobReader(blob), function (reader) {
            // Look for a file with a .geojson extension.
            reader.getEntries(function (entries) {
                let resolved = false;
                for (let i = 0; i < entries.length; i++) {
                    const entry = entries[i];
                    if (isJson(entry.filename)) {
                        entry.getData(new zip.Data64URIWriter(), function (uri) {
                            resolve(loadJson(uri));
                        });
                        resolved = true;
                    }
                }
                if (!resolved) {
                    reject();
                }
            });
        }, (e) => reject(e));
    });
}
//# sourceMappingURL=loadBlob.js.map