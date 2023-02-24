import filterOutUndefined from "../../../Core/filterOutUndefined";
import { isJsonObject, isJsonString } from "../../../Core/Json";
export function parseOwsKeywordList(json) {
    if (!isJsonObject(json))
        return undefined;
    const type = isJsonString(json.type) ? json.type : undefined;
    const Keyword = isJsonString(json.Keyword)
        ? json.Keyword
        : Array.isArray(json.Keyword)
            ? filterOutUndefined(json.Keyword.map((s) => (isJsonString(s) ? s : undefined)))
            : [];
    return {
        type,
        Keyword
    };
}
export function parseOnlineResource(json) {
    if (!isJsonObject(json))
        return undefined;
    const href = isJsonString(json["xlink:href"])
        ? json["xlink:href"]
        : undefined;
    if (href === undefined)
        return;
    const type = isJsonString(json["xlink:type"])
        ? json["xlink:type"]
        : undefined;
    return {
        "xlink:type": type,
        "xlink:href": href
    };
}
//# sourceMappingURL=OwsInterfaces.js.map