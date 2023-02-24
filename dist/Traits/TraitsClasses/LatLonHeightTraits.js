var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import updateModelFromJson from "../../Models/Definition/updateModelFromJson";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
const cartoScratch = new Cartographic();
export default class LatLonHeightTraits extends ModelTraits {
    static setFromCartesian(model, stratumName, position) {
        const cartographic = Cartographic.fromCartesian(position, undefined, cartoScratch);
        const latitude = CesiumMath.toDegrees(cartographic.latitude);
        const longitude = CesiumMath.toDegrees(cartographic.longitude);
        const height = cartographic.height;
        return updateModelFromJson(model, stratumName, {
            latitude,
            longitude,
            height
        });
    }
    static toCartographic(model, result) {
        const { longitude, latitude, height } = model;
        if (longitude === undefined ||
            latitude === undefined ||
            height === undefined) {
            return undefined;
        }
        return Cartographic.fromDegrees(longitude, latitude, height, result !== null && result !== void 0 ? result : new Cartographic());
    }
    static toCartesian(model, result) {
        const { longitude, latitude, height } = model;
        if (longitude === undefined ||
            latitude === undefined ||
            height === undefined) {
            return;
        }
        return Cartesian3.fromDegrees(longitude, latitude, height, undefined, result !== null && result !== void 0 ? result : new Cartesian3());
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Latitude",
        description: "Latitude in degrees"
    })
], LatLonHeightTraits.prototype, "latitude", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Longitude",
        description: "Longitude in degrees"
    })
], LatLonHeightTraits.prototype, "longitude", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Height",
        description: "Height above ellipsoid in metres"
    })
], LatLonHeightTraits.prototype, "height", void 0);
//# sourceMappingURL=LatLonHeightTraits.js.map