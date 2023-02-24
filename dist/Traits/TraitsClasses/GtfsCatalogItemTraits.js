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
import AutoRefreshingTraits from "./AutoRefreshingTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import GtfsModelTraits from "./GtfsModelTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import OpacityTraits from "./OpacityTraits";
import ScaleByDistanceTraits from "./ScaleByDistanceTraits";
import UrlTraits from "./UrlTraits";
export class HeadersTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Name",
        description: "The header name",
        type: "string"
    })
], HeadersTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        name: "Value",
        description: "The header value",
        type: "string"
    })
], HeadersTraits.prototype, "value", void 0);
export default class GtfsCatalogItemTraits extends mixTraits(UrlTraits, CatalogMemberTraits, LegendOwnerTraits, MappableTraits, OpacityTraits, LayerOrderingTraits, AutoRefreshingTraits) {
}
__decorate([
    objectArrayTrait({
        name: "Headers",
        description: "Extra headers to attach to queries to the GTFS endpoint",
        type: HeadersTraits,
        idProperty: "name"
    })
], GtfsCatalogItemTraits.prototype, "headers", void 0);
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