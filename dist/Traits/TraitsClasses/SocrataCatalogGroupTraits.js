var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import GroupTraits from "./GroupTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import UrlTraits from "./UrlTraits";
export class FacetFilterTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Facet name",
        type: "string",
        description: "Name of facet"
    })
], FacetFilterTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        name: "Facet value",
        type: "string",
        description: "Value of facet to use as filter"
    })
], FacetFilterTraits.prototype, "value", void 0);
export default class SocrataCatalogGroupTraits extends mixTraits(UrlTraits, CatalogMemberTraits, LegendOwnerTraits, GroupTraits) {
    constructor() {
        super(...arguments);
        this.facetGroups = ["tags", "categories"];
        this.filterQuery = {};
    }
}
__decorate([
    primitiveArrayTrait({
        name: "Facet groups",
        description: "Facets to include in group structure. By default, `tags` and `categories` will be used,",
        type: "string"
    })
], SocrataCatalogGroupTraits.prototype, "facetGroups", void 0);
__decorate([
    objectArrayTrait({
        name: "Facets filter",
        type: FacetFilterTraits,
        description: "Facets (key/value pairs) to use to filter datasets.",
        idProperty: "name"
    })
], SocrataCatalogGroupTraits.prototype, "facetFilters", void 0);
__decorate([
    anyTrait({
        name: "Filter Query",
        description: `Gets or sets the filter query to pass to Socrata when querying the available data sources and their groups.`
    })
], SocrataCatalogGroupTraits.prototype, "filterQuery", void 0);
//# sourceMappingURL=SocrataCatalogGroupTraits.js.map