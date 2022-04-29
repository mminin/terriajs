import MiniSearch from "minisearch";
import joinUrl from "./joinUrl";
import { IndexType } from "./Types";
const loadText = require("../../Core/loadText");
/**
 * An index for searching arbirtray text.
 *
 * We use the Minisearch library for indexing and searching free text.  The
 * index files contains a serialized JSON representation of the Minisearch
 * instance and the options used to construct the Minisearch instance.
 */
export default class TextIndex {
    /**
     * Construct the search index.
     *
     * @param url Url of the text index file
     */
    constructor(url) {
        this.url = url;
        this.type = IndexType.text;
    }
    /**
     * Loads the text index.
     *
     * @param indexRootUrl The URL of the index root directory.
     * @param _valueHint Ignored for TextIndex.
     */
    async load(indexRootUrl, _valueHint) {
        if (this.miniSearchIndex)
            return;
        const promise = loadText(joinUrl(indexRootUrl, this.url))
            .then((text) => JSON.parse(text))
            .then((json) => MiniSearch.loadJS(json.index, json.options));
        this.miniSearchIndex = promise;
        return promise.then(() => { });
    }
    /**
     * Search the text index for the given value.
     *
     * @param value         The value to be searched.
     * @param queryOptions  MiniSearch.SearchOptions
     * @param return The IDs of objects matching the search text.
     */
    async search(value, queryOptions) {
        if (this.miniSearchIndex === undefined)
            throw new Error(`Text index not loaded`);
        const miniSearchIndex = await this.miniSearchIndex;
        const results = miniSearchIndex.search(value, queryOptions);
        const ids = new Set(results.map(r => r.id));
        return ids;
    }
}
//# sourceMappingURL=TextIndex.js.map