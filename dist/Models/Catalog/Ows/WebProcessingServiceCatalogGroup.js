var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import { isJsonObject } from "../../../Core/Json";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import runLater from "../../../Core/runLater";
import TerriaError from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GetCapabilitiesMixin from "../../../ModelMixins/GetCapabilitiesMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import WebProcessingServiceCatalogGroupTraits from "../../../Traits/TraitsClasses/WebProcessingServiceCatalogGroupTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import WebProcessingServiceCapabilities from "./WebProcessingServiceCapabilities";
import WebProcessingServiceCatalogFunction from "./WebProcessingServiceCatalogFunction";
class GetCapabilitiesStratum extends LoadableStratum(WebProcessingServiceCatalogGroupTraits) {
    constructor(model, capabilities) {
        super();
        this.model = model;
        this.capabilities = capabilities;
    }
    duplicateLoadableStratum(model) {
        return new GetCapabilitiesStratum(model, this.capabilities);
    }
    static async load(model) {
        if (model.getCapabilitiesUrl === undefined) {
            throw new TerriaError({
                title: i18next.t("models.webProcessingServiceCatalogGroup.missingUrlTitle"),
                message: i18next.t("models.webProcessingServiceCatalogGroup.missingUrlMessage")
            });
        }
        const capabilities = await WebProcessingServiceCapabilities.fromUrl(proxyCatalogItemUrl(model, model.getCapabilitiesUrl, model.getCapabilitiesCacheDuration));
        const stratum = new GetCapabilitiesStratum(model, capabilities);
        return stratum;
    }
    get name() {
        const title = this.capabilities.ServiceIdentification.Title;
        if (title !== undefined) {
            return replaceUnderscores(title);
        }
    }
    get info() {
        var _a;
        const result = [];
        const service = this.capabilities.ServiceIdentification;
        if (service.Abstract) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webProcessingServiceCatalogGroup.abstract"),
                content: service.Abstract
            }));
        }
        if (service.AccessConstraints &&
            !/^none$/i.test(service.AccessConstraints)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webProcessingServiceCatalogGroup.accessConstraints"),
                content: service.AccessConstraints
            }));
        }
        // Show the Fees if it isn't "none".
        if (service.Fees && !/^none$/i.test(service.Fees)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webProcessingServiceCatalogGroup.fees"),
                content: service.Fees
            }));
        }
        const serviceProvider = this.capabilities.ServiceProvider;
        if (serviceProvider) {
            if (serviceProvider.ProviderName) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webProcessingServiceCatalogGroup.providerName"),
                    content: serviceProvider.ProviderName
                }));
            }
            if ((_a = serviceProvider.ProviderSite) === null || _a === void 0 ? void 0 : _a["xlink:href"]) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webProcessingServiceCatalogGroup.providerSite"),
                    content: serviceProvider.ProviderSite["xlink:href"]
                }));
            }
        }
        return result;
    }
    get members() {
        var _a, _b;
        return filterOutUndefined((_b = (_a = this.capabilities.ProcessOfferings) === null || _a === void 0 ? void 0 : _a.map(process => this.getProcessId(process))) !== null && _b !== void 0 ? _b : []);
    }
    getProcessId(process) {
        if (this.model.uniqueId !== undefined) {
            return `${this.model.uniqueId}/${process.Identifier}`;
        }
    }
    createMembersForProcesses() {
        var _a;
        (_a = this.capabilities.ProcessOfferings) === null || _a === void 0 ? void 0 : _a.forEach(process => this.createMemberForProcess(process));
    }
    createMemberForProcess(process) {
        const processId = this.getProcessId(process);
        if (processId === undefined) {
            return;
        }
        const memberModel = this.getOrCreateWPSCatalogFunction(processId);
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        memberModel.strata.delete(stratum);
        memberModel.setTrait(stratum, "name", process.Title);
        memberModel.setTrait(stratum, "url", this.model.url);
        memberModel.setTrait(stratum, "identifier", process.Identifier);
        memberModel.setTrait(stratum, "description", process.Abstract);
        const itemProperties = this.model.itemProperties;
        if (isJsonObject(itemProperties)) {
            Object.keys(itemProperties).forEach((key) => {
                if (key in memberModel.traits)
                    memberModel.setTrait(stratum, key, itemProperties[key]);
            });
        }
    }
    getOrCreateWPSCatalogFunction(id) {
        const terria = this.model.terria;
        const existingModel = terria.getModelById(WebProcessingServiceCatalogFunction, id);
        if (existingModel !== undefined) {
            return existingModel;
        }
        const wpsItem = new WebProcessingServiceCatalogFunction(id, terria);
        terria.addModel(wpsItem);
        return wpsItem;
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
], GetCapabilitiesStratum.prototype, "createMemberForProcess", null);
__decorate([
    action
], GetCapabilitiesStratum, "load", null);
export default class WebProcessingServiceCatalogGroup extends GroupMixin(GetCapabilitiesMixin(UrlMixin(CatalogMemberMixin(CreateModel(WebProcessingServiceCatalogGroupTraits))))) {
    get type() {
        return WebProcessingServiceCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.webProcessingServiceCatalogGroup.typeName");
    }
    async forceLoadMetadata() {
        const stratum = await GetCapabilitiesStratum.load(this);
        runInAction(() => {
            this.strata.set(GetCapabilitiesMixin.getCapabilitiesStratumName, stratum);
        });
    }
    async forceLoadMembers() {
        const getCapabilitiesStratum = (this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName));
        if (getCapabilitiesStratum) {
            await runLater(() => getCapabilitiesStratum.createMembersForProcesses());
        }
    }
    get defaultGetCapabilitiesUrl() {
        return this.url === undefined
            ? undefined
            : new URI(this.url)
                .search({
                service: "WPS",
                request: "GetCapabilities",
                version: "1.0.0"
            })
                .toString();
    }
}
WebProcessingServiceCatalogGroup.type = "wps-getCapabilities";
__decorate([
    computed
], WebProcessingServiceCatalogGroup.prototype, "defaultGetCapabilitiesUrl", null);
//# sourceMappingURL=WebProcessingServiceCatalogGroup.js.map