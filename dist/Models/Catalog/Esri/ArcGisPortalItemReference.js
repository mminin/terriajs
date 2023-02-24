var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import DOMPurify from "dompurify";
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import { createTransformer } from "mobx-utils";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import AccessControlMixin from "../../../ModelMixins/AccessControlMixin";
import ReferenceMixin from "../../../ModelMixins/ReferenceMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisPortalItemFormatTraits from "../../../Traits/TraitsClasses/ArcGisPortalItemFormatTraits";
import ArcGisPortalItemTraits from "../../../Traits/TraitsClasses/ArcGisPortalItemTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import CatalogMemberFactory from "../CatalogMemberFactory";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
export class ArcGisPortalItemStratum extends LoadableStratum(ArcGisPortalItemTraits) {
    constructor(arcgisPortalItemReference, arcgisPortalCatalogGroup) {
        super();
        this.arcgisPortalItemReference = arcgisPortalItemReference;
        this.arcgisPortalCatalogGroup = arcgisPortalCatalogGroup;
    }
    duplicateLoadableStratum(newModel) {
        return new ArcGisPortalItemStratum(this.arcgisPortalItemReference, this.arcgisPortalCatalogGroup);
    }
    static async load(arcgisPortalItemReference, arcgisPortalCatalogGroup) {
        if (arcgisPortalItemReference._arcgisItem === undefined) {
            if (arcgisPortalItemReference.uniqueId !== undefined) {
                arcgisPortalItemReference._portalRootUrl =
                    arcgisPortalItemReference.url;
                arcgisPortalItemReference._arcgisItem = await loadPortalItem(arcgisPortalItemReference);
                arcgisPortalItemReference.setSupportedFormatFromItem(arcgisPortalItemReference._arcgisItem);
            }
        }
        else if (arcgisPortalCatalogGroup !== undefined) {
            arcgisPortalItemReference._portalRootUrl = arcgisPortalCatalogGroup.url;
        }
        return new ArcGisPortalItemStratum(arcgisPortalItemReference, arcgisPortalCatalogGroup);
    }
    get arcgisPortalItem() {
        if (this.arcgisPortalItemReference._arcgisItem === undefined)
            return undefined;
        return this.arcgisPortalItemReference._arcgisItem;
    }
    get portalItemUrl() {
        if (this.arcgisPortalItem === undefined ||
            this.arcgisPortalItemReference._portalRootUrl === undefined)
            return undefined;
        const uri = new URI(this.arcgisPortalItemReference._portalRootUrl)
            .segment(`/home/item.html`)
            .addQuery("id", this.arcgisPortalItem.id);
        return uri.toString();
    }
    get url() {
        if (this.arcgisPortalItem === undefined)
            return undefined;
        if (this.arcgisPortalItem.type === "Scene Service")
            return `/i3s-to-3dtiles/${this.arcgisPortalItem.url}`;
        return this.arcgisPortalItem.url;
    }
    get name() {
        if (this.arcgisPortalItem === undefined)
            return undefined;
        return this.arcgisPortalItem.title;
    }
    get description() {
        if (this.arcgisPortalItem === undefined)
            return undefined;
        // return this.arcgisPortalItem.description
        return DOMPurify.sanitize(this.arcgisPortalItem.description, {
            FORBID_ATTR: ["style"],
            FORBID_TAGS: ["font"]
        });
    }
    get info() {
        const outArray = [];
        if (this.arcgisPortalItem === undefined)
            return outArray;
        if (this.arcgisPortalItem.licenseInfo !== undefined) {
            outArray.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcgisPortal.licence"),
                content: DOMPurify.sanitize(this.arcgisPortalItem.licenseInfo, {
                    FORBID_ATTR: ["style"],
                    FORBID_TAGS: ["font"]
                })
            }));
        }
        outArray.push(createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.arcgisPortal.openInPortal"),
            content: `<a href="${this.portalItemUrl}"><button>${i18next.t("models.arcgisPortal.openInPortal")}</button></a>`
        }));
        return outArray;
    }
}
ArcGisPortalItemStratum.stratumName = "arcGisPortalDataset";
__decorate([
    computed
], ArcGisPortalItemStratum.prototype, "arcgisPortalItem", null);
__decorate([
    computed
], ArcGisPortalItemStratum.prototype, "portalItemUrl", null);
__decorate([
    computed
], ArcGisPortalItemStratum.prototype, "url", null);
__decorate([
    computed
], ArcGisPortalItemStratum.prototype, "name", null);
__decorate([
    computed
], ArcGisPortalItemStratum.prototype, "description", null);
__decorate([
    computed
], ArcGisPortalItemStratum.prototype, "info", null);
StratumOrder.addLoadStratum(ArcGisPortalItemStratum.stratumName);
export default class ArcGisPortalItemReference extends AccessControlMixin(UrlMixin(ReferenceMixin(CreateModel(ArcGisPortalItemTraits)))) {
    constructor(id, terria, sourceReference, strata) {
        super(id, terria, sourceReference, strata);
        this._arcgisItem = undefined;
        this._arcgisPortalCatalogGroup = undefined;
        this._supportedFormat = undefined;
        this._portalRootUrl = undefined;
        this.setTrait(CommonStrata.defaults, "supportedFormats", ArcGisPortalItemReference.defaultSupportedFormats);
    }
    get type() {
        return ArcGisPortalItemReference.type;
    }
    get typeName() {
        return i18next.t("models.arcgisPortal.name");
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        else if (isDefined(this._arcgisPortalCatalogGroup)) {
            return this._arcgisPortalCatalogGroup.cacheDuration;
        }
        return "0d";
    }
    get preparedSupportedFormats() {
        return (this.supportedFormats && this.supportedFormats.map(prepareSupportedFormat));
    }
    isItemInSupportedFormats(item) {
        if (item === undefined)
            return undefined;
        for (let i = 0; i < this.preparedSupportedFormats.length; ++i) {
            const format = this.preparedSupportedFormats[i];
            // This is a bit clunky but format handling for non-Esri stuff in portal is a bit unpredictable
            if (format.formatRegex === undefined || format.urlRegex === undefined) {
                // eg KML we can match using format regex but not the URL
                if (format.formatRegex) {
                    if (format.formatRegex.test(item.type))
                        return format;
                }
                else if (format.urlRegex) {
                    if (format.urlRegex.test(item.url))
                        return format;
                }
            }
            else {
                if (format.formatRegex.test(item.type) &&
                    format.urlRegex.test(item.url)) {
                    return format;
                }
            }
        }
        return undefined;
    }
    setDataset(item) {
        this._arcgisItem = item;
    }
    setArcgisPortalCatalog(arcgisCatalogGroup) {
        this._arcgisPortalCatalogGroup = arcgisCatalogGroup;
    }
    setSupportedFormatFromItem(item) {
        this._supportedFormat = this.isItemInSupportedFormats(item);
    }
    async setArcgisStrata(model) {
        const stratum = await ArcGisPortalItemStratum.load(this, this._arcgisPortalCatalogGroup);
        if (stratum === undefined)
            return;
        runInAction(() => {
            model.strata.set(ArcGisPortalItemStratum.stratumName, stratum);
        });
    }
    async forceLoadReference(previousTarget) {
        // So when we first crawl we'll get this far
        await this.setArcgisStrata(this);
        // this.setSupportedFormatFromItem(this._arcgisItem);
        if (this._supportedFormat === undefined)
            return undefined;
        // See comments below re this sequence
        const itemDataInfo = await loadAdditionalPortalInfo(this);
        if (itemDataInfo !== undefined && this._arcgisItem !== undefined) {
            if (!itemDataInfo.error && itemDataInfo.layers) {
                if (itemDataInfo.layers.length === 1) {
                    this._arcgisItem.url = `${this._arcgisItem.url}/${itemDataInfo.layers[0].id}`;
                }
            }
            this.setSupportedFormatFromItem(this._arcgisItem);
        }
        // One final catch to handing types
        // Tiled MapServices dont use a single layer
        if (this._arcgisItem !== undefined &&
            this._arcgisItem.type === "Map Service" &&
            this._arcgisItem.typeKeywords.indexOf("Tiled") > -1) {
            const mapServerFormat = this.preparedSupportedFormats.filter((f) => f.definition.type === "esri-mapServer");
            if (mapServerFormat.length === 1)
                this._supportedFormat = mapServerFormat[0];
        }
        const model = CatalogMemberFactory.create(this._supportedFormat.definition.type, this.uniqueId, this.terria, this);
        if (model === undefined)
            return;
        previousTarget = model;
        await this.setArcgisStrata(model);
        const defintionStratum = this.strata.get(CommonStrata.definition);
        if (defintionStratum) {
            model.strata.set(CommonStrata.definition, defintionStratum);
            model.setTrait(CommonStrata.definition, "url", undefined);
        }
        return model;
    }
}
ArcGisPortalItemReference.defaultSupportedFormats = [
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "I3S",
        formatRegex: "Scene Service",
        urlRegex: "SceneServer$|SceneServer/$",
        definition: {
            type: "3d-tiles"
        }
    }),
    // createStratumInstance(ArcGisPortalItemFormatTraits, {
    //   id: "WFS",
    //   formatRegex: "WFS",
    //   urlRegex: "WFSServer",
    //   definition: {
    //     type: "wfs"
    //   }
    // }),
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "WMS",
        formatRegex: "WMS",
        urlRegex: "WMSServer",
        definition: {
            type: "wms"
        }
    }),
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "ArcGIS MapServer Group",
        formatRegex: "Map Service",
        urlRegex: "MapServer$|MapServer/$",
        definition: {
            type: "esri-mapServer-group"
        }
    }),
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "ArcGIS MapServer",
        formatRegex: "Map Service",
        urlRegex: /MapServer\/\d/,
        definition: {
            type: "esri-mapServer"
        }
    }),
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "ArcGIS FeatureServer Group",
        formatRegex: "Feature Service",
        urlRegex: "FeatureServer$|FeatureServer/$",
        definition: {
            type: "esri-featureServer-group"
        }
    }),
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "ArcGIS FeatureServer",
        formatRegex: "Feature Service",
        urlRegex: /FeatureServer\/\d/,
        definition: {
            type: "esri-featureServer"
        }
    }),
    createStratumInstance(ArcGisPortalItemFormatTraits, {
        id: "Kml",
        formatRegex: "KML",
        definition: {
            type: "kml"
        }
    })
];
ArcGisPortalItemReference.type = "arcgis-portal-item";
__decorate([
    computed
], ArcGisPortalItemReference.prototype, "cacheDuration", null);
__decorate([
    computed
], ArcGisPortalItemReference.prototype, "preparedSupportedFormats", null);
async function loadPortalItem(portalItem) {
    var uri = new URI(portalItem._portalRootUrl)
        .segment(`/sharing/rest/content/items/${portalItem.itemId}`)
        .addQuery({ f: "json" });
    const response = await loadJson(proxyCatalogItemUrl(portalItem, uri.toString(), portalItem.cacheDuration));
    return response;
}
// Portal has this weird habit of storing useful additional info about an item
// such as which layers to use from a group of layers at the /data endpoint
// But this only relevant on some layers
async function loadAdditionalPortalInfo(portalItem) {
    if (portalItem._arcgisItem === undefined)
        return undefined;
    const baseUrl = portalItem._portalRootUrl;
    var uri = new URI(baseUrl)
        .segment(`/sharing/rest/content/items/${portalItem._arcgisItem.id}/data`)
        .addQuery({ f: "json" });
    // The request also returns 200 even if the page is blank causing json errors
    // Sometimes it actually returns json containing an error, but not always
    try {
        const response = await loadJson(proxyCatalogItemUrl(portalItem, uri.toString(), portalItem.cacheDuration));
        return response;
    }
    catch (err) {
        return undefined;
    }
}
const prepareSupportedFormat = createTransformer((format) => {
    return {
        urlRegex: format.urlRegex
            ? new RegExp(format.urlRegex, "i")
            : undefined,
        formatRegex: format.formatRegex
            ? new RegExp(format.formatRegex, "i")
            : undefined,
        definition: format.definition || {}
    };
});
//# sourceMappingURL=ArcGisPortalItemReference.js.map