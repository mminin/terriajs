var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberTraits from "./CatalogMemberTraits";
import MappableTraits from "./MappableTraits";
import mixTraits from "../mixTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
export default class CesiumTerrainCatalogItemTraits extends mixTraits(UrlTraits, MappableTraits, CatalogMemberTraits) {
}
__decorate([
    primitiveTrait({
        name: "Ion Asset ID",
        type: "number",
        description: "The ID of the Cesium Ion Asset. If this is set url is ignored"
    })
], CesiumTerrainCatalogItemTraits.prototype, "ionAssetId", void 0);
__decorate([
    primitiveTrait({
        name: "Ion Access Token",
        type: "string",
        description: "The Cesium Ion access token to use to access the terrain. If not specified, the token"
    })
], CesiumTerrainCatalogItemTraits.prototype, "ionAccessToken", void 0);
__decorate([
    primitiveTrait({
        name: "Ion Server",
        type: "string",
        description: "the Cesium Ion access token to use to access the terrain. If not specified, the default Ion server, `https://api.cesium.com/`"
    })
], CesiumTerrainCatalogItemTraits.prototype, "ionServer", void 0);
//# sourceMappingURL=CesiumTerrainCatalogItemTraits.js.map