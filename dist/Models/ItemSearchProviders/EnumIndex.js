import joinUrl from "./joinUrl";
import loadCsv from "../../Core/loadCsv";
import { IndexType } from "./Types";
/**
 * An index used for searching enums (fixed set of strings).
 *
 * Enum indexes contains sub-indexes, one for each enum value.
 * The sub-index is simply an array of IDs that has the enum value.
 * Searching for an enum value simply returns the IDs array for that value.
 */
export default class EnumIndex {
    /**
     * Constructs an EnumIndex.
     *
     * @param values An object mapping an enum value string to the value definition.
     */
    constructor(values) {
        this.values = values;
        this.type = IndexType.enum;
    }
    /**
     * Load an enum index.
     *
     * @param indexRootUrl The URL of the index root directory.
     * @param searchHint   The enum values that will be searched. We only load the sub-indexes for these values.
     */
    async load(indexRootUrl, searchHint) {
        const enumValueIds = searchHint;
        const promises = enumValueIds.map(async (valueId) => {
            const value = this.values[valueId];
            if (value.dataRowIds)
                return Promise.resolve();
            const promise = loadCsv(joinUrl(indexRootUrl, value.url), {
                dynamicTyping: true,
                header: true
            }).then((rows) => rows.map(({ dataRowId }) => dataRowId));
            value.dataRowIds = promise;
            return promise;
        });
        await Promise.all(promises);
    }
    /**
     * Search the enum index.
     *
     * @param  enumValueIds The enum values to be searched
     * @return Set of IDs for all matching enum values.
     */
    async search(enumValueIds) {
        const idSets = await Promise.all(enumValueIds.map(async (valueId) => {
            const value = this.values[valueId];
            if (!value)
                throw new Error(`Not an enum value: ${valueId}`);
            if (!value.dataRowIds)
                throw new Error(`Index for enum value ${valueId} is not loaded`);
            return await value.dataRowIds;
        }));
        const ids = flatten(idSets);
        return new Set(ids);
    }
}
function flatten(array) {
    const flattened = array.reduce((acc, a) => acc.concat(a), []);
    return flattened;
}
//# sourceMappingURL=EnumIndex.js.map