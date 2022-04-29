var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import ArcGISTiledElevationTerrainProvider from "terriajs-cesium/Source/Core/ArcGISTiledElevationTerrainProvider";
import Credit from "terriajs-cesium/Source/Core/Credit";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisTerrainCatalogItemTraits from "../../../Traits/TraitsClasses/ArcGisTerrainCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
export default class ArcGisTerrainCatalogItem extends UrlMixin(MappableMixin(CatalogMemberMixin(CreateModel(ArcGisTerrainCatalogItemTraits)))) {
    get type() {
        return ArcGisTerrainCatalogItem.type;
    }
    get mapItems() {
        if (this.url === undefined)
            return [];
        const item = new ArcGISTiledElevationTerrainProvider({
            url: this.url
        });
        if (this.attribution)
            item.credit = new Credit(this.attribution);
        return [];
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
}
ArcGisTerrainCatalogItem.type = "arcgis-terrain";
__decorate([
    computed
], ArcGisTerrainCatalogItem.prototype, "mapItems", null);
//# sourceMappingURL=ArcGisTerrainCatalogItem.js.map