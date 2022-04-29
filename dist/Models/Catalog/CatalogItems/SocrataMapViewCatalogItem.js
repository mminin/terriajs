var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, runInAction } from "mobx";
import loadJson from "../../../Core/loadJson";
import TerriaError from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GeoJsonMixin, { toFeatureCollection } from "../../../ModelMixins/GeojsonMixin";
import SocrataMapViewCatalogItemTraits from "../../../Traits/TraitsClasses/SocrataMapViewCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
/** This will fetch `views` for a given Socrata `resourceId`.
 * From the JSON response we get `childViews` - which can be used to generate a URL to fetch GeoJSON
 */
export class SocrataMapViewStratum extends LoadableStratum(SocrataMapViewCatalogItemTraits) {
    constructor(catalogItem, view) {
        super();
        this.catalogItem = catalogItem;
        this.view = view;
    }
    static async load(catalogGroup) {
        var _a;
        if (!catalogGroup.url)
            throw "`url` must be set";
        if (!catalogGroup.resourceId)
            throw "`resourceId` must be set";
        const viewResponse = await loadJson(proxyCatalogItemUrl(catalogGroup, `${catalogGroup.url}/views/${catalogGroup.resourceId}`));
        if (viewResponse.error) {
            throw (_a = viewResponse.message) !== null && _a !== void 0 ? _a : viewResponse.error;
        }
        return new SocrataMapViewStratum(catalogGroup, viewResponse);
    }
    get geojsonUrl() {
        var _a, _b;
        if ((_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.childViews) === null || _b === void 0 ? void 0 : _b[0])
            return `${this.catalogItem.url}/resource/${this.view.childViews[0]}.geojson?$limit=10000`;
    }
    duplicateLoadableStratum(model) {
        return new SocrataMapViewStratum(model, this.view);
    }
}
SocrataMapViewStratum.stratumName = "socrataMapView";
__decorate([
    computed
], SocrataMapViewStratum.prototype, "geojsonUrl", null);
StratumOrder.addLoadStratum(SocrataMapViewStratum.stratumName);
/**
 * Use the Socrata `views` API to fetch data.
 * This mimics how Socrata portal map visualisation works - it isn't an official API
 */
export default class SocrataMapViewCatalogItem extends GeoJsonMixin(CatalogMemberMixin(CreateModel(SocrataMapViewCatalogItemTraits))) {
    get type() {
        return SocrataMapViewCatalogItem.type;
    }
    async forceLoadMetadata() {
        if (!this.strata.has(SocrataMapViewStratum.stratumName)) {
            const stratum = await SocrataMapViewStratum.load(this);
            runInAction(() => {
                this.strata.set(SocrataMapViewStratum.stratumName, stratum);
            });
        }
    }
    async forceLoadGeojsonData() {
        if (this.geojsonUrl) {
            const result = await loadJson(proxyCatalogItemUrl(this, this.geojsonUrl));
            const fc = toFeatureCollection(result);
            if (fc)
                return fc;
            else
                throw TerriaError.from("Failed to parse geoJSON");
        }
        throw TerriaError.from("Failed to fetch geoJSON - no URL was provided");
    }
}
SocrataMapViewCatalogItem.type = "socrata-map-item";
//# sourceMappingURL=SocrataMapViewCatalogItem.js.map