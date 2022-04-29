var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberTraits from "./CatalogMemberTraits";
import GroupTraits from "./GroupTraits";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
export class RefineTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Facet name",
        type: "string",
        description: "Name of facet"
    })
], RefineTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        name: "Facet value",
        type: "string",
        description: "Value of facet to use as filter"
    })
], RefineTraits.prototype, "value", void 0);
export default class OpenDataSoftCatalogGroupTraits extends mixTraits(UrlTraits, CatalogMemberTraits, LegendOwnerTraits, GroupTraits) {
    constructor() {
        super(...arguments);
        this.flatten = false;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Flatten",
        description: "True to flatten the layers into a single list; false to use the layer hierarchy."
    })
], OpenDataSoftCatalogGroupTraits.prototype, "flatten", void 0);
__decorate([
    objectArrayTrait({
        name: "Facets filter",
        type: RefineTraits,
        description: "Facets (key/value pairs) to use to filter datasets.",
        idProperty: "name"
    })
], OpenDataSoftCatalogGroupTraits.prototype, "facetFilters", void 0);
//# sourceMappingURL=OpenDataSoftCatalogGroupTraits.js.map