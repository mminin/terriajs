var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import GltfTraits from "./GltfTraits";
import UrlTraits from "./UrlTraits";
export class ColorGroupTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Color",
        description: "CSS color string",
        type: "string"
    })
], ColorGroupTraits.prototype, "color", void 0);
__decorate([
    primitiveTrait({
        name: "Regular Expression",
        description: "Regular expression to match on the specified property",
        type: "string"
    })
], ColorGroupTraits.prototype, "regExp", void 0);
export class ColorModelsByPropertyTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Property",
        description: "Path to the property used to choose the color",
        type: "string"
    })
], ColorModelsByPropertyTraits.prototype, "property", void 0);
__decorate([
    objectArrayTrait({
        type: ColorGroupTraits,
        name: "Color Groups",
        description: "",
        idProperty: "index"
    })
], ColorModelsByPropertyTraits.prototype, "colorGroups", void 0);
export default class GtfsModelTraits extends mixTraits(GltfTraits, UrlTraits) {
}
__decorate([
    primitiveTrait({
        name: "Maximum draw distance",
        description: "The farthest distance from the camera that the model will still be drawn",
        type: "number"
    })
], GtfsModelTraits.prototype, "maximumDistance", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum scale",
        description: "The maximum scale size of a model. This property is used as an upper limit for scaling due to `minimumPixelSize`",
        type: "number"
    })
], GtfsModelTraits.prototype, "maximumScale", void 0);
__decorate([
    primitiveTrait({
        name: "Minimum pixel size",
        description: "The minimum pixel size of the model regardless of zoom. This can be used to ensure that a model is visible even when the viewer zooms out. When 0.0, no minimum size is enforced",
        type: "number"
    })
], GtfsModelTraits.prototype, "minimumPixelSize", void 0);
__decorate([
    objectTrait({
        name: "Color models by property",
        description: "Color entity models by reguler expression match of a property of an entity",
        type: ColorModelsByPropertyTraits
    })
], GtfsModelTraits.prototype, "colorModelsByProperty", void 0);
//# sourceMappingURL=GtfsModelTraits.js.map