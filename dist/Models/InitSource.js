export function isInitUrl(initSource) {
    return "initUrl" in initSource;
}
export function isInitData(initSource) {
    return (initSource &&
        "data" in initSource &&
        Object.prototype.toString.call(initSource.data) !== "[object Promise]");
}
export function isInitDataPromise(initSource) {
    return (initSource &&
        "data" in initSource &&
        Object.prototype.toString.call(initSource.data) === "[object Promise]");
}
export function isInitOptions(initSource) {
    return "options" in initSource;
}
//# sourceMappingURL=InitSource.js.map