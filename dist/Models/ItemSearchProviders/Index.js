import { assertNumber, assertObject, assertString } from "../../Core/Json";
import EnumIndex from "./EnumIndex";
import NumericIndex from "./NumericIndex";
import TextIndex from "./TextIndex";
import { indexTypes } from "./Types";
export { IndexType, indexTypes } from "./Types";
export { default as EnumIndex } from "./EnumIndex";
export { default as NumericIndex } from "./NumericIndex";
const indexParsers = {
    numeric: parseNumericIndex,
    enum: parseEnumIndex,
    text: parseTextIndex
};
export function parseIndexRoot(json) {
    assertObject(json, "IndexRoot");
    assertString(json.resultsDataUrl, "resultsDataUrl");
    assertString(json.idProperty, "idProperty");
    assertObject(json.indexes, "indexes");
    const indexes = Object.entries(json.indexes).reduce((indexes, [property, index]) => {
        indexes[property] = parseIndex(index);
        return indexes;
    }, {});
    return {
        resultsDataUrl: json.resultsDataUrl,
        idProperty: json.idProperty,
        indexes
    };
}
export function parseIndexType(json) {
    assertString(json, "IndexType");
    if (indexTypes.includes(json))
        return json;
    throw new Error(`Expected index type to be ${indexTypes.join("|")}, got ${json}`);
}
function parseIndex(json) {
    assertObject(json, "Index");
    assertString(json.type, "type");
    const parser = indexParsers[json.type];
    if (parser)
        return parser(json);
    throw new Error(`Expected index type to be ${indexTypes.join("|")}, got ${json.type}`);
}
function parseNumericIndex(json) {
    assertObject(json, "NumericIndex");
    assertObject(json.range, "range");
    assertNumber(json.range.max, "range.max");
    assertNumber(json.range.min, "range.min");
    assertString(json.url, "url");
    return new NumericIndex(json.url, {
        min: json.range.min,
        max: json.range.max
    });
}
function parseEnumIndex(json) {
    assertObject(json, "EnumIndex");
    assertObject(json.values);
    const values = Object.entries(json.values).reduce((values, [id, value]) => {
        values[id] = parseEnumValue(value);
        return values;
    }, {});
    return new EnumIndex(values);
}
function parseEnumValue(json) {
    assertObject(json, "EnumValue");
    assertNumber(json.count);
    assertString(json.url);
    return {
        count: json.count,
        url: json.url
    };
}
function parseTextIndex(json) {
    assertObject(json, "EnumIndex");
    assertString(json.url);
    return new TextIndex(json.url);
}
//# sourceMappingURL=Index.js.map