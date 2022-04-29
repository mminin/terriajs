export function isJsonObject(value, deep = true) {
    return (value !== undefined &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        (!deep || Object.values(value).every(v => isJsonValue(v, true))));
}
export function isJsonBoolean(value) {
    return typeof value === "boolean";
}
export function isJsonNumber(value) {
    return typeof value === "number";
}
export function isJsonString(value) {
    return typeof value === "string";
}
export function isJsonValue(value, deep = true) {
    return (typeof value === "undefined" ||
        value === null ||
        isJsonBoolean(value) ||
        isJsonNumber(value) ||
        isJsonString(value) ||
        isJsonArray(value, deep) ||
        isJsonObject(value, deep));
}
export function isJsonArray(value, deep = true) {
    return (Array.isArray(value) &&
        (!deep || value.every(child => isJsonValue(child, true))));
}
export function isJsonStringArray(value) {
    return Array.isArray(value) && value.every(child => isJsonString(child));
}
export function isJsonNumberArray(value) {
    return Array.isArray(value) && value.every(child => isJsonNumber(child));
}
export function assertObject(value, name) {
    if (isJsonObject(value))
        return;
    throwUnexpectedError("JsonObject", typeof value, name);
}
export function assertString(value, name) {
    if (typeof value === "string")
        return;
    throwUnexpectedError("string", typeof value, name);
}
export function assertNumber(value, name) {
    if (typeof value === "number")
        return;
    throwUnexpectedError("number", typeof value, name);
}
export function assertArray(value, name) {
    if (Array.isArray(value))
        return;
    throwUnexpectedError("Array", typeof value, name);
}
function throwUnexpectedError(expectedType, actualType, name) {
    const nameToBe = name ? ` ${name} to be` : "";
    throw new Error(`Expected${nameToBe} ${expectedType}, got ${actualType}`);
}
//# sourceMappingURL=Json.js.map