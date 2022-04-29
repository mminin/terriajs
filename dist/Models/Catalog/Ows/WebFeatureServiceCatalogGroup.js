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
import WebFeatureServiceCatalogGroupTraits from "../../../Traits/TraitsClasses/WebFeatureServiceCatalogGroupTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import WebFeatureServiceCapabilities from "./WebFeatureServiceCapabilities";
import WebFeatureServiceCatalogItem from "./WebFeatureServiceCatalogItem";
class GetCapabilitiesStratum extends LoadableStratum(WebFeatureServiceCatalogGroupTraits) {
    constructor(catalogGroup, capabilities) {
        super();
        this.catalogGroup = catalogGroup;
        this.capabilities = capabilities;
    }
    static async load(catalogItem) {
        if (catalogItem.getCapabilitiesUrl === undefined) {
            throw networkRequestError({
                title: i18next.t("models.webFeatureServiceCatalogGroup.invalidWFSServerTitle"),
                message: i18next.t("models.webFeatureServiceCatalogGroup.invalidWFSServerMessage", this)
            });
        }
        const capabilities = await WebFeatureServiceCapabilities.fromUrl(proxyCatalogItemUrl(catalogItem, catalogItem.getCapabilitiesUrl, catalogItem.getCapabilitiesCacheDuration));
        return new GetCapabilitiesStratum(catalogItem, capabilities);
    }
    duplicateLoadableStratum(model) {
        return new GetCapabilitiesStratum(model, this.capabilities);
    }
    get name() {
        if (this.capabilities &&
            this.capabilities.service &&
            this.capabilities.service.Title) {
            return replaceUnderscores(this.capabilities.service.Title);
        }
    }
    get info() {
        const result = [];
        const service = this.capabilities && this.capabilities.service;
        if (service) {
            // Show the service abstract if there is one and if it isn't the Geoserver default "A compliant implementation..."
            if (service &&
                service.Abstract &&
                !containsAny(service.Abstract, WebFeatureServiceCatalogItem.abstractsToIgnore)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webFeatureServiceCatalogGroup.abstract"),
                    content: this.capabilities.service.Abstract
                }));
            }
            // Show the Access Constraints if it isn't "none" (because that's the default, and usually a lie).
            if (service &&
                service.AccessConstraints &&
                !/^none$/i.test(service.AccessConstraints)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webFeatureServiceCatalogGroup.accessConstraints"),
                    content: this.capabilities.service.AccessConstraints
                }));
            }
            // Show the Fees if it isn't "none".
            if (service && service.Fees && !/^none$/i.test(service.Fees)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webFeatureServiceCatalogGroup.fees"),
                    content: this.capabilities.service.Fees
                }));
            }
        }
        return result;
    }
    get members() {
        return filterOutUndefined(this.capabilities.featureTypes.map(layer => this.getLayerId(layer)));
    }
    createMembersFromLayers() {
        this.capabilities.featureTypes.forEach(layer => this.createMemberFromLayer(layer));
    }
    createMemberFromLayer(layer) {
        const layerId = this.getLayerId(layer);
        if (!layerId) {
            return;
        }
        // Create model for WebFeatureServiceCatalogItem
        const existingModel = this.catalogGroup.terria.getModelById(WebFeatureServiceCatalogItem, layerId);
        let model;
        if (existingModel === undefined) {
            model = new WebFeatureServiceCatalogItem(layerId, this.catalogGroup.terria);
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
        model.setTrait(stratum, "typeNames", layer.Name);
        // if user defined following properties on th group level we should pass them to all group members
        model.setTrait(stratum, "hideSource", this.catalogGroup.hideSource);
        model.setTrait(stratum, "isOpenInWorkbench", this.catalogGroup.isOpenInWorkbench);
        model.setTrait(stratum, "isExperiencingIssues", this.catalogGroup.isExperiencingIssues);
        model.createGetCapabilitiesStratumFromParent(this.capabilities);
    }
    getLayerId(layer) {
        if (!isDefined(this.catalogGroup.uniqueId)) {
            return;
        }
        return `${this.catalogGroup.uniqueId}/${layer.Name || layer.Title}`;
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
export default class WebFeatureServiceCatalogGroup extends GetCapabilitiesMixin(UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(WebFeatureServiceCatalogGroupTraits))))) {
    get type() {
        return WebFeatureServiceCatalogGroup.type;
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
                service: "WFS",
                version: "1.1.0",
                request: "GetCapabilities"
            })
                .toString();
        }
        else {
            return undefined;
        }
    }
}
WebFeatureServiceCatalogGroup.type = "wfs-group";
//# sourceMappingURL=WebFeatureServiceCatalogGroup.js.map