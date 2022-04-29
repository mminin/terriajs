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
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import runLater from "../../../Core/runLater";
import { networkRequestError } from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisCatalogGroupTraits from "../../../Traits/TraitsClasses/ArcGisMapServerCatalogGroupTraits";
import ArcGisFeatureServerCatalogGroup, { FeatureServerStratum } from "./ArcGisFeatureServerCatalogGroup";
import ArcGisMapServerCatalogGroup, { MapServerStratum } from "./ArcGisMapServerCatalogGroup";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
const validServerTypes = ["MapServer", "FeatureServer"];
class ArcGisServerStratum extends LoadableStratum(ArcGisCatalogGroupTraits) {
    constructor(_catalogGroup, _arcgisServer) {
        super();
        this._catalogGroup = _catalogGroup;
        this._arcgisServer = _arcgisServer;
    }
    duplicateLoadableStratum(model) {
        return new ArcGisServerStratum(model, this._arcgisServer);
    }
    get arcgisServerData() {
        return this._arcgisServer;
    }
    static async load(catalogGroup) {
        var terria = catalogGroup.terria;
        var uri = new URI(catalogGroup.url).addQuery("f", "json");
        return loadJson(proxyCatalogItemUrl(catalogGroup, uri.toString()))
            .then((arcgisServer) => {
            // Is this really a ArcGisServer REST response?
            if (!arcgisServer ||
                (!arcgisServer.folders && !arcgisServer.services)) {
                throw networkRequestError({
                    title: i18next.t("models.arcGisService.invalidServiceTitle"),
                    message: i18next.t("models.arcGisService.invalidServiceMessage")
                });
            }
            const stratum = new ArcGisServerStratum(catalogGroup, arcgisServer);
            return stratum;
        })
            .catch(() => {
            throw networkRequestError({
                sender: catalogGroup,
                title: i18next.t("models.arcGisService.groupNotAvailableTitle"),
                message: i18next.t("models.arcGisService.groupNotAvailableMessage")
            });
        });
    }
    get members() {
        return filterOutUndefined(this.folders
            .map(folder => {
            return (this._catalogGroup.uniqueId +
                "/" +
                removePathFromName(getBasePath(this._catalogGroup), folder));
        })
            .concat(this.services
            .filter(service => {
            return validServerTypes.indexOf(service.type) !== -1;
        })
            .map(service => {
            return (this._catalogGroup.uniqueId +
                "/" +
                removePathFromName(getBasePath(this._catalogGroup), service.name) +
                "/" +
                service.type);
        })));
    }
    get folders() {
        return this._arcgisServer.folders ? this._arcgisServer.folders : [];
    }
    get services() {
        return this._arcgisServer.services ? this._arcgisServer.services : [];
    }
    createMembersFromFolders() {
        this.folders.forEach(folder => this.createMemberFromFolder(folder));
    }
    createMemberFromFolder(folder) {
        const localName = removePathFromName(getBasePath(this._catalogGroup), folder);
        const id = this._catalogGroup.uniqueId;
        const layerId = id + "/" + localName;
        const existingModel = this._catalogGroup.terria.getModelById(ArcGisCatalogGroup, layerId);
        let model;
        if (existingModel === undefined) {
            model = new ArcGisCatalogGroup(layerId, this._catalogGroup.terria);
            this._catalogGroup.terria.addModel(model);
        }
        else {
            model = existingModel;
        }
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        model.strata.delete(stratum);
        model.setTrait(stratum, "name", replaceUnderscores(folder));
        var uri = new URI(this._catalogGroup.url).segment(folder);
        model.setTrait(stratum, "url", uri.toString());
    }
    createMembersFromServices() {
        this.services.forEach(service => this.createMemberFromService(service));
    }
    createMemberFromService(service) {
        const localName = removePathFromName(getBasePath(this._catalogGroup), service.name);
        const serverTypeIndex = validServerTypes.indexOf(service.type);
        if (serverTypeIndex < 0) {
            return;
        }
        const id = this._catalogGroup.uniqueId;
        const layerId = id + "/" + localName + "/" + service.type;
        let model;
        if (serverTypeIndex === 0) {
            const existingModel = this._catalogGroup.terria.getModelById(ArcGisMapServerCatalogGroup, layerId);
            if (existingModel === undefined) {
                model = new ArcGisMapServerCatalogGroup(layerId, this._catalogGroup.terria);
                this._catalogGroup.terria.addModel(model);
            }
            else {
                model = existingModel;
            }
        }
        else {
            const existingModel = this._catalogGroup.terria.getModelById(ArcGisFeatureServerCatalogGroup, layerId);
            if (existingModel === undefined) {
                model = new ArcGisFeatureServerCatalogGroup(layerId, this._catalogGroup.terria);
                this._catalogGroup.terria.addModel(model);
            }
            else {
                model = existingModel;
            }
        }
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        model.strata.delete(stratum);
        model.setTrait(stratum, "name", replaceUnderscores(localName));
        var uri = new URI(this._catalogGroup.url)
            .segment(localName)
            .segment(service.type);
        model.setTrait(stratum, "url", uri.toString());
    }
}
ArcGisServerStratum.stratumName = "arcgisServer";
__decorate([
    computed
], ArcGisServerStratum.prototype, "members", null);
__decorate([
    computed
], ArcGisServerStratum.prototype, "folders", null);
__decorate([
    computed
], ArcGisServerStratum.prototype, "services", null);
__decorate([
    action
], ArcGisServerStratum.prototype, "createMembersFromFolders", null);
__decorate([
    action
], ArcGisServerStratum.prototype, "createMemberFromFolder", null);
__decorate([
    action
], ArcGisServerStratum.prototype, "createMembersFromServices", null);
__decorate([
    action
], ArcGisServerStratum.prototype, "createMemberFromService", null);
StratumOrder.addLoadStratum(ArcGisServerStratum.stratumName);
export default class ArcGisCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(ArcGisCatalogGroupTraits)))) {
    get type() {
        return ArcGisCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.arcGisService.name");
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    forceLoadMetadata() {
        const url = this.url || "";
        if (/\/MapServer(\/?.*)?$/i.test(url)) {
            return MapServerStratum.load(this).then(stratum => {
                runInAction(() => {
                    this.strata.set(MapServerStratum.stratumName, stratum);
                });
            });
        }
        else if (/\/FeatureServer(\/.*)?$/i.test(url)) {
            return FeatureServerStratum.load(this).then(stratum => {
                runInAction(() => {
                    this.strata.set(FeatureServerStratum.stratumName, stratum);
                });
            });
        }
        else {
            return ArcGisServerStratum.load(this).then(stratum => {
                runInAction(() => {
                    this.strata.set(ArcGisServerStratum.stratumName, stratum);
                });
            });
        }
    }
    async forceLoadMembers() {
        const arcgisServerStratum = (this.strata.get(ArcGisServerStratum.stratumName) ||
            this.strata.get(MapServerStratum.stratumName) ||
            this.strata.get(FeatureServerStratum.stratumName));
        await runLater(() => {
            if (arcgisServerStratum instanceof ArcGisServerStratum) {
                arcgisServerStratum.createMembersFromFolders();
                arcgisServerStratum.createMembersFromServices();
            }
            else if (arcgisServerStratum instanceof MapServerStratum ||
                arcgisServerStratum instanceof FeatureServerStratum) {
                arcgisServerStratum.createMembersFromLayers();
            }
        });
    }
}
ArcGisCatalogGroup.type = "esri-group";
__decorate([
    computed
], ArcGisCatalogGroup.prototype, "cacheDuration", null);
function removePathFromName(basePath, name) {
    if (!basePath && basePath.length === 0) {
        return name;
    }
    var index = name.indexOf(basePath);
    if (index === 0) {
        return name.substring(basePath.length + 1);
    }
    else {
        return name;
    }
}
function getBasePath(catalogGroup) {
    var match = /rest\/services\/(.*)/i.exec(catalogGroup.url || "");
    if (match && match.length > 1) {
        return match[1];
    }
    else {
        return "";
    }
}
//# sourceMappingURL=ArcGisCatalogGroup.js.map