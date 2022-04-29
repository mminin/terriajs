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
import ArcGisFeatureServerCatalogGroupTraits from "../../../Traits/TraitsClasses/ArcGisFeatureServerCatalogGroupTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import ArcGisFeatureServerCatalogItem from "./ArcGisFeatureServerCatalogItem";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
export class FeatureServerStratum extends LoadableStratum(ArcGisFeatureServerCatalogGroupTraits) {
    constructor(_catalogGroup, _featureServer) {
        super();
        this._catalogGroup = _catalogGroup;
        this._featureServer = _featureServer;
    }
    duplicateLoadableStratum(model) {
        return new FeatureServerStratum(model, this._featureServer);
    }
    get featureServerData() {
        return this._featureServer;
    }
    get name() {
        if (this._featureServer.documentInfo &&
            this._featureServer.documentInfo.Title &&
            this._featureServer.documentInfo.Title.length > 0) {
            return replaceUnderscores(this._featureServer.documentInfo.Title);
        }
    }
    get info() {
        return [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisFeatureServerCatalogGroup.serviceDescription"),
                content: this._featureServer.serviceDescription
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisFeatureServerCatalogGroup.dataDescription"),
                content: this._featureServer.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisFeatureServerCatalogGroup.copyrightText"),
                content: this._featureServer.copyrightText
            })
        ];
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get dataCustodian() {
        if (this._featureServer.documentInfo &&
            this._featureServer.documentInfo.Author &&
            this._featureServer.documentInfo.Author.length > 0) {
            return this._featureServer.documentInfo.Author;
        }
    }
    static async load(catalogGroup) {
        var terria = catalogGroup.terria;
        var uri = new URI(catalogGroup.url).addQuery("f", "json");
        return loadJson(proxyCatalogItemUrl(catalogGroup, uri.toString()))
            .then((featureServer) => {
            // Is this really a FeatureServer REST response?
            if (!featureServer || !featureServer.layers) {
                throw networkRequestError({
                    title: i18next.t("models.arcGisFeatureServerCatalogGroup.invalidServiceTitle"),
                    message: i18next.t("models.arcGisFeatureServerCatalogGroup.invalidServiceMessage")
                });
            }
            const stratum = new FeatureServerStratum(catalogGroup, featureServer);
            return stratum;
        })
            .catch(() => {
            throw networkRequestError({
                sender: catalogGroup,
                title: i18next.t("models.arcGisFeatureServerCatalogGroup.groupNotAvailableTitle"),
                message: i18next.t("models.arcGisFeatureServerCatalogGroup.groupNotAvailableMessage")
            });
        });
    }
    get members() {
        return filterOutUndefined(this.layers.map(layer => {
            if (!isDefined(layer.id)) {
                return undefined;
            }
            return this._catalogGroup.uniqueId + "/" + layer.id;
        }));
    }
    get layers() {
        return this._featureServer.layers;
    }
    createMembersFromLayers() {
        this.layers.forEach(layer => this.createMemberFromLayer(layer));
    }
    createMemberFromLayer(layer) {
        if (!isDefined(layer.id)) {
            return;
        }
        const id = this._catalogGroup.uniqueId;
        const layerId = id + "/" + layer.id;
        const existingModel = this._catalogGroup.terria.getModelById(ArcGisFeatureServerCatalogItem, layerId);
        let model;
        if (existingModel === undefined) {
            model = new ArcGisFeatureServerCatalogItem(layerId, this._catalogGroup.terria);
            this._catalogGroup.terria.addModel(model);
        }
        else {
            model = existingModel;
        }
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        model.strata.delete(stratum);
        model.setTrait(stratum, "name", replaceUnderscores(layer.name));
        var uri = new URI(this._catalogGroup.url).segment(layer.id + ""); // Convert layer id to string as segment(0) means sthg different.
        model.setTrait(stratum, "url", uri.toString());
    }
}
FeatureServerStratum.stratumName = "featureServer";
__decorate([
    computed
], FeatureServerStratum.prototype, "name", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "info", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "cacheDuration", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "dataCustodian", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "members", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "layers", null);
__decorate([
    action
], FeatureServerStratum.prototype, "createMembersFromLayers", null);
__decorate([
    action
], FeatureServerStratum.prototype, "createMemberFromLayer", null);
StratumOrder.addLoadStratum(FeatureServerStratum.stratumName);
export default class ArcGisFeatureServerCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(ArcGisFeatureServerCatalogGroupTraits)))) {
    get type() {
        return ArcGisFeatureServerCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.arcGisFeatureServerCatalogGroup.name");
    }
    forceLoadMetadata() {
        return FeatureServerStratum.load(this).then(stratum => {
            runInAction(() => {
                this.strata.set(FeatureServerStratum.stratumName, stratum);
            });
        });
    }
    async forceLoadMembers() {
        const featureServerStratum = (this.strata.get(FeatureServerStratum.stratumName));
        if (featureServerStratum) {
            await runLater(() => featureServerStratum.createMembersFromLayers());
        }
    }
}
ArcGisFeatureServerCatalogGroup.type = "esri-featureServer-group";
//# sourceMappingURL=ArcGisFeatureServerCatalogGroup.js.map