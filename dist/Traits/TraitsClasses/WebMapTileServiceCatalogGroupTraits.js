var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberTraits from "./CatalogMemberTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import GroupTraits from "./GroupTraits";
import mixTraits from "../mixTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
export default class WebMapTileServiceCatalogGroupTraits extends mixTraits(GetCapabilitiesTraits, GroupTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits) {
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Flatten",
        description: "True to flatten the layers into a single list; false to use the layer hierarchy."
    })
], WebMapTileServiceCatalogGroupTraits.prototype, "flatten", void 0);
//# sourceMappingURL=WebMapTileServiceCatalogGroupTraits.js.map