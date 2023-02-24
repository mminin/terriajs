var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import getFilenameFromUri from "terriajs-cesium/Source/Core/getFilenameFromUri";
import RuntimeError from "terriajs-cesium/Source/Core/RuntimeError";
import isDefined from "../../../Core/isDefined";
import loadXML from "../../../Core/loadXML";
import readXml from "../../../Core/readXml";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import { networkRequestError } from "../../../Core/TerriaError";
import { geoRss2ToGeoJson, geoRssAtomToGeoJson } from "../../../Map/Vector/geoRssConvertor";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GeoJsonMixin from "../../../ModelMixins/GeojsonMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import GeoRssCatalogItemTraits from "../../../Traits/TraitsClasses/GeoRssCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
var GeoRssFormat;
(function (GeoRssFormat) {
    GeoRssFormat["RSS"] = "rss";
    GeoRssFormat["ATOM"] = "feed";
})(GeoRssFormat || (GeoRssFormat = {}));
class GeoRssStratum extends LoadableStratum(GeoRssCatalogItemTraits) {
    constructor(_item, _feed) {
        super();
        this._item = _item;
        this._feed = _feed;
    }
    duplicateLoadableStratum(newModel) {
        return new GeoRssStratum(newModel, this._feed);
    }
    get name() {
        if (this._feed && this._feed.title && this._feed.title.length > 0) {
            return replaceUnderscores(this._feed.title);
        }
        return super.name;
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
        if (!this._feed) {
            return [];
        }
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
export default class GeoRssCatalogItem extends GeoJsonMixin(UrlMixin(CatalogMemberMixin(CreateModel(GeoRssCatalogItemTraits)))) {
    get type() {
        return GeoRssCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.georss.name");
    }
    setFileInput(file) {
        this._georssFile = file;
    }
    get hasLocalData() {
        return isDefined(this._georssFile);
    }
    parseGeorss(xmlData) {
        const documentElement = xmlData.documentElement;
        let json;
        let metadata;
        if (documentElement.localName.includes(GeoRssFormat.ATOM)) {
            metadata = parseMetadata(documentElement.childNodes, this);
            json = geoRssAtomToGeoJson(xmlData);
        }
        else if (documentElement.localName === GeoRssFormat.RSS) {
            const element = documentElement.getElementsByTagName("channel")[0];
            metadata = parseMetadata(element.childNodes, this);
            json = geoRss2ToGeoJson(xmlData);
        }
        else {
            throw new RuntimeError("document is not valid");
        }
        runInAction(() => {
            this.strata.set(GeoRssStratum.stratumName, new GeoRssStratum(this, metadata));
        });
        return json;
    }
    async forceLoadGeojsonData() {
        let data;
        if (isDefined(this.geoRssString)) {
            const parser = new DOMParser();
            data = parser.parseFromString(this.geoRssString, "text/xml");
        }
        else if (isDefined(this._georssFile)) {
            data = await readXml(this._georssFile);
        }
        else if (isDefined(this.url)) {
            data = await loadXML(proxyCatalogItemUrl(this, this.url));
        }
        if (!data) {
            throw networkRequestError({
                sender: this,
                title: i18next.t("models.georss.errorLoadingTitle"),
                message: i18next.t("models.georss.errorLoadingMessage", {
                    appName: this.terria.appName
                })
            });
        }
        return this.parseGeorss(data);
    }
    forceLoadMetadata() {
        return Promise.resolve();
    }
}
GeoRssCatalogItem.type = "georss";
__decorate([
    computed
], GeoRssCatalogItem.prototype, "hasLocalData", null);
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