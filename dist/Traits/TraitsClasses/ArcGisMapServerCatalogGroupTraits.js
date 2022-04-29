var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import GroupTraits from "./GroupTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import UrlTraits from "./UrlTraits";
export default class ArcGisMapServerCatalogGroupTraits extends mixTraits(GroupTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits) {
}
__decorate([
    anyTrait({
        name: "Item Properties",
        description: "Sets traits on child ArcGisMapServerCatalogItem's"
    })
], ArcGisMapServerCatalogGroupTraits.prototype, "itemProperties", void 0);
//# sourceMappingURL=ArcGisMapServerCatalogGroupTraits.js.map