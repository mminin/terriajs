var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export class MinMaxLevelTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.hideLayerAfterMinScaleDenominator = false;
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum Scale Denominator",
        description: "The denominator of the smallest scale (largest denominator) for which tiles should be requested. " +
            "For example, if this value is 10000, then tiles representing a scale smaller than 1:10000 (i.e. " +
            "numerically larger denominator, when zooming out further) will not be requested. For large scales set " +
            "hideLayerBeforeMaxScaleDenominator to true, otherwise you may experience performance issues (requesting too many tiles)."
    })
], MinMaxLevelTraits.prototype, "maxScaleDenominator", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Minimum Scale Denominator",
        description: "The denominator of the largest scale (smallest denominator) for which tiles should be requested. " +
            "For example, if this value is 1000, then tiles representing a scale larger than 1:1000 (i.e. " +
            "numerically smaller denominator, when zooming in closer) will not be requested.  Instead, tiles of " +
            "the largest-available scale, as specified by this property, will be used and will simply get " +
            "blurier as the user zooms in closer."
    })
], MinMaxLevelTraits.prototype, "minScaleDenominator", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Hide Layer After Minimum Scale Denominator",
        description: "True to hide tiles when the `Minimum Scale Denominator` is exceeded. If false, we can zoom in arbitrarily close to the (increasingly blurry) layer."
    })
], MinMaxLevelTraits.prototype, "hideLayerAfterMinScaleDenominator", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Scale workbench info",
        description: "The message to show to the user when this dataset is not visible due to scale."
    })
], MinMaxLevelTraits.prototype, "scaleWorkbenchInfo", void 0);
//# sourceMappingURL=MinMaxLevelTraits.js.map