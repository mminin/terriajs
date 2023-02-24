var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberTraits from "./CatalogMemberTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import MappableTraits from "./MappableTraits";
import mixTraits from "../mixTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import ImageryProviderTraits from "./ImageryProviderTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
export default class IonImageryCatalogItemTraits extends mixTraits(ImageryProviderTraits, LayerOrderingTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits) {
}
__decorate([
    primitiveTrait({
        name: "Ion Asset ID",
        description: "ID of the Cesium Ion asset to access.",
        type: "number"
    })
], IonImageryCatalogItemTraits.prototype, "ionAssetId", void 0);
__decorate([
    primitiveTrait({
        name: "Ion Access Token",
        description: "Cesium Ion access token to use to access the imagery.",
        type: "string"
    })
], IonImageryCatalogItemTraits.prototype, "ionAccessToken", void 0);
__decorate([
    primitiveTrait({
        name: "Ion Server",
        description: "URL of the Cesium Ion API server.",
        type: "string"
    })
], IonImageryCatalogItemTraits.prototype, "ionServer", void 0);
//# sourceMappingURL=IonImageryCatalogItemTraits.js.map