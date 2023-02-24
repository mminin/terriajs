import joinUrl from "./joinUrl";
import loadCsv from "../../Core/loadCsv";
import { IndexType } from "./Types";
import sortedIndexBy from "lodash-es/sortedIndexBy";
import sortedLastIndexBy from "lodash-es/sortedLastIndexBy";
/**
 * An index used for searching numeric values.
 *
 * It is represented as an array of [id, value] pairs sorted by the value.
 * Searching is done by performing a binary search on the array.
 */
export default class NumericIndex {
    /**
     * Constructs a NumericIndex.
     *
     * @param url    Url of the NumericIndex CSV file. This could be a relative URL.
     * @param range  The maximum and minimum value in the index.
     */
    constructor(url, range) {
        this.url = url;
        this.range = range;
        this.type = IndexType.numeric;
    }
    /**
     * Load a numeric index.
     *
     * @param indexRootUrl   The URL of the index root directory
     * @param _valueHint     Ignored for NumericIndex.
     */
    async load(indexRootUrl, _valueHint) {
        if (this.idValuePairs)
            return;
        const indexUrl = joinUrl(indexRootUrl, this.url);
        const promise = loadCsv(indexUrl, {
            dynamicTyping: true,
            header: true
        });
        this.idValuePairs = promise;
        return promise.then(() => { });
    }
    /**
     * Search the numeric index for values between the start and end value in NumericSearchQuery.
     *
     * @param value The start and end value to be searched.
     * @return Set of IDs that matches the search value.
     */
    async search(value) {
        if (!this.idValuePairs)
            throw new Error(`Index not loaded`);
        const range = this.range;
        const idValuePairs = await this.idValuePairs;
        const startValue = value.start === undefined ? range.min : value.start;
        const endValue = value.end === undefined ? range.max : value.end;
        const startIndex = sortedIndexBy(idValuePairs, { dataRowId: 0, value: startValue }, (entry) => entry.value);
        const endIndex = sortedLastIndexBy(idValuePairs, { dataRowId: 0, value: endValue }, (entry) => entry.value);
        const matchingIds = idValuePairs
            .slice(startIndex, endIndex)
            .map(({ dataRowId }) => dataRowId);
        return new Set(matchingIds);
    }
}
//# sourceMappingURL=NumericIndex.js.map