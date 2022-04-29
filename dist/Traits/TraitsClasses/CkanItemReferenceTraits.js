var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CkanSharedTraits from "./CkanSharedTraits";
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
import mixTraits from "../mixTraits";
import MappableTraits from "./MappableTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
export default class CkanCatalogItemTraits extends mixTraits(UrlTraits, MappableTraits, CkanSharedTraits, CatalogMemberReferenceTraits) {
}
__decorate([
    primitiveTrait({
        name: "Dataset ID",
        description: "The CKAN ID of the dataset.",
        type: "string"
    })
], CkanCatalogItemTraits.prototype, "datasetId", void 0);
__decorate([
    primitiveTrait({
        name: "Magda Record Data",
        description: "The Resource ID of the dataset to use",
        type: "string"
    })
], CkanCatalogItemTraits.prototype, "resourceId", void 0);
//# sourceMappingURL=CkanItemReferenceTraits.js.map