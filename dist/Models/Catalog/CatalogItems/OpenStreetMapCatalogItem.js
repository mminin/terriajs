var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import UrlTemplateImageryProvider from "terriajs-cesium/Source/Scene/UrlTemplateImageryProvider";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import OpenStreetMapCatalogItemTraits from "../../../Traits/TraitsClasses/OpenStreetMapCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
export default class OpenStreetMapCatalogItem extends MappableMixin(CatalogMemberMixin(CreateModel(OpenStreetMapCatalogItemTraits))) {
    get type() {
        return OpenStreetMapCatalogItem.type;
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
        var _a;
        if (!isDefined(this.templateUrl)) {
            return;
        }
        return new UrlTemplateImageryProvider({
            url: cleanAndProxyUrl(this, this.templateUrl),
            subdomains: this.subdomains.slice(),
            credit: this.attribution,
            maximumLevel: (_a = this.maximumLevel) !== null && _a !== void 0 ? _a : 25,
            minimumLevel: this.minimumLevel,
            tileHeight: this.tileHeight,
            tileWidth: this.tileWidth
        });
    }
    get templateUrl() {
        if (!isDefined(this.url)) {
            return;
        }
        const templateUrl = new URI(this.url);
        if (this.subdomains.length > 0 && this.url.indexOf("{s}") === -1) {
            templateUrl.hostname(`{s}.${templateUrl.hostname()}`);
        }
        const path = templateUrl.path();
        const sep = path[path.length - 1] === "/" ? "" : "/";
        templateUrl.path(`${path}${sep}{z}/{x}/{y}.${this.fileExtension}`);
        return decodeURI(templateUrl.toString());
    }
}
OpenStreetMapCatalogItem.type = "open-street-map";
__decorate([
    computed
], OpenStreetMapCatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], OpenStreetMapCatalogItem.prototype, "imageryProvider", null);
__decorate([
    computed
], OpenStreetMapCatalogItem.prototype, "templateUrl", null);
function cleanAndProxyUrl(catalogItem, url) {
    return proxyCatalogItemUrl(catalogItem, cleanUrl(url));
}
function cleanUrl(url) {
    // Strip off the search portion of the URL
    const uri = new URI(url);
    uri.search("");
    return decodeURI(url.toString());
}
//# sourceMappingURL=OpenStreetMapCatalogItem.js.map