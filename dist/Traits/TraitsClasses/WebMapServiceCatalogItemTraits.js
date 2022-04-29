var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import { traitClass } from "../Trait";
import CatalogMemberTraits from "./CatalogMemberTraits";
import DiffableTraits from "./DiffableTraits";
import ExportWebCoverageServiceTraits from "./ExportWebCoverageServiceTraits";
import FeatureInfoTraits from "./FeatureInfoTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import LegendTraits from "./LegendTraits";
import MappableTraits from "./MappableTraits";
import { MinMaxLevelTraits } from "./MinMaxLevelTraits";
import RasterLayerTraits from "./RasterLayerTraits";
import UrlTraits from "./UrlTraits";
export const SUPPORTED_CRS_3857 = ["EPSG:3857", "EPSG:900913"];
export const SUPPORTED_CRS_4326 = ["EPSG:4326", "CRS:84", "EPSG:4283"];
export class WebMapServiceAvailableStyleTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style Name",
        description: "The name of the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Title",
        description: "The title of the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Abstract",
        description: "The abstract describing the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "abstract", void 0);
__decorate([
    objectTrait({
        type: LegendTraits,
        name: "Style Name",
        description: "The name of the style."
    })
], WebMapServiceAvailableStyleTraits.prototype, "legend", void 0);
export class WebMapServiceAvailableLayerStylesTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer Name",
        description: "The name of the layer for which styles are available."
    })
], WebMapServiceAvailableLayerStylesTraits.prototype, "layerName", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableStyleTraits,
        name: "Styles",
        description: "The styles available for this layer.",
        idProperty: "name"
    })
], WebMapServiceAvailableLayerStylesTraits.prototype, "styles", void 0);
export class WebMapServiceAvailableDimensionTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Dimension Name",
        description: "The name of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "name", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Dimension values",
        description: "Possible dimension values."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "values", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Units",
        description: "The units of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "units", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Unit Symbol",
        description: "The unitSymbol of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "unitSymbol", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Default",
        description: "The default value for the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "default", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Multiple Values",
        description: "Can the dimension support multiple values."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "multipleValues", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Nearest Value",
        description: "The nearest value of the dimension."
    })
], WebMapServiceAvailableDimensionTraits.prototype, "nearestValue", void 0);
export class WebMapServiceAvailableLayerDimensionsTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer Name",
        description: "The name of the layer for which dimensions are available."
    })
], WebMapServiceAvailableLayerDimensionsTraits.prototype, "layerName", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableDimensionTraits,
        name: "Dimensions",
        description: "The dimensions available for this layer.",
        idProperty: "name"
    })
], WebMapServiceAvailableLayerDimensionsTraits.prototype, "dimensions", void 0);
let WebMapServiceCatalogItemTraits = class WebMapServiceCatalogItemTraits extends mixTraits(ExportWebCoverageServiceTraits, DiffableTraits, FeatureInfoTraits, LayerOrderingTraits, GetCapabilitiesTraits, RasterLayerTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits, MinMaxLevelTraits) {
    constructor() {
        super(...arguments);
        this.tileWidth = 256;
        this.tileHeight = 256;
        this.maxRefreshIntervals = 1000;
        this.disableDimensionSelectors = false;
        this.isGeoServer = false;
        this.isEsri = false;
        this.isThredds = false;
        this.isNcWMS = false;
        this.supportsColorScaleRange = false;
        this.supportsGetLegendGraphic = false;
        this.colorScaleMinimum = -50;
        this.colorScaleMaximum = 50;
    }
};
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer(s)",
        description: "The layer or layers to display (comma separated values)."
    })
], WebMapServiceCatalogItemTraits.prototype, "layers", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style(s)",
        description: "The styles to use with each of the `Layer(s)` (comma separated values). This maps one-to-one with `Layer(s)`"
    })
], WebMapServiceCatalogItemTraits.prototype, "styles", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style(s)",
        description: `CRS to use with WMS layers. We support Web Mercator (${SUPPORTED_CRS_3857.join(", ")}) and WGS 84 (${SUPPORTED_CRS_4326.join(", ")})`
    })
], WebMapServiceCatalogItemTraits.prototype, "crs", void 0);
__decorate([
    anyTrait({
        name: "Dimensions",
        description: "Dimension parameters used to request a particular layer along one or more dimensional axes (including elevation, excluding time). Do not include `_dim` prefx for parameter keys. These dimensions will be applied to all layers (if applicable)"
    })
], WebMapServiceCatalogItemTraits.prototype, "dimensions", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableLayerStylesTraits,
        name: "Available Styles",
        description: "The available styles.",
        idProperty: "layerName"
    })
], WebMapServiceCatalogItemTraits.prototype, "availableStyles", void 0);
__decorate([
    objectArrayTrait({
        type: WebMapServiceAvailableLayerDimensionsTraits,
        name: "Available Dimensions",
        description: "The available dimensions.",
        idProperty: "layerName"
    })
], WebMapServiceCatalogItemTraits.prototype, "availableDimensions", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass to the MapServer when requesting images. Style parameters are stored as CSV in `styles`, dimension parameters are stored in `dimensions`."
    })
], WebMapServiceCatalogItemTraits.prototype, "parameters", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Tile width (in pixels)",
        description: "Tile width in pixels. This will be added to `GetMap` requests for map tiles using the `width` parameter. Default value is 256 pixels"
    })
], WebMapServiceCatalogItemTraits.prototype, "tileWidth", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Tile height (in pixels)",
        description: "Tile height in pixels. This will be added to `GetMap` requests for map tiles using the `height` parameter. Default value is 256 pixels"
    })
], WebMapServiceCatalogItemTraits.prototype, "tileHeight", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum Refresh Intervals",
        description: "The maximum number of discrete times that can be created by a single " +
            "date range, when specified in the format time/time/periodicity. E.g. " +
            "`2015-04-27T16:15:00/2015-04-27T18:45:00/PT15M` has 11 times."
    })
], WebMapServiceCatalogItemTraits.prototype, "maxRefreshIntervals", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable dimension selectors",
        description: "When true, disables the dimension selectors in the workbench."
    })
], WebMapServiceCatalogItemTraits.prototype, "disableDimensionSelectors", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is GeoServer",
        description: "True if this WMS is a GeoServer; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isGeoServer", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is Esri",
        description: "True if this WMS is from Esri; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isEsri", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is Thredds",
        description: "True if this WMS is from a THREDDS server; otherwise, false."
    })
], WebMapServiceCatalogItemTraits.prototype, "isThredds", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is NcWMS",
        description: "True if this WMS supports NcWMS."
    })
], WebMapServiceCatalogItemTraits.prototype, "isNcWMS", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports color scale range",
        description: "Gets or sets whether this WMS server has been identified as supporting the COLORSCALERANGE parameter."
    })
], WebMapServiceCatalogItemTraits.prototype, "supportsColorScaleRange", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports GetLegendGraphic requests",
        description: "Gets or sets whether this WMS server supports GetLegendGraphic requests."
    })
], WebMapServiceCatalogItemTraits.prototype, "supportsGetLegendGraphic", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Color scale minimum",
        description: "The minumum of the color scale range. Because COLORSCALERANGE is a non-standard property supported by ncWMS servers, this property is ignored unless WebMapServiceCatalogItem's supportsColorScaleRange is true. WebMapServiceCatalogItem's colorScaleMaximum must be set as well."
    })
], WebMapServiceCatalogItemTraits.prototype, "colorScaleMinimum", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Color scale maximum",
        description: "The maximum of the color scale range. Because COLORSCALERANGE is a non-standard property supported by ncWMS servers, this property is ignored unless WebMapServiceCatalogItem's supportsColorScaleRange is true. WebMapServiceCatalogItem's colorScaleMinimum must be set as well."
    })
], WebMapServiceCatalogItemTraits.prototype, "colorScaleMaximum", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum shown feature infos",
        description: 'The maximum number of "feature infos" that can be displayed in feature info panel.'
    })
], WebMapServiceCatalogItemTraits.prototype, "maximumShownFeatureInfos", void 0);
WebMapServiceCatalogItemTraits = __decorate([
    traitClass({
        description: `Creates a single item in the catalog from one or many WMS layers.

<strong>Note:</strong> <i>To present all layers in an available WMS as individual items in the catalog use the \`WebMapServiceCatalogGroup\`.</i>`,
        example: {
            type: "wms",
            name: "Mangrove Cover",
            url: "https://ows.services.dea.ga.gov.au",
            layers: "mangrove_cover_v2_0_2"
        }
    })
], WebMapServiceCatalogItemTraits);
export default WebMapServiceCatalogItemTraits;
//# sourceMappingURL=WebMapServiceCatalogItemTraits.js.map