var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";
export default class SocrataMapViewCatalogItemTraits extends mixTraits(GeoJsonTraits, CatalogMemberTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "GeoJSON URL",
        description: "The URL to use to download geoJSON."
    })
], SocrataMapViewCatalogItemTraits.prototype, "geojsonUrl", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Resource ID",
        description: "Resource ID to use when querying views. For example `https://data.melbourne.vic.gov.au/views/${resourceId}`"
    })
], SocrataMapViewCatalogItemTraits.prototype, "resourceId", void 0);
//# sourceMappingURL=SocrataMapViewCatalogItemTraits.js.map