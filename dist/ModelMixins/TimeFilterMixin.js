var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, onBecomeObserved } from "mobx";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import filterOutUndefined from "../Core/filterOutUndefined";
import runLater from "../Core/runLater";
import CommonStrata from "../Models/Definition/CommonStrata";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import { TimeFilterCoordinates } from "../Traits/TraitsClasses/TimeFilterTraits";
import DiscretelyTimeVaryingMixin from "./DiscretelyTimeVaryingMixin";
import MappableMixin, { ImageryParts } from "./MappableMixin";
/**
 * A Mixin for filtering the dates for which imagery is available at a location
 * picked by the user
 *
 * When `timeFilterPropertyName` is set, we look for a property of that name in
 * the feature query response at the picked location. The property value should be
 * an array of dates for which imagery is available at the location. This
 * Mixin is used to implement the Location filter feature for Satellite
 * Imagery.
 */
function TimeFilterMixin(Base) {
    class TimeFilterMixin extends DiscretelyTimeVaryingMixin(Base) {
        constructor(...args) {
            super(...args);
            // Try to resolve the timeFilterFeature from the co-ordinates that might
            // be stored in the traits. We only have to resolve the time filter
            // feature once to get the list of times.
            const disposeListener = onBecomeObserved(this, "mapItems", () => {
                runLater(action(async () => {
                    if (!MappableMixin.isMixedInto(this)) {
                        disposeListener();
                        return;
                    }
                    const coords = coordinatesFromTraits(this.timeFilterCoordinates);
                    if (coords) {
                        this.setTimeFilterFromLocation(coords);
                    }
                    disposeListener();
                }));
            });
        }
        async setTimeFilterFromLocation(coordinates) {
            const propertyName = this.timeFilterPropertyName;
            if (propertyName === undefined || !MappableMixin.isMixedInto(this)) {
                return false;
            }
            const resolved = await resolveFeature(this, propertyName, coordinates.position, coordinates.tileCoords);
            if (resolved) {
                this.setTimeFilterFeature(resolved.feature, resolved.providers);
                return true;
            }
            return false;
        }
        get hasTimeFilterMixin() {
            return true;
        }
        get canFilterTimeByFeature() {
            return this.timeFilterPropertyName !== undefined;
        }
        get imageryUrls() {
            if (!MappableMixin.isMixedInto(this))
                return [];
            return filterOutUndefined(this.mapItems.map(
            // @ts-ignore
            mapItem => ImageryParts.is(mapItem) && mapItem.imageryProvider.url));
        }
        get featureTimesAsJulianDates() {
            var _a;
            if (this._currentTimeFilterFeature === undefined ||
                this._currentTimeFilterFeature.properties === undefined ||
                this.timeFilterPropertyName === undefined) {
                return;
            }
            const featureTimes = (_a = this._currentTimeFilterFeature.properties[this.timeFilterPropertyName]) === null || _a === void 0 ? void 0 : _a.getValue(this.currentTime);
            if (!Array.isArray(featureTimes)) {
                return;
            }
            return filterOutUndefined(featureTimes.map(s => {
                try {
                    return s === undefined ? undefined : JulianDate.fromIso8601(s);
                }
                catch {
                    return undefined;
                }
            }));
        }
        get discreteTimesAsSortedJulianDates() {
            var _a;
            const featureTimes = this.featureTimesAsJulianDates;
            if (featureTimes === undefined) {
                return super.discreteTimesAsSortedJulianDates;
            }
            return (_a = super.discreteTimesAsSortedJulianDates) === null || _a === void 0 ? void 0 : _a.filter(dt => featureTimes.some(d => d.equals(dt.time)));
        }
        get timeFilterFeature() {
            return this._currentTimeFilterFeature;
        }
        setTimeFilterFeature(feature, providerCoords) {
            if (!MappableMixin.isMixedInto(this) || providerCoords === undefined)
                return;
            this._currentTimeFilterFeature = feature;
            if (!this.currentTimeAsJulianDate) {
                return;
            }
            if (!feature.position) {
                return;
            }
            const position = feature.position.getValue(this.currentTimeAsJulianDate);
            const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
            const featureImageryUrl = this.imageryUrls.find(url => providerCoords[url]);
            const tileCoords = featureImageryUrl && providerCoords[featureImageryUrl];
            if (!tileCoords)
                return;
            this.setTrait(CommonStrata.user, "timeFilterCoordinates", createStratumInstance(TimeFilterCoordinates, {
                tile: tileCoords,
                longitude: CesiumMath.toDegrees(cartographic.longitude),
                latitude: CesiumMath.toDegrees(cartographic.latitude),
                height: cartographic.height
            }));
        }
        removeTimeFilterFeature() {
            this._currentTimeFilterFeature = undefined;
            this.setTrait(CommonStrata.user, "timeFilterCoordinates", undefined);
        }
    }
    __decorate([
        observable
    ], TimeFilterMixin.prototype, "_currentTimeFilterFeature", void 0);
    __decorate([
        action
    ], TimeFilterMixin.prototype, "setTimeFilterFromLocation", null);
    __decorate([
        computed
    ], TimeFilterMixin.prototype, "canFilterTimeByFeature", null);
    __decorate([
        computed
    ], TimeFilterMixin.prototype, "imageryUrls", null);
    __decorate([
        computed
    ], TimeFilterMixin.prototype, "featureTimesAsJulianDates", null);
    __decorate([
        computed
    ], TimeFilterMixin.prototype, "discreteTimesAsSortedJulianDates", null);
    __decorate([
        computed
    ], TimeFilterMixin.prototype, "timeFilterFeature", null);
    __decorate([
        action
    ], TimeFilterMixin.prototype, "setTimeFilterFeature", null);
    __decorate([
        action
    ], TimeFilterMixin.prototype, "removeTimeFilterFeature", null);
    return TimeFilterMixin;
}
(function (TimeFilterMixin) {
    function isMixedInto(model) {
        return model && model.hasTimeFilterMixin;
    }
    TimeFilterMixin.isMixedInto = isMixedInto;
})(TimeFilterMixin || (TimeFilterMixin = {}));
/**
 * Return the feature at position containing the time filter property.
 */
const resolveFeature = action(async function (model, propertyName, position, tileCoords) {
    const { latitude, longitude, height } = position;
    const { x, y, level } = tileCoords;
    const providers = {};
    model.mapItems.forEach(mapItem => {
        if (ImageryParts.is(mapItem)) {
            // @ts-ignore
            providers[mapItem.imageryProvider.url] = { x, y, level };
        }
    });
    const viewer = model.terria.mainViewer.currentViewer;
    const features = await viewer.getFeaturesAtLocation({ latitude, longitude, height }, providers);
    const feature = (features || []).find(feature => {
        if (!feature.properties) {
            return false;
        }
        const prop = feature.properties[propertyName];
        const times = prop === null || prop === void 0 ? void 0 : prop.getValue(model.currentTimeAsJulianDate);
        return Array.isArray(times) && times.length > 0;
    });
    if (feature) {
        return { feature, providers };
    }
});
function coordinatesFromTraits(traits) {
    const { latitude, longitude, height, tile: { x, y, level } } = traits;
    if (latitude === undefined || longitude === undefined)
        return;
    if (x === undefined || y === undefined || level === undefined)
        return;
    return {
        position: { latitude, longitude, height },
        tileCoords: { x, y, level }
    };
}
export default TimeFilterMixin;
//# sourceMappingURL=TimeFilterMixin.js.map