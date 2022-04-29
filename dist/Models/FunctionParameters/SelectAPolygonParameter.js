var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, isObservableArray } from "mobx";
import FunctionParameter from "./FunctionParameter";
/**
 * A parameter that specifies an arbitrary polygon on the globe, which has been selected from a different layer.
 */
export default class SelectAPolygonParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        this.type = "polygon";
    }
    static formatValueForUrl(value) {
        if (!(Array.isArray(value) || isObservableArray(value))) {
            return undefined;
        }
        const featureList = value.map(function (featureData) {
            return {
                type: "Feature",
                geometry: featureData.geometry
            };
        });
        return JSON.stringify({
            type: "FeatureCollection",
            features: featureList
        });
    }
    static getGeoJsonFeature(value) {
        return value.map(function (featureData) {
            return {
                type: "Feature",
                geometry: featureData.geometry,
                properties: {}
            };
        });
    }
    get geoJsonFeature() {
        return SelectAPolygonParameter.getGeoJsonFeature(this.value);
    }
}
__decorate([
    computed
], SelectAPolygonParameter.prototype, "geoJsonFeature", null);
//# sourceMappingURL=SelectAPolygonParameter.js.map