var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import objectTrait from "../Decorators/objectTrait";
import LatLonHeightTraits from "./LatLonHeightTraits";
import HeadingPitchRollTraits from "./HeadingPitchRollTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class TransformationTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: LatLonHeightTraits,
        name: "Origin",
        description: "The origin of the model, expressed as a longitude and latitude in degrees and a height in meters. If this property is specified, the model's axes will have X pointing East, Y pointing North, and Z pointing Up. If not specified, the model is located in the Earth-Centered Earth-Fixed frame."
    })
], TransformationTraits.prototype, "origin", void 0);
__decorate([
    objectTrait({
        type: HeadingPitchRollTraits,
        name: "Rotation",
        description: "The rotation of the model expressed as heading, pitch and roll in the local frame of reference. Defaults to zero rotation."
    })
], TransformationTraits.prototype, "rotation", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Scale",
        description: "The scale factor to apply to the model"
    })
], TransformationTraits.prototype, "scale", void 0);
//# sourceMappingURL=TransformationTraits.js.map