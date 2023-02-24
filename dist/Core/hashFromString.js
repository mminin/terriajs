/** Returns a 32-bit integer hash of a string.  '' => 0. */
export default function hashFromString(s) {
    return Math.abs(s.split("").reduce(function (prev, c) {
        var hash = (prev << 5) - prev + c.charCodeAt(0);
        return hash;
    }, 0));
}
//# sourceMappingURL=hashFromString.js.map