var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import RasterLayerTraits from "./RasterLayerTraits";
export default class MapboxStyleCatalogItemTraits extends mixTraits(RasterLayerTraits, CatalogMemberTraits, MappableTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.url = "https://api.mapbox.com/styles/v1/";
        this.username = "mapbox";
        this.tilesize = 512;
        this.scaleFactor = false;
        this.minimumLevel = 0;
    }
}
__decorate([
    primitiveTrait({
        name: "url",
        description: "The Mapbox server url.",
        type: "string"
    })
], MapboxStyleCatalogItemTraits.prototype, "url", void 0);
__decorate([
    primitiveTrait({
        name: "accessToken",
        description: "The username of the map account.",
        type: "string"
    })
], MapboxStyleCatalogItemTraits.prototype, "username", void 0);
__decorate([
    primitiveTrait({
        name: "styleId",
        description: "The Mapbox Style ID. eg 'streets-v11', 'outdoors-v11'. You can find more styleIds for the 'mapbox' user here: https://docs.mapbox.com/api/maps/styles/#mapbox-styles",
        type: "string"
    })
], MapboxStyleCatalogItemTraits.prototype, "styleId", void 0);
__decorate([
    primitiveTrait({
        name: "accessToken",
        description: "The public access token for the imagery.",
        type: "string"
    })
], MapboxStyleCatalogItemTraits.prototype, "accessToken", void 0);
__decorate([
    primitiveTrait({
        name: "tilesize",
        description: "The size of the image tiles.",
        type: "number"
    })
], MapboxStyleCatalogItemTraits.prototype, "tilesize", void 0);
__decorate([
    primitiveTrait({
        name: "scaleFactor",
        description: "When true, the tiles are rendered at a @2x scale factor.",
        type: "boolean"
    })
], MapboxStyleCatalogItemTraits.prototype, "scaleFactor", void 0);
__decorate([
    primitiveTrait({
        name: "scaleFactor",
        description: "The minimum level-of-detail supported by the imagery provider. Take care when specifying this that the number of tiles at the minimum level is small, such as four or less. A larger number is likely to result in rendering problems.",
        type: "number"
    })
], MapboxStyleCatalogItemTraits.prototype, "minimumLevel", void 0);
__decorate([
    primitiveTrait({
        name: "scaleFactor",
        description: "The maximum level-of-detail supported by the imagery provider, or undefined if there is no limit.",
        type: "number"
    })
], MapboxStyleCatalogItemTraits.prototype, "maximumLevel", void 0);
//# sourceMappingURL=MapboxStyleCatalogItemTraits.js.map