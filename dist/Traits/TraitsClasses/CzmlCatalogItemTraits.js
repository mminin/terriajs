var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import AutoRefreshingTraits from "./AutoRefreshingTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import DiscretelyTimeVaryingTraits from "./DiscretelyTimeVaryingTraits";
import FeatureInfoTraits from "./FeatureInfoTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
export default class CzmlCatalogItemTraits extends mixTraits(AutoRefreshingTraits, DiscretelyTimeVaryingTraits, FeatureInfoTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits, MappableTraits) {
}
__decorate([
    anyTrait({
        name: "CZML Data",
        description: "A CZML data array."
    })
], CzmlCatalogItemTraits.prototype, "czmlData", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "CZML String",
        description: "A CZML string."
    })
], CzmlCatalogItemTraits.prototype, "czmlString", void 0);
//# sourceMappingURL=CzmlCatalogItemTraits.js.map