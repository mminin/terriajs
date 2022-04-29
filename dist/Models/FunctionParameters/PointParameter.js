var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import isDefined from "../../Core/isDefined";
import FunctionParameter from "./FunctionParameter";
export default class PointParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        this.type = "point";
    }
    /**
     * Get feature as geojson for display on map.
     */
    static getGeoJsonFeature(value) {
        var coordinates = [
            CesiumMath.toDegrees(value.longitude),
            CesiumMath.toDegrees(value.latitude),
            value.height
        ];
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coordinates
            },
            properties: {}
        };
    }
    /**
     * Process value so that it can be used in an URL.
     */
    static formatValueForUrl(value) {
        return JSON.stringify({
            type: "FeatureCollection",
            features: [PointParameter.getGeoJsonFeature(value)]
        });
    }
    get geoJsonFeature() {
        if (isDefined(this.value)) {
            return PointParameter.getGeoJsonFeature(this.value);
        }
    }
}
PointParameter.type = "point";
__decorate([
    computed
], PointParameter.prototype, "geoJsonFeature", null);
//# sourceMappingURL=PointParameter.js.map