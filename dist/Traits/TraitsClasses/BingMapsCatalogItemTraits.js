var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import RasterLayerTraits from "./RasterLayerTraits";
export default class BingMapsCatalogItemTraits extends mixTraits(LayerOrderingTraits, RasterLayerTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Map style",
        description: "Type of Bing Maps imagery"
    })
], BingMapsCatalogItemTraits.prototype, "mapStyle", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Key",
        description: "The Bing Maps key"
    })
], BingMapsCatalogItemTraits.prototype, "key", void 0);
//# sourceMappingURL=BingMapsCatalogItemTraits.js.map