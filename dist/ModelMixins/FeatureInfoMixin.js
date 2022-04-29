var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import Resource from "terriajs-cesium/Source/Core/Resource";
import PropertyBag from "terriajs-cesium/Source/DataSources/PropertyBag";
import isDefined from "../Core/isDefined";
import loadJson from "../Core/loadJson";
import { action } from "mobx";
import proxyCatalogItemUrl from "../Models/Catalog/proxyCatalogItemUrl";
export default function FeatureInfoMixin(Base) {
    class FeatureInfoMixin extends Base {
        /**
         * Returns a {@link Feature} for the pick result. If `featureInfoUrlTemplate` is set,
         * it asynchronously loads additional info from the url.
         */
        getFeaturesFromPickResult(screenPosition, pickResult) {
            const feature = this.buildFeatureFromPickResult(screenPosition, pickResult);
            if (isDefined(feature)) {
                feature._catalogItem = this;
                (async () => {
                    if (isDefined(this.featureInfoUrlTemplate)) {
                        const resource = new Resource({
                            url: proxyCatalogItemUrl(this, this.featureInfoUrlTemplate, "0d"),
                            templateValues: feature.properties
                                ? feature.properties.getValue(new JulianDate())
                                : undefined
                        });
                        try {
                            const featureInfo = await loadJson(resource);
                            Object.keys(featureInfo).forEach(property => {
                                if (!feature.properties) {
                                    feature.properties = new PropertyBag();
                                }
                                feature.properties.addProperty(property, featureInfo[property]);
                            });
                        }
                        catch (e) {
                            if (!feature.properties) {
                                feature.properties = new PropertyBag();
                            }
                            feature.properties.addProperty("Error", "Unable to retrieve feature details from:\n\n" + resource.url);
                        }
                    }
                })();
            }
            return feature;
        }
    }
    __decorate([
        action
    ], FeatureInfoMixin.prototype, "getFeaturesFromPickResult", null);
    return FeatureInfoMixin;
}
//# sourceMappingURL=FeatureInfoMixin.js.map