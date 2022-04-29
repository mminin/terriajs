var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
export default class ArcGisFeatureServerCatalogItemTraits extends mixTraits(UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.clampToGround = true;
        this.useStyleInformationFromService = true;
        this.layerDef = "1=1";
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Clamp to Ground",
        description: "Whether the features in this service should be clamped to the terrain surface."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "clampToGround", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use style information from service",
        description: "Whether to symbolise the data using the drawingInfo object available in the service endpoint."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "useStyleInformationFromService", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "layerDef",
        description: "The 'layerDef' string to pass to the server when requesting geometry."
    })
], ArcGisFeatureServerCatalogItemTraits.prototype, "layerDef", void 0);
//# sourceMappingURL=ArcGisFeatureServerCatalogItemTraits.js.map