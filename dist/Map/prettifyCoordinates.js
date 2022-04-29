/**
 * Turns the longitude / latitude in degrees into a human readable pretty strings.
 *
 * @param longitude The longitude to format.
 * @param latitude The latitude to format.
 * @param options Options for the prettification.
 */
export default function prettifyCoordinates(longitude, latitude, { height, errorBar, digits = 5 } = {}) {
    const prettyLatitude = Math.abs(latitude).toFixed(digits) + "°" + (latitude < 0.0 ? "S" : "N");
    const prettyLongitude = Math.abs(longitude).toFixed(digits) + "°" + (longitude < 0.0 ? "W" : "E");
    let prettyElevation = undefined;
    if (height !== undefined) {
        prettyElevation =
            Math.round(height) +
                (errorBar !== undefined ? "±" + Math.round(errorBar) : "") +
                "m";
    }
    return {
        longitude: prettyLongitude,
        latitude: prettyLatitude,
        elevation: prettyElevation
    };
}
//# sourceMappingURL=prettifyCoordinates.js.map