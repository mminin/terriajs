var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import ImageryProviderTraits from "./ImageryProviderTraits";
import UrlTraits from "./UrlTraits";
export default class UrlTemplateImageryCatalogItemTraits extends mixTraits(ImageryProviderTraits, LayerOrderingTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.subdomains = [];
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Pick features URL",
        description: "URL template to use to use to pick features. See URL template to use to use to pick features for list of keywords. "
    })
], UrlTemplateImageryCatalogItemTraits.prototype, "pickFeaturesUrl", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Subdomains",
        description: "Array of subdomains, one of which will be prepended to each tile URL. This is useful for overcoming browser limit on the number of simultaneous requests per host. Subdomains will be substituted for ${s} keyword",
        type: "string"
    })
], UrlTemplateImageryCatalogItemTraits.prototype, "subdomains", void 0);
//# sourceMappingURL=UrlTemplateImageryCatalogItemTraits.js.map