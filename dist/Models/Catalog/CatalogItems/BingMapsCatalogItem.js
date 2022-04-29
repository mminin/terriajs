var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import Credit from "terriajs-cesium/Source/Core/Credit";
import BingMapsImageryProvider from "terriajs-cesium/Source/Scene/BingMapsImageryProvider";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import BingMapsCatalogItemTraits from "../../../Traits/TraitsClasses/BingMapsCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
export default class BingMapsCatalogItem extends MappableMixin(CatalogMemberMixin(CreateModel(BingMapsCatalogItemTraits))) {
    get type() {
        return BingMapsCatalogItem.type;
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        const imageryProvider = this._createImageryProvider();
        return [
            {
                imageryProvider,
                show: this.show,
                alpha: this.opacity,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            }
        ];
    }
    _createImageryProvider() {
        const result = new BingMapsImageryProvider({
            url: "//dev.virtualearth.net",
            mapStyle: this.mapStyle,
            key: this.key
        });
        if (this.attribution) {
            result._credit = this.attribution;
        }
        else {
            // open in a new window
            result._credit = new Credit('<a href="http://www.bing.com" target="_blank">Bing</a>');
        }
        result.defaultGamma = 1.0;
        return result;
    }
}
BingMapsCatalogItem.type = "bing-maps";
__decorate([
    computed
], BingMapsCatalogItem.prototype, "mapItems", null);
//# sourceMappingURL=BingMapsCatalogItem.js.map