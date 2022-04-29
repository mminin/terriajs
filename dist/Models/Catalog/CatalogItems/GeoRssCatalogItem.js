var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import getFilenameFromUri from "terriajs-cesium/Source/Core/getFilenameFromUri";
import RuntimeError from "terriajs-cesium/Source/Core/RuntimeError";
import isDefined from "../../../Core/isDefined";
import loadXML from "../../../Core/loadXML";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import { geoRss2ToGeoJson, geoRssAtomToGeoJson } from "../../../Map/geoRssConvertor";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import GeoRssCatalogItemTraits from "../../../Traits/TraitsClasses/GeoRssCatalogItemTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import GeoJsonCatalogItem from "./GeoJsonCatalogItem";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
var GeoRssFormat;
(function (GeoRssFormat) {
    GeoRssFormat["RSS"] = "rss";
    GeoRssFormat["ATOM"] = "feed";
})(GeoRssFormat || (GeoRssFormat = {}));
class GeoRssStratum extends LoadableStratum(GeoRssCatalogItemTraits) {
    constructor(_item, _geoJsonItem, _feed) {
        super();
        this._item = _item;
        this._geoJsonItem = _geoJsonItem;
        this._feed = _feed;
    }
    duplicateLoadableStratum(newModel) {
        return new GeoRssStratum(newModel, this._geoJsonItem, this._feed);
    }
    get feedData() {
        return this._feed;
    }
    get geoJsonItem() {
        return this._geoJsonItem;
    }
    static async load(item) {
        try {
            const geoJsonItem = new GeoJsonCatalogItem(createGuid(), item.terria, item);
            geoJsonItem.setTrait(CommonStrata.definition, "clampToGround", item.clampToGround);
            geoJsonItem.setTrait(CommonStrata.definition, "attribution", item.attribution);
            const json = await loadGeoRss(item);
            if (isDefined(json.geoJsonData)) {
                geoJsonItem.setTrait(CommonStrata.definition, "geoJsonData", json.geoJsonData);
            }
            const feed = json.metadata;
            (await geoJsonItem.loadMetadata()).throwIfError();
            return new GeoRssStratum(item, geoJsonItem, feed);
        }
        catch (e) {
            throw networkRequestError(TerriaError.from(e, {
                title: i18next.t("models.georss.errorLoadingTitle"),
                message: i18next.t("models.georss.errorLoadingMessage")
            }));
        }
    }
    get name() {
        if (this._feed.title && this._feed.title.length > 0) {
            return replaceUnderscores(this._feed.title);
        }
    }
    get dataCustodian() {
        if (this._feed &&
            this._feed.author &&
            this._feed.author.name &&
            this._feed.author.name.length > 0) {
            return this._feed.author.name;
        }
    }
    get info() {
        var _a, _b, _c, _d;
        return [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.subtitle"),
                content: this._feed.subtitle
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.updated"),
                content: (_a = this._feed.updated) === null || _a === void 0 ? void 0 : _a.toString()
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.category"),
                content: (_b = this._feed.category) === null || _b === void 0 ? void 0 : _b.join(", ")
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.description"),
                content: this._feed.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.copyrightText"),
                content: this._feed.copyright
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.author"),
                content: (_c = this._feed.author) === null || _c === void 0 ? void 0 : _c.name
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.georss.link"),
                content: typeof this._feed.link === "string"
                    ? this._feed.link
                    : (_d = this._feed.link) === null || _d === void 0 ? void 0 : _d.join(", ")
            })
        ];
    }
}
GeoRssStratum.stratumName = "georss";
__decorate([
    computed
], GeoRssStratum.prototype, "name", null);
__decorate([
    computed
], GeoRssStratum.prototype, "dataCustodian", null);
__decorate([
    computed
], GeoRssStratum.prototype, "info", null);
StratumOrder.addLoadStratum(GeoRssStratum.stratumName);
export default class GeoRssCatalogItem extends MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(GeoRssCatalogItemTraits)))) {
    get type() {
        return GeoRssCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.georss.name");
    }
    forceLoadMetadata() {
        return GeoRssStratum.load(this).then(stratum => {
            runInAction(() => {
                this.strata.set(GeoRssStratum.stratumName, stratum);
            });
        });
    }
    async forceLoadMapItems() {
        if (isDefined(this.geoJsonItem)) {
            return (await this.geoJsonItem.loadMapItems()).throwIfError();
        }
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get geoJsonItem() {
        const stratum = this.strata.get(GeoRssStratum.stratumName);
        return isDefined(stratum) ? stratum.geoJsonItem : undefined;
    }
    get feedData() {
        const stratum = this.strata.get(GeoRssStratum.stratumName);
        return isDefined(stratum) ? stratum.feedData : undefined;
    }
    get mapItems() {
        if (isDefined(this.geoJsonItem)) {
            return this.geoJsonItem.mapItems.map(mapItem => {
                mapItem.show = this.show;
                return mapItem;
            });
        }
        return [];
    }
}
GeoRssCatalogItem.type = "georss";
__decorate([
    computed
], GeoRssCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], GeoRssCatalogItem.prototype, "geoJsonItem", null);
__decorate([
    computed
], GeoRssCatalogItem.prototype, "feedData", null);
function loadGeoRss(item) {
    return new Promise(resolve => {
        if (isDefined(item.geoRssString)) {
            const parser = new DOMParser();
            resolve(parser.parseFromString(item.geoRssString, "text/xml"));
        }
        else if (isDefined(item.url)) {
            resolve(loadXML(proxyCatalogItemUrl(item, item.url)));
        }
        else {
            throw new TerriaError({
                sender: item,
                title: i18next.t("models.georss.unableToLoadItemTitle"),
                message: i18next.t("models.georss.unableToLoadItemMessage")
            });
        }
    }).then(xmlData => {
        const documentElement = xmlData.documentElement;
        if (documentElement.localName.includes(GeoRssFormat.ATOM)) {
            const jsonData = {
                geoJsonData: geoRssAtomToGeoJson(xmlData),
                metadata: parseMetadata(documentElement.childNodes, item)
            };
            return jsonData;
        }
        else if (documentElement.localName === GeoRssFormat.RSS) {
            const element = documentElement.getElementsByTagName("channel")[0];
            const jsonData = {
                geoJsonData: geoRss2ToGeoJson(xmlData),
                metadata: parseMetadata(element.childNodes, item)
            };
            return jsonData;
        }
        else {
            throw new RuntimeError("document is not valid");
        }
    });
}
function parseMetadata(xmlElements, item) {
    const result = {};
    result.link = [];
    result.category = [];
    for (let i = 0; i < xmlElements.length; ++i) {
        const child = xmlElements[i];
        if (child.nodeType !== 1 ||
            child.localName === "item" ||
            child.localName === "entry") {
            continue;
        }
        if (child.localName === "id") {
            result.id = child.textContent || undefined;
        }
        else if (child.localName === "title") {
            result.title = child.textContent || undefined;
        }
        else if (child.localName === "subtitle") {
            result.subtitle = child.textContent || undefined;
        }
        else if (child.localName === "description") {
            result.description = child.textContent || undefined;
        }
        else if (child.localName === "category") {
            if (child.textContent) {
                result.category.push(child.textContent);
            }
        }
        else if (child.localName === "link") {
            if (child.textContent) {
                result.link.push(child.textContent);
            }
            else {
                const href = child.getAttribute("href");
                if (href) {
                    result.link.push(href);
                }
            }
        }
        else if (child.localName === "updated") {
            result.updated = child.textContent || undefined;
        }
        else if (child.localName === "rights" ||
            child.localName === "copyright") {
            result.copyright = child.textContent || undefined;
        }
        else if (child.localName === "author") {
            const authorNode = child.childNodes;
            if (authorNode.length === 0) {
                result.author = {
                    name: child.textContent || undefined
                };
            }
            else {
                let name, email, link;
                for (let authorIndex = 0; authorIndex < authorNode.length; ++authorIndex) {
                    const authorChild = authorNode[authorIndex];
                    if (authorChild.nodeType === 1) {
                        if (authorChild.localName === "name") {
                            name = authorChild.textContent || undefined;
                        }
                        else if (authorChild.localName === "email") {
                            email = authorChild.textContent || undefined;
                        }
                        if (authorChild.localName === "link") {
                            link = authorChild.textContent || undefined;
                        }
                    }
                }
                result.author = {
                    name: name,
                    email: email,
                    link: link
                };
            }
        }
    }
    if (item.url && (!isDefined(result.title) || result.title === item.url)) {
        result.title = getFilenameFromUri(item.url);
    }
    return result;
}
//# sourceMappingURL=GeoRssCatalogItem.js.map