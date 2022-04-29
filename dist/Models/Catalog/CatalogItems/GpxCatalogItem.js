var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import getFilenameFromUri from "terriajs-cesium/Source/Core/getFilenameFromUri";
import isDefined from "../../../Core/isDefined";
import loadText from "../../../Core/loadText";
import readText from "../../../Core/readText";
import { networkRequestError } from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GeoJsonMixin from "../../../ModelMixins/GeojsonMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import GpxCatalogItemTraits from "../../../Traits/TraitsClasses/GpxCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
const toGeoJSON = require("@mapbox/togeojson");
class GpxCatalogItem extends GeoJsonMixin(UrlMixin(CatalogMemberMixin(CreateModel(GpxCatalogItemTraits)))) {
    get type() {
        return GpxCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.gpx.name");
    }
    setFileInput(file) {
        this._gpxFile = file;
    }
    get hasLocalData() {
        return isDefined(this._gpxFile);
    }
    loadGpxText(text) {
        var dom = new DOMParser().parseFromString(text, "text/xml");
        return toGeoJSON.gpx(dom);
    }
    async forceLoadGeojsonData() {
        let data;
        if (isDefined(this.gpxString)) {
            data = this.gpxString;
        }
        else if (isDefined(this._gpxFile)) {
            data = await readText(this._gpxFile);
        }
        else if (isDefined(this.url)) {
            data = await loadText(proxyCatalogItemUrl(this, this.url));
        }
        if (!data) {
            throw networkRequestError({
                sender: this,
                title: i18next.t("models.gpx.errorLoadingTitle"),
                message: i18next.t("models.gpx.errorLoadingMessage", {
                    appName: this.terria.appName
                })
            });
        }
        return this.loadGpxText(data);
    }
    forceLoadMetadata() {
        return Promise.resolve();
    }
    get name() {
        if (this.url && super.name === this.url) {
            return getFilenameFromUri(this.url);
        }
        return super.name;
    }
}
GpxCatalogItem.type = "gpx";
__decorate([
    computed
], GpxCatalogItem.prototype, "hasLocalData", null);
__decorate([
    computed
], GpxCatalogItem.prototype, "name", null);
export default GpxCatalogItem;
//# sourceMappingURL=GpxCatalogItem.js.map