var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import UrlTemplateImageryProvider from "terriajs-cesium/Source/Scene/UrlTemplateImageryProvider";
import isDefined from "../../../Core/isDefined";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlTemplateImageryCatalogItemTraits from "../../../Traits/TraitsClasses/UrlTemplateImageryCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
/** See https://cesium.com/learn/cesiumjs/ref-doc/UrlTemplateImageryProvider.html#url for available keywords:
 * - {z}: The level of the tile in the tiling scheme. Level zero is the root of the quadtree pyramid.
 * - {x}: The tile X coordinate in the tiling scheme, where 0 is the Westernmost tile.
 * - {y}: The tile Y coordinate in the tiling scheme, where 0 is the Northernmost tile.
 * - {s}: One of the available subdomains, used to overcome browser limits on the number of simultaneous requests per host.
 */
export default class UrlTemplateImageryCatalogItem extends MappableMixin(CatalogMemberMixin(CreateModel(UrlTemplateImageryCatalogItemTraits))) {
    get type() {
        return UrlTemplateImageryCatalogItem.type;
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        const imageryProvider = this.imageryProvider;
        if (!isDefined(imageryProvider)) {
            return [];
        }
        return [
            {
                show: this.show,
                alpha: this.opacity,
                imageryProvider,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            }
        ];
    }
    get imageryProvider() {
        if (!isDefined(this.url)) {
            return;
        }
        return new UrlTemplateImageryProvider({
            url: proxyCatalogItemUrl(this, this.url),
            subdomains: this.subdomains.slice(),
            credit: this.attribution,
            maximumLevel: this.maximumLevel,
            minimumLevel: this.minimumLevel,
            tileHeight: this.tileHeight,
            tileWidth: this.tileWidth,
            pickFeaturesUrl: this.pickFeaturesUrl,
            enablePickFeatures: this.allowFeaturePicking
        });
    }
}
UrlTemplateImageryCatalogItem.type = "url-template-imagery";
__decorate([
    computed
], UrlTemplateImageryCatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], UrlTemplateImageryCatalogItem.prototype, "imageryProvider", null);
//# sourceMappingURL=UrlTemplateImageryCatalogItem.js.map