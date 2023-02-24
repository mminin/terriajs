var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, runInAction } from "mobx";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import Resource from "terriajs-cesium/Source/Core/Resource";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import PropertyBag from "terriajs-cesium/Source/DataSources/PropertyBag";
import isDefined from "../Core/isDefined";
import loadJson from "../Core/loadJson";
import proxyCatalogItemUrl from "../Models/Catalog/proxyCatalogItemUrl";
import { generateCesiumInfoHTMLFromProperties } from "../ReactViews/FeatureInfo/generateCesiumInfoHTMLFromProperties";
import MappableMixin from "./MappableMixin";
import TimeVarying from "./TimeVarying";
function FeatureInfoUrlTemplateMixin(Base) {
    class FeatureInfoUrlTemplateMixin extends Base {
        get hasFeatureInfoUrlTemplateMixin() {
            return true;
        }
        /**
         * Returns a {@link Feature} for the pick result. If `featureInfoUrlTemplate` is set,
         * it asynchronously loads additional info from the url.
         */
        getFeaturesFromPickResult(screenPosition, pickResult, loadExternal = true) {
            const feature = this.buildFeatureFromPickResult(screenPosition, pickResult);
            if (isDefined(feature)) {
                feature._catalogItem = this;
                feature.loadingFeatureInfoUrl = true;
                (async () => {
                    var _a;
                    if (loadExternal && isDefined(this.featureInfoUrlTemplate)) {
                        const resource = new Resource({
                            url: proxyCatalogItemUrl(this, this.featureInfoUrlTemplate, "0d"),
                            templateValues: feature.properties
                                ? feature.properties.getValue(new JulianDate())
                                : undefined
                        });
                        try {
                            const featureInfo = await loadJson(resource);
                            Object.keys(featureInfo).forEach((property) => {
                                if (!feature.properties) {
                                    feature.properties = new PropertyBag();
                                }
                                feature.properties.addProperty(property, featureInfo[property]);
                            });
                            // Update description of the feature after it is resolved from
                            // feature info template url
                            feature.description = new ConstantProperty(generateCesiumInfoHTMLFromProperties(feature.properties, (_a = (TimeVarying.is(this)
                                ? this.currentTimeAsJulianDate
                                : undefined)) !== null && _a !== void 0 ? _a : JulianDate.now(), MappableMixin.isMixedInto(this)
                                ? this.showStringIfPropertyValueIsNull
                                : undefined));
                        }
                        catch (e) {
                            if (!feature.properties) {
                                feature.properties = new PropertyBag();
                            }
                            feature.properties.addProperty("Error", "Unable to retrieve feature details from:\n\n" + resource.url);
                        }
                    }
                    runInAction(() => (feature.loadingFeatureInfoUrl = false));
                })();
            }
            return feature;
        }
        wrapImageryPickFeatures(imageryProvider) {
            const realPickFeatures = imageryProvider.pickFeatures;
            const catalogItem = this;
            imageryProvider.pickFeatures = async (x, y, level, longitude, latitude) => {
                var _a;
                const features = await realPickFeatures.call(imageryProvider, x, y, level, longitude, latitude);
                if (isDefined(catalogItem.featureInfoUrlTemplate) &&
                    isDefined(features) &&
                    features.length < catalogItem.maxRequests) {
                    for (let i = 0; i < features.length; i++) {
                        const feature = features[i];
                        const resource = new Resource({
                            url: proxyCatalogItemUrl(catalogItem, catalogItem.featureInfoUrlTemplate, "0d"),
                            templateValues: feature.properties
                                ? feature.properties
                                : undefined
                        });
                        try {
                            const featureInfo = await loadJson(resource);
                            Object.keys(featureInfo).forEach((property) => {
                                if (!feature.properties) {
                                    feature.properties = {};
                                }
                                if (feature.properties instanceof PropertyBag) {
                                    feature.properties.addProperty(property, featureInfo[property]);
                                }
                                else {
                                    feature.properties[property] = featureInfo[property];
                                }
                            });
                            // Update description of the feature after it is resolved from
                            // feature info template url
                            feature.description = generateCesiumInfoHTMLFromProperties(feature.properties, (_a = (TimeVarying.is(catalogItem)
                                ? catalogItem.currentTimeAsJulianDate
                                : undefined)) !== null && _a !== void 0 ? _a : JulianDate.now(), MappableMixin.isMixedInto(catalogItem)
                                ? catalogItem.showStringIfPropertyValueIsNull
                                : undefined);
                        }
                        catch (e) {
                            if (!feature.properties) {
                                feature.properties = {};
                            }
                            feature.properties["Error"] =
                                "Unable to retrieve feature details from:\n\n" + resource.url;
                        }
                    }
                }
                return Promise.resolve(features);
            };
            return imageryProvider;
        }
    }
    __decorate([
        action
    ], FeatureInfoUrlTemplateMixin.prototype, "getFeaturesFromPickResult", null);
    return FeatureInfoUrlTemplateMixin;
}
(function (FeatureInfoUrlTemplateMixin) {
    function isMixedInto(model) {
        return model && model.hasFeatureInfoUrlTemplateMixin;
    }
    FeatureInfoUrlTemplateMixin.isMixedInto = isMixedInto;
})(FeatureInfoUrlTemplateMixin || (FeatureInfoUrlTemplateMixin = {}));
export default FeatureInfoUrlTemplateMixin;
//# sourceMappingURL=FeatureInfoUrlTemplateMixin.js.map