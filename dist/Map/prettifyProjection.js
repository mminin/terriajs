const proj4 = require("proj4/lib/index.js").default;
/**
 * Turns the longitude / latitude in degrees into a human readable pretty UTM zone representation.
 */
export default function prettifyProjection(longitude, latitude, proj4Projection, proj4longlat, projectionUnits) {
    const zone = 1 + Math.floor((longitude + 180) / 6);
    const projection = proj4Projection + " +zone=" + zone + (latitude < 0 ? " +south" : "");
    const projPoint = proj4(proj4longlat, projection, [longitude, latitude]);
    return {
        utmZone: zone + (latitude < 0.0 ? "S" : "N"),
        north: projPoint[1].toFixed(2) + projectionUnits,
        east: projPoint[0].toFixed(2) + projectionUnits
    };
}
//# sourceMappingURL=prettifyProjection.js.map