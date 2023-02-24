import TimeVarying from "../ModelMixins/TimeVarying";
import { propertyGetTimeValues } from "../ReactViews/FeatureInfo/getFeatureProperties";
import hashFromString from "./hashFromString";
/**
 * Hashes a Cesium {@link Entity} (used by us for features) by stringifying its properties and name.
 *
 * @param feature The feature to hash
 * @param clock A clock that will be used to resolve the property values.
 * @returns {Number} the hash, as an integer.
 */
export default function hashEntity(feature, terria) {
    var _a, _b;
    const catalogItemTime = feature._catalogItem && TimeVarying.is(feature._catalogItem)
        ? feature._catalogItem.currentTimeAsJulianDate
        : undefined;
    return hashFromString(((_a = JSON.stringify(propertyGetTimeValues(feature, catalogItemTime !== null && catalogItemTime !== void 0 ? catalogItemTime : terria.timelineClock.currentTime))) !== null && _a !== void 0 ? _a : "") + ((_b = feature.name) !== null && _b !== void 0 ? _b : ""));
}
//# sourceMappingURL=hashEntity.js.map