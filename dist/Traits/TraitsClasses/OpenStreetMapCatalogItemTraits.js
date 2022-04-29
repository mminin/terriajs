var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import RasterLayerTraits from "./RasterLayerTraits";
import UrlTraits from "./UrlTraits";
export default class OpenStreetMapCatalogItemTraits extends mixTraits(RasterLayerTraits, LayerOrderingTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.fileExtension = "png";
        this.subdomains = [];
        this.maximumLevel = 25;
    }
}
__decorate([
    primitiveTrait({
        name: "File extension",
        description: "The file extension used to retrieve Open Street Map data",
        type: "string"
    })
], OpenStreetMapCatalogItemTraits.prototype, "fileExtension", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Subdomains",
        description: "Array of subdomains, one of which will be prepended to each tile URL. This is useful for overcoming browser limit on the number of simultaneous requests per host.",
        type: "string"
    })
], OpenStreetMapCatalogItemTraits.prototype, "subdomains", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum Level",
        description: "The maximum level of details to fetch",
        type: "number"
    })
], OpenStreetMapCatalogItemTraits.prototype, "maximumLevel", void 0);
//# sourceMappingURL=OpenStreetMapCatalogItemTraits.js.map