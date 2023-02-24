export function isInitFromUrl(initSource) {
    return "initUrl" in initSource;
}
export function isInitFromData(initSource) {
    return (initSource &&
        "data" in initSource &&
        Object.prototype.toString.call(initSource.data) !== "[object Promise]");
}
export function isInitFromDataPromise(initSource) {
    return (initSource &&
        "data" in initSource &&
        Object.prototype.toString.call(initSource.data) === "[object Promise]");
}
export function isInitFromOptions(initSource) {
    return "options" in initSource;
}
//# sourceMappingURL=InitSource.js.map