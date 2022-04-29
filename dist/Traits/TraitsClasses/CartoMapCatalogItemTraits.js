var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import RasterLayerTraits from "./RasterLayerTraits";
import UrlTraits from "./UrlTraits";
export default class CartoMapCatalogItemTraits extends mixTraits(RasterLayerTraits, LayerOrderingTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.minimumLevel = 0;
        this.maximumLevel = 25;
    }
}
__decorate([
    anyTrait({
        name: "Config",
        description: "The configuration information to pass to the Carto Maps API"
    })
], CartoMapCatalogItemTraits.prototype, "config", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Authorization token",
        description: "The authorization token to pass to the Carto Maps API"
    })
], CartoMapCatalogItemTraits.prototype, "auth_token", void 0);
__decorate([
    primitiveTrait({
        name: "Minimum Level",
        description: "The minimum tile level to retrieve from the map data",
        type: "number"
    })
], CartoMapCatalogItemTraits.prototype, "minimumLevel", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum Level",
        description: "The maximum tile level to retrieve from the map data",
        type: "number"
    })
], CartoMapCatalogItemTraits.prototype, "maximumLevel", void 0);
//# sourceMappingURL=CartoMapCatalogItemTraits.js.map