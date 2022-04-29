var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import containsAny from "../../../Core/containsAny";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import runLater from "../../../Core/runLater";
import { networkRequestError } from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GetCapabilitiesMixin from "../../../ModelMixins/GetCapabilitiesMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import WebMapTileServiceCatalogGroupTraits from "../../../Traits/TraitsClasses/WebMapTileServiceCatalogGroupTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import WebMapTileServiceCapabilities from "./WebMapTileServiceCapabilities";
import WebMapTileServiceCatalogItem from "./WebMapTileServiceCatalogItem";
class GetCapabilitiesStratum extends LoadableStratum(WebMapTileServiceCatalogGroupTraits) {
    constructor(catalogGroup, capabilities) {
        super();
        this.catalogGroup = catalogGroup;
        this.capabilities = capabilities;
    }
    static async load(catalogItem) {
        if (catalogItem.getCapabilitiesUrl === undefined) {
            throw networkRequestError({
                title: i18next.t("models.webMapTileServiceCatalogGroup.invalidWMTSServerTitle"),
                message: i18next.t("models.webMapTileServiceCatalogGroup.invalidWMTSServerMessage", this)
            });
        }
        const capabilities = await WebMapTileServiceCapabilities.fromUrl(proxyCatalogItemUrl(catalogItem, catalogItem.getCapabilitiesUrl, catalogItem.getCapabilitiesCacheDuration));
        return new GetCapabilitiesStratum(catalogItem, capabilities);
    }
    duplicateLoadableStratum(model) {
        return new GetCapabilitiesStratum(model, this.capabilities);
    }
    get name() {
        if (this.capabilities &&
            this.capabilities.ServiceIdentification &&
            this.capabilities.ServiceIdentification.Title) {
            return replaceUnderscores(this.capabilities.ServiceIdentification.Title);
        }
    }
    get info() {
        const result = [];
        const service = this.capabilities.ServiceIdentification;
        if (!isDefined(service)) {
            return result;
        }
        if (service.Abstract &&
            !containsAny(service.Abstract, WebMapTileServiceCatalogItem.abstractsToIgnore)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogGroup.abstract"),
                content: service.Abstract
            }));
        }
        if (service.AccessConstraints &&
            !/^none$/i.test(service.AccessConstraints)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogGroup.accessConstraints"),
                content: service.AccessConstraints
            }));
        }
        // Show the Fees if it isn't "none".
        if (service.Fees && !/^none$/i.test(service.Fees)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogGroup.fees"),
                content: service.Fees
            }));
        }
        return result;
    }
    // Show the Access Constraints if it isn't "none" (because that's the default, and usually a lie).
    get members() {
        return filterOutUndefined(this.capabilities.layers.map(layer => this.getLayerId(layer)));
    }
    createMembersFromLayers() {
        this.capabilities.layers.forEach(layer => this.createMemberFromLayer(layer));
    }
    createMemberFromLayer(layer) {
        const layerId = this.getLayerId(layer);
        if (!layerId) {
            return;
        }
        // Create model for WMTSCatalogItem
        const existingModel = this.catalogGroup.terria.getModelById(WebMapTileServiceCatalogItem, layerId);
        let model;
        if (existingModel === undefined) {
            model = new WebMapTileServiceCatalogItem(layerId, this.catalogGroup.terria);
            this.catalogGroup.terria.addModel(model);
        }
        else {
            model = existingModel;
        }
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        model.strata.delete(stratum);
        model.setTrait(stratum, "name", layer.Title);
        model.setTrait(stratum, "url", this.catalogGroup.url);
        model.setTrait(stratum, "getCapabilitiesUrl", this.catalogGroup.getCapabilitiesUrl);
        model.setTrait(stratum, "getCapabilitiesCacheDuration", this.catalogGroup.getCapabilitiesCacheDuration);
        model.setTrait(stratum, "layer", layer.Title);
        model.setTrait(stratum, "hideSource", this.catalogGroup.hideSource);
        model.setTrait(stratum, "isOpenInWorkbench", this.catalogGroup.isOpenInWorkbench);
        model.setTrait(stratum, "isExperiencingIssues", this.catalogGroup.isExperiencingIssues);
        model.createGetCapabilitiesStratumFromParent(this.capabilities);
    }
    getLayerId(layer) {
        if (!isDefined(this.catalogGroup.uniqueId)) {
            return;
        }
        return `${this.catalogGroup.uniqueId}/${layer.Title || layer.Identifier}`;
    }
}
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "name", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "info", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "members", null);
__decorate([
    action
], GetCapabilitiesStratum.prototype, "createMembersFromLayers", null);
__decorate([
    action
], GetCapabilitiesStratum.prototype, "createMemberFromLayer", null);
export default class WebMapTileServiceCatalogGroup extends GetCapabilitiesMixin(UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(WebMapTileServiceCatalogGroupTraits))))) {
    get type() {
        return WebMapTileServiceCatalogGroup.type;
    }
    async forceLoadMetadata() {
        if (this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName) !==
            undefined)
            return;
        const stratum = await GetCapabilitiesStratum.load(this);
        runInAction(() => {
            this.strata.set(GetCapabilitiesMixin.getCapabilitiesStratumName, stratum);
        });
    }
    async forceLoadMembers() {
        const getCapabilitiesStratum = (this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName));
        if (getCapabilitiesStratum) {
            await runLater(() => getCapabilitiesStratum.createMembersFromLayers());
        }
    }
    get defaultGetCapabilitiesUrl() {
        if (this.uri) {
            return this.uri
                .clone()
                .setSearch({
                service: "WMTS",
                version: "1.0.0",
                request: "GetCapabilities"
            })
                .toString();
        }
        else {
            return undefined;
        }
    }
}
WebMapTileServiceCatalogGroup.type = "wmts-group";
//# sourceMappingURL=WebMapTileServiceCatalogGroup.js.map