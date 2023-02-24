var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import ImageryProviderTraits from "./ImageryProviderTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import LegendTraits from "./LegendTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
export class WebMapTileServiceAvailableStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.isDefault = false;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style Identifier",
        description: "The identifier of the style."
    })
], WebMapTileServiceAvailableStyleTraits.prototype, "identifier", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Title",
        description: "The title of the style."
    })
], WebMapTileServiceAvailableStyleTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Abstract",
        description: "The abstract describing the style."
    })
], WebMapTileServiceAvailableStyleTraits.prototype, "abstract", void 0);
__decorate([
    objectTrait({
        type: LegendTraits,
        name: "Style Name",
        description: "The name of the style."
    })
], WebMapTileServiceAvailableStyleTraits.prototype, "legend", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Is Default",
        description: "True if this Style is default; otherwise, false."
    })
], WebMapTileServiceAvailableStyleTraits.prototype, "isDefault", void 0);
export class WebMapTileServiceAvailableLayerStylesTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer Name",
        description: "The name of the layer for which styles are available."
    })
], WebMapTileServiceAvailableLayerStylesTraits.prototype, "layerName", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapTileServiceAvailableStyleTraits,
        name: "Styles",
        description: "The styles available for this layer.",
        idProperty: "identifier"
    })
], WebMapTileServiceAvailableLayerStylesTraits.prototype, "styles", void 0);
export default class WebMapServiceCatalogItemTraits extends mixTraits(LayerOrderingTraits, GetCapabilitiesTraits, ImageryProviderTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.isGeoServer = false;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Is GeoServer",
        description: "True if this WMS is a GeoServer; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isGeoServer", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer",
        description: "The layer to display."
    })
], WebMapServiceCatalogItemTraits.prototype, "layer", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style",
        description: "The style to use with `Layer`."
    })
], WebMapServiceCatalogItemTraits.prototype, "style", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapTileServiceAvailableLayerStylesTraits,
        name: "Available Styles",
        description: "The available styles.",
        idProperty: "layerName"
    })
], WebMapServiceCatalogItemTraits.prototype, "availableStyles", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass to the MapServer when requesting images."
    })
], WebMapServiceCatalogItemTraits.prototype, "parameters", void 0);
//# sourceMappingURL=WebMapTileServiceCatalogItemTraits.js.map