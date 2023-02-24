var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import StyleTraits from "./StyleTraits";
// TODO: this is repeated in two files, WMS and WFS. In a global config somewhere?
export const SUPPORTED_CRS_4326 = [
    "EPSG:4326",
    "urn:ogc:def:crs:EPSG::4326",
    "urn:x-ogc:def:crs:EPSG:4326",
    "CRS:84",
    "EPSG:4283"
];
export const SUPPORTED_CRS_3857 = [
    "EPSG:3857",
    "urn:ogc:def:crs:EPSG::3857",
    "urn:x-ogc:def:crs:EPSG:3857",
    "EPSG:900913",
    "urn:ogc:def:crs:EPSG::900913",
    "urn:x-ogc:def:crs:EPSG:900913"
];
export default class WebFeatureServiceCatalogItemTraits extends mixTraits(GeoJsonTraits, GetCapabilitiesTraits) {
    constructor() {
        super(...arguments);
        this.maxFeatures = 1000;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Type Name(s)",
        description: "The type name or names to display."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "typeNames", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Max features",
        description: "Maximum number of features to display."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "maxFeatures", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Srs Name",
        description: `Spatial Reference System to use. For WFS we prefer WGS 84 (${SUPPORTED_CRS_4326.join(", ")}). With WFS requests it is best to use the urn identifier for the srsName, to enforce lat,long order in returned results.`
    })
], WebFeatureServiceCatalogItemTraits.prototype, "srsName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Output Format",
        description: "Output format to request for WFS requests. We prefer GeoJSON. We support gml3 and gml3.1.1 but only in EPSG:4326 projection or similar."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "outputFormat", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass to the WFS Server when requesting features."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "parameters", void 0);
__decorate([
    objectTrait({
        type: StyleTraits,
        name: "Style",
        description: "Styling rules that follow [simplestyle-spec](https://github.com/mapbox/simplestyle-spec)"
    })
], WebFeatureServiceCatalogItemTraits.prototype, "style", void 0);
//# sourceMappingURL=WebFeatureServiceCatalogItemTraits.js.map