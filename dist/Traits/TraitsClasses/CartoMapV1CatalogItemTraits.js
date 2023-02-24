var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import { traitClass } from "../Trait";
import CatalogMemberTraits from "./CatalogMemberTraits";
import ImageryProviderTraits from "./ImageryProviderTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
let CartoMapV1CatalogItemTraits = class CartoMapV1CatalogItemTraits extends mixTraits(ImageryProviderTraits, LayerOrderingTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
};
__decorate([
    anyTrait({
        name: "Config",
        description: "The configuration information to pass to the Carto Maps API"
    })
], CartoMapV1CatalogItemTraits.prototype, "config", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Authorization token",
        description: "The authorization token to pass to the Carto Maps API"
    })
], CartoMapV1CatalogItemTraits.prototype, "auth_token", void 0);
CartoMapV1CatalogItemTraits = __decorate([
    traitClass({
        description: `The Carto Map V1 API is soon to be deprecated in favor or Carto Map V3 API (See \`CartoMapV3CatalogItem\`). The V1 API generates a XYZ-based URL to fetch Web Mercator projected tiles.`
    })
], CartoMapV1CatalogItemTraits);
export default CartoMapV1CatalogItemTraits;
//# sourceMappingURL=CartoMapV1CatalogItemTraits.js.map