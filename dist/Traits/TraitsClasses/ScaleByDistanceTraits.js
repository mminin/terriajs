var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class ScaleByDistanceTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.near = 0.0;
        this.nearValue = 1.0;
        this.far = 1.0;
        this.farValue = 1.0;
    }
}
__decorate([
    primitiveTrait({
        name: "Near",
        description: "The lower bound of the camera distance range.",
        type: "number"
    })
], ScaleByDistanceTraits.prototype, "near", void 0);
__decorate([
    primitiveTrait({
        name: "Near Scale Value",
        description: "The scale value to use when the camera is at the `Near` distance (or " +
            "closer). A value greater than 1.0 enlarges the image while a scale " +
            "less than 1.0 shrinks it.",
        type: "number"
    })
], ScaleByDistanceTraits.prototype, "nearValue", void 0);
__decorate([
    primitiveTrait({
        name: "Far",
        description: "The upper bound of the camera distance range.",
        type: "number"
    })
], ScaleByDistanceTraits.prototype, "far", void 0);
__decorate([
    primitiveTrait({
        name: "Far Scale Value",
        description: "The scale value to use when the camera is at the `Far` distance (or " +
            "farther). A value greater than 1.0 enlarges the image while a scale " +
            "less than 1.0 shrinks it.",
        type: "number"
    })
], ScaleByDistanceTraits.prototype, "farValue", void 0);
//# sourceMappingURL=ScaleByDistanceTraits.js.map