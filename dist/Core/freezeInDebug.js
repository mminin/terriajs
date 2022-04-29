export default function freezeInDebug(o) {
    //>>includeStart('debug', pragmas.debug);
    o = Object.freeze(o);
    //>>includeEnd('debug');
    return o;
}
//# sourceMappingURL=freezeInDebug.js.map