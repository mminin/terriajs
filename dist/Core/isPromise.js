// Adapted from https://stackoverflow.com/a/27746324
export default function isPromise(obj) {
    return (typeof obj === "object" &&
        obj !== null &&
        "then" in obj &&
        typeof obj.then === "function");
}
//# sourceMappingURL=isPromise.js.map