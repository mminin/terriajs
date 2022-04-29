export function isLatLonHeight(obj) {
    if (obj) {
        return (Number.isFinite(obj.latitude) &&
            Number.isFinite(obj.longitude) &&
            (Number.isFinite(obj.height) || obj.height === undefined));
    }
    else
        return false;
}
//# sourceMappingURL=LatLonHeight.js.map