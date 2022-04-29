var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import mixTraits from "../mixTraits";
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
import UrlTraits from "./UrlTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class TerriaReferenceTraits extends mixTraits(UrlTraits, CatalogMemberReferenceTraits) {
}
__decorate([
    primitiveTrait({
        name: "Is Open",
        description: "True if this group is open and its contents are visible; otherwise, false. (This only applies if `isGroup = true`)",
        type: "boolean"
    })
], TerriaReferenceTraits.prototype, "isOpen", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Path",
        description: "The path to the catalog item or group in the target catalog file given as a list of IDs. If not given, Terria will create a pseudo-group with all the catalog items in the catalog file as its members."
    })
], TerriaReferenceTraits.prototype, "path", void 0);
//# sourceMappingURL=TerriaReferenceTraits.js.map