var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import CesiumTerrainProvider from "terriajs-cesium/Source/Core/CesiumTerrainProvider";
import IonResource from "terriajs-cesium/Source/Core/IonResource";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import CesiumTerrainCatalogItemTraits from "../../../Traits/TraitsClasses/CesiumTerrainCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
export default class CesiumTerrainCatalogItem extends UrlMixin(MappableMixin(CatalogMemberMixin(CreateModel(CesiumTerrainCatalogItemTraits)))) {
    get type() {
        return CesiumTerrainCatalogItem.type;
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        let resource = this.url;
        if (this.ionAssetId !== undefined) {
            resource = IonResource.fromAssetId(this.ionAssetId, {
                accessToken: this.ionAccessToken ||
                    this.terria.configParameters.cesiumIonAccessToken,
                server: this.ionServer
            });
            // Deal with errors from this better
        }
        return [
            new CesiumTerrainProvider({
                url: resource,
                credit: this.attribution
            })
        ];
    }
}
CesiumTerrainCatalogItem.type = "cesium-terrain";
__decorate([
    computed
], CesiumTerrainCatalogItem.prototype, "mapItems", null);
//# sourceMappingURL=CesiumTerrainCatalogItem.js.map