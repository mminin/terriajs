var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ArcGisPortalSharedTraits from "./ArcGisPortalSharedTraits";
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
import MappableTraits from "./MappableTraits";
import mixTraits from "../mixTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
export default class ArcGisPortalItemTraits extends mixTraits(UrlTraits, MappableTraits, CatalogMemberReferenceTraits, ArcGisPortalSharedTraits) {
}
__decorate([
    primitiveTrait({
        name: "Item ID",
        description: "The ID of the portal item.",
        type: "string"
    })
], ArcGisPortalItemTraits.prototype, "itemId", void 0);
//# sourceMappingURL=ArcGisPortalItemTraits.js.map