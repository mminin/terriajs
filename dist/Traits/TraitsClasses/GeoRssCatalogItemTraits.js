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
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
export default class GeoRssCatalogItemTraits extends mixTraits(UrlTraits, MappableTraits, CatalogMemberTraits, GeoJsonTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.clampToGround = true;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Clamp to Ground",
        description: "Whether the features in this service should be clamped to the terrain surface."
    })
], GeoRssCatalogItemTraits.prototype, "clampToGround", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "geoRssString",
        description: "A GeoRSSstring"
    })
], GeoRssCatalogItemTraits.prototype, "geoRssString", void 0);
//# sourceMappingURL=GeoRssCatalogItemTraits.js.map