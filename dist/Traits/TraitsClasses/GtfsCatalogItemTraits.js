var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import AutoRefreshingTraits from "./AutoRefreshingTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import FeatureInfoTraits from "./FeatureInfoTraits";
import GtfsModelTraits from "./GtfsModelTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import RasterLayerTraits from "./RasterLayerTraits";
import ScaleByDistanceTraits from "./ScaleByDistanceTraits";
import UrlTraits from "./UrlTraits";
export default class GtfsCatalogItemTraits extends mixTraits(UrlTraits, CatalogMemberTraits, LegendOwnerTraits, MappableTraits, RasterLayerTraits, LayerOrderingTraits, AutoRefreshingTraits, FeatureInfoTraits) {
}
__decorate([
    primitiveTrait({
        name: "GTFS API key",
        description: "The key that should be used when querying the GTFS API service",
        type: "string"
    })
], GtfsCatalogItemTraits.prototype, "apiKey", void 0);
__decorate([
    primitiveTrait({
        name: "Image url",
        description: "Url for the image to use to represent a vehicle. Recommended size 32x32 pixels.",
        type: "string"
    })
], GtfsCatalogItemTraits.prototype, "image", void 0);
__decorate([
    objectTrait({
        name: "Scale Image by Distance",
        description: "Describes how marker images are scaled by distance from the viewer.",
        type: ScaleByDistanceTraits
    })
], GtfsCatalogItemTraits.prototype, "scaleImageByDistance", void 0);
__decorate([
    objectTrait({
        name: "Model",
        description: "3D model to use to represent a vehicle.",
        type: GtfsModelTraits
    })
], GtfsCatalogItemTraits.prototype, "model", void 0);
//# sourceMappingURL=GtfsCatalogItemTraits.js.map