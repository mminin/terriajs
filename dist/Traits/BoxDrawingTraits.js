var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "./Decorators/primitiveTrait";
import objectTrait from "./Decorators/objectTrait";
import ModelTraits from "./ModelTraits";
import LatLonHeightTraits from "./TraitsClasses/LatLonHeightTraits";
import HeadingPitchRollTraits from "./TraitsClasses/HeadingPitchRollTraits";
export class CornerPointsStyleTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Pixel size",
        description: "Pixel size of the corner point"
    })
], CornerPointsStyleTraits.prototype, "pixelSize", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Color",
        description: "Corner point color. Can be any valid CSS color string."
    })
], CornerPointsStyleTraits.prototype, "color", void 0);
export class BoxSizeTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Length",
        description: "Length of the box"
    })
], BoxSizeTraits.prototype, "length", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Length",
        description: "Length of the box"
    })
], BoxSizeTraits.prototype, "width", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Length",
        description: "Length of the box"
    })
], BoxSizeTraits.prototype, "height", void 0);
export default class BoxDrawingTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: LatLonHeightTraits,
        name: "Box position",
        description: "Latitude, longitude and height of the box in degrees"
    })
], BoxDrawingTraits.prototype, "position", void 0);
__decorate([
    objectTrait({
        type: BoxSizeTraits,
        name: "Box dimension",
        description: "Length, width and height of the box"
    })
], BoxDrawingTraits.prototype, "size", void 0);
__decorate([
    objectTrait({
        type: HeadingPitchRollTraits,
        name: "Rotation",
        description: "Rotation specified as heading, pitch and roll in degrees."
    })
], BoxDrawingTraits.prototype, "rotation", void 0);
__decorate([
    objectTrait({
        type: CornerPointsStyleTraits,
        name: "Corner points styling",
        description: "Corner points styling"
    })
], BoxDrawingTraits.prototype, "cornerPointsStyle", void 0);
//# sourceMappingURL=BoxDrawingTraits.js.map