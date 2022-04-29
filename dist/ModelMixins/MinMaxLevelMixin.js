var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable } from "mobx";
import { scaleDenominatorToLevel } from "./../Core/scaleToDenominator";
import ImageryProvider from "terriajs-cesium/Source/Scene/ImageryProvider";
import CommonStrata from "./../Models/Definition/CommonStrata";
import isDefined from "../Core/isDefined";
function MinMaxLevelMixin(Base) {
    class MinMaxLevelMixin extends Base {
        constructor() {
            super(...arguments);
            this.notVisible = false;
        }
        get supportsMinMaxLevel() {
            return true;
        }
        getMinimumLevel(ows) {
            return scaleDenominatorToLevel(this.maxScaleDenominator, true, ows);
        }
        getMaximumLevel(ows) {
            return scaleDenominatorToLevel(this.minScaleDenominator, false, ows);
        }
        updateRequestImage(imageryProvider, ows = true) {
            const maximumLevel = this.getMaximumLevel(ows);
            const minimumLevel = this.getMinimumLevel(ows);
            const realRequestImage = imageryProvider.requestImage;
            if ((isDefined(maximumLevel) && this.hideLayerAfterMinScaleDenominator) ||
                isDefined(minimumLevel)) {
                imageryProvider.requestImage = (x, y, level) => {
                    if ((maximumLevel && level > maximumLevel) ||
                        (minimumLevel && level < minimumLevel)) {
                        if (isDefined(imageryProvider.enablePickFeatures)) {
                            imageryProvider.enablePickFeatures = false;
                        }
                        if (maximumLevel &&
                            level > maximumLevel &&
                            this.hideLayerAfterMinScaleDenominator) {
                            this.setTrait(CommonStrata.defaults, "scaleWorkbenchInfo", "translate#models.scaleDatasetNotVisible.scaleZoomOut");
                        }
                        else if (minimumLevel && level < minimumLevel) {
                            this.setTrait(CommonStrata.defaults, "scaleWorkbenchInfo", "translate#models.scaleDatasetNotVisible.scaleZoomIn");
                        }
                        return ImageryProvider.loadImage(imageryProvider, `${this.terria.baseUrl}images/blank.png`);
                    }
                    this.setTrait(CommonStrata.defaults, "scaleWorkbenchInfo", undefined);
                    if (isDefined(imageryProvider.enablePickFeatures)) {
                        imageryProvider.enablePickFeatures = true;
                    }
                    return realRequestImage.call(imageryProvider, x, y, level);
                };
            }
            return imageryProvider;
        }
    }
    __decorate([
        observable
    ], MinMaxLevelMixin.prototype, "notVisible", void 0);
    return MinMaxLevelMixin;
}
(function (MinMaxLevelMixin) {
    function isMixedInto(model) {
        return model && model.supportsMinMaxLevel;
    }
    MinMaxLevelMixin.isMixedInto = isMixedInto;
})(MinMaxLevelMixin || (MinMaxLevelMixin = {}));
export default MinMaxLevelMixin;
//# sourceMappingURL=MinMaxLevelMixin.js.map