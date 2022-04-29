import Papa from "papaparse";
import loadText from "./loadText";
import makeRealPromise from "./makeRealPromise";
/**
 * Fetches CSV from `url` and uses papaparse to parse it.
 *
 */
export default function loadCsv(url, options) {
    // We use loadText instead of papaparse to fetch the data to follow the
    // common practice of using Cesium Resource to do network requests.
    return makeRealPromise(loadText(url)).then((text) => new Promise((resolve, reject) => Papa.parse(text, {
        worker: true,
        complete: result => resolve(result.data),
        error: error => reject(error),
        ...options
    })));
}
//# sourceMappingURL=loadCsv.js.map