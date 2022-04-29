var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ApiRequestTraits from "./ApiRequestTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";
export default class GeoJsonCatalogItemTraits extends mixTraits(GeoJsonTraits, ApiRequestTraits) {
}
__decorate([
    anyTrait({
        name: "geoJsonData",
        description: "A geojson data object"
    })
], GeoJsonCatalogItemTraits.prototype, "geoJsonData", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "geoJsonString",
        description: "A geojson string"
    })
], GeoJsonCatalogItemTraits.prototype, "geoJsonString", void 0);
__decorate([
    primitiveTrait({
        name: "Response geosjon path",
        type: "string",
        description: "Path to geojson in response. If API response is a list of json objects, this should be the path to the geojson within each object in the list."
    })
], GeoJsonCatalogItemTraits.prototype, "responseGeoJsonPath", void 0);
//# sourceMappingURL=GeoJsonCatalogItemTraits.js.map