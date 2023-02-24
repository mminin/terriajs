var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, runInAction } from "mobx";
import Resource from "terriajs-cesium/Source/Core/Resource";
import UrlTemplateImageryProvider from "terriajs-cesium/Source/Scene/UrlTemplateImageryProvider";
import isDefined from "../../../Core/isDefined";
import TerriaError from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import CartoMapV1CatalogItemTraits from "../../../Traits/TraitsClasses/CartoMapV1CatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
export class CartoLoadableStratum extends LoadableStratum(CartoMapV1CatalogItemTraits) {
    constructor(catalogItem, tileUrl, tileSubdomains) {
        super();
        this.catalogItem = catalogItem;
        this.tileUrl = tileUrl;
        this.tileSubdomains = tileSubdomains;
    }
    duplicateLoadableStratum(newModel) {
        return new CartoLoadableStratum(newModel, this.tileUrl, this.tileSubdomains);
    }
    static load(catalogItem) {
        let queryParameters;
        queryParameters = {};
        if (catalogItem.auth_token) {
            queryParameters.auth_token = catalogItem.auth_token;
        }
        if (catalogItem.url === undefined) {
            return Promise.reject(new TerriaError({
                title: "Unable to load Carto Map layer",
                message: "The Carto Map layer cannot be loaded the catalog item does not have a `url`."
            }));
        }
        const resource = new Resource({
            url: catalogItem.url,
            headers: {
                "Content-Type": "application/json"
            },
            queryParameters: queryParameters
        });
        return Promise.resolve()
            .then(() => {
            return resource.post(JSON.stringify(catalogItem.config || {}));
        })
            .then((response) => {
            if (response === undefined) {
                throw new TerriaError({
                    sender: this,
                    title: "Could not load Carto Map layer",
                    message: "There was an error loading the data for this catalog item."
                });
            }
            const map = JSON.parse(response);
            let url;
            let subdomains;
            const metadataUrl = map.metadata && map.metadata.url && map.metadata.url.raster;
            if (metadataUrl) {
                url = metadataUrl.urlTemplate;
                subdomains = metadataUrl.subdomains;
            }
            else {
                throw new TerriaError({
                    sender: this,
                    title: "No URL",
                    message: "Unable to find a usable URL for the Carto Map layer."
                });
            }
            const stratum = new CartoLoadableStratum(catalogItem, url, subdomains);
            return stratum;
        });
    }
}
CartoLoadableStratum.stratumName = "cartoLoadable";
StratumOrder.addLoadStratum(CartoLoadableStratum.stratumName);
export default class CartoMapV1CatalogItem extends MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(CartoMapV1CatalogItemTraits)))) {
    get type() {
        return CartoMapV1CatalogItem.type;
    }
    get mapItems() {
        if (isDefined(this.imageryProvider)) {
            return [
                {
                    alpha: this.opacity,
                    show: this.show,
                    imageryProvider: this.imageryProvider,
                    clippingRectangle: this.clipToRectangle
                        ? this.cesiumRectangle
                        : undefined
                }
            ];
        }
        return [];
    }
    forceLoadMapItems() {
        return CartoLoadableStratum.load(this).then((stratum) => {
            runInAction(() => {
                this.strata.set(CartoLoadableStratum.stratumName, stratum);
            });
        });
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get imageryProvider() {
        var _a, _b;
        const stratum = (this.strata.get(CartoLoadableStratum.stratumName));
        if (!isDefined(stratum) || !isDefined(stratum.tileUrl)) {
            return;
        }
        let subdomains;
        if (isDefined(stratum.tileSubdomains)) {
            subdomains = stratum.tileSubdomains.slice();
        }
        return new UrlTemplateImageryProvider({
            url: proxyCatalogItemUrl(this, stratum.tileUrl),
            maximumLevel: (_a = this.maximumLevel) !== null && _a !== void 0 ? _a : 25,
            minimumLevel: (_b = this.minimumLevel) !== null && _b !== void 0 ? _b : 0,
            credit: this.attribution,
            subdomains: subdomains,
            tileHeight: this.tileHeight,
            tileWidth: this.tileWidth
        });
    }
}
CartoMapV1CatalogItem.type = "carto";
__decorate([
    computed
], CartoMapV1CatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], CartoMapV1CatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], CartoMapV1CatalogItem.prototype, "imageryProvider", null);
//# sourceMappingURL=CartoMapV1CatalogItem.js.map