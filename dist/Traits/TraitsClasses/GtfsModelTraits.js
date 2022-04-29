var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import GltfTraits from "./GltfTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import UrlTraits from "./UrlTraits";
export default class GtfsModelTraits extends mixTraits(GltfTraits, UrlTraits) {
}
__decorate([
    primitiveTrait({
        name: "Bearing direction property",
        description: "Path to the bearing direction",
        type: "string"
    })
], GtfsModelTraits.prototype, "bearingDirectionProperty", void 0);
__decorate([
    primitiveTrait({
        name: "Compass direction property",
        description: "Path to the compass direction",
        type: "string"
    })
], GtfsModelTraits.prototype, "compassDirectionProperty", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum draw distance",
        description: "The farthest distance from the camera that the model will still be drawn",
        type: "number"
    })
], GtfsModelTraits.prototype, "maximumDistance", void 0);
//# sourceMappingURL=GtfsModelTraits.js.map