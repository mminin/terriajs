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
import ArcGisMapServerCatalogGroupTraits from "../../../Traits/TraitsClasses/ArcGisMapServerCatalogGroupTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import ArcGisMapServerCatalogItem from "./ArcGisMapServerCatalogItem";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
export class MapServerStratum extends LoadableStratum(ArcGisMapServerCatalogGroupTraits) {
    constructor(_catalogGroup, _mapServer) {
        super();
        this._catalogGroup = _catalogGroup;
        this._mapServer = _mapServer;
    }
    duplicateLoadableStratum(model) {
        return new MapServerStratum(model, this._mapServer);
    }
    get mapServerData() {
        return this._mapServer;
    }
    get name() {
        if (this._mapServer.documentInfo &&
            this._mapServer.documentInfo.Title &&
            this._mapServer.documentInfo.Title.length > 0) {
            return replaceUnderscores(this._mapServer.documentInfo.Title);
        }
    }
    get info() {
        return [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogGroup.serviceDescription"),
                content: this._mapServer.serviceDescription
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogGroup.dataDescription"),
                content: this._mapServer.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogGroup.copyrightText"),
                content: this._mapServer.copyrightText
            })
        ];
    }
    get dataCustodian() {
        if (this._mapServer.documentInfo &&
            this._mapServer.documentInfo.Author &&
            this._mapServer.documentInfo.Author.length > 0) {
            return this._mapServer.documentInfo.Author;
        }
    }
    static async load(catalogGroup) {
        var terria = catalogGroup.terria;
        var uri = new URI(catalogGroup.url).addQuery("f", "json");
        return loadJson(proxyCatalogItemUrl(catalogGroup, uri.toString()))
            .then((mapServer) => {
            // Is this really a MapServer REST response?
            if (!mapServer || (!mapServer.layers && !mapServer.subLayers)) {
                throw networkRequestError({
                    title: i18next.t("models.arcGisMapServerCatalogGroup.invalidServiceTitle"),
                    message: i18next.t("models.arcGisMapServerCatalogGroup.invalidServiceMessage")
                });
            }
            const stratum = new MapServerStratum(catalogGroup, mapServer);
            return stratum;
        })
            .catch(() => {
            throw networkRequestError({
                sender: catalogGroup,
                title: i18next.t("models.arcGisMapServerCatalogGroup.groupNotAvailableTitle"),
                message: i18next.t("models.arcGisMapServerCatalogGroup.groupNotAvailableMessage")
            });
        });
    }
    get members() {
        return filterOutUndefined(this.layers
            .map((layer) => {
            if (!isDefined(layer.id) || layer.parentLayerId !== -1) {
                return undefined;
            }
            return this._catalogGroup.uniqueId + "/" + layer.id;
        })
            .concat(this.subLayers.map((subLayer) => {
            if (!isDefined(subLayer.id)) {
                return undefined;
            }
            return this._catalogGroup.uniqueId + "/" + subLayer.id;
        })));
    }
    get layers() {
        return this._mapServer.layers || [];
    }
    get subLayers() {
        return this._mapServer.subLayers || [];
    }
    createMembersFromLayers() {
        this.layers.forEach((layer) => this.createMemberFromLayer(layer));
    }
    createMemberFromLayer(layer) {
        if (!isDefined(layer.id)) {
            return;
        }
        const id = this._catalogGroup.uniqueId;
        //if parent layer is not -1 then this is sublayer so we define its ID like that
        const layerId = id +
            "/" +
            (layer.parentLayerId !== -1 ? layer.parentLayerId + "/" : "") +
            layer.id;
        let model;
        // Treat layer as a group if it has type "Group Layer" - or has subLayers
        if (layer.type === "Group Layer" ||
            (Array.isArray(layer.subLayerIds) && layer.subLayerIds.length > 0)) {
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
            const existingModel = this._catalogGroup.terria.getModelById(ArcGisMapServerCatalogItem, layerId);
            if (existingModel === undefined) {
                model = new ArcGisMapServerCatalogItem(layerId, this._catalogGroup.terria);
                this._catalogGroup.terria.addModel(model);
            }
            else {
                model = existingModel;
            }
        }
        // Replace the stratum inherited from the parent group.
        model.strata.delete(CommonStrata.definition);
        model.setTrait(CommonStrata.definition, "name", replaceUnderscores(layer.name));
        var uri = new URI(this._catalogGroup.url).segment(layer.id + ""); // Convert layer id to string as segment(0) means sthg different.
        model.setTrait(CommonStrata.definition, "url", uri.toString());
    }
}
MapServerStratum.stratumName = "mapServer";
__decorate([
    computed
], MapServerStratum.prototype, "name", null);
__decorate([
    computed
], MapServerStratum.prototype, "info", null);
__decorate([
    computed
], MapServerStratum.prototype, "dataCustodian", null);
__decorate([
    computed
], MapServerStratum.prototype, "members", null);
__decorate([
    computed
], MapServerStratum.prototype, "layers", null);
__decorate([
    computed
], MapServerStratum.prototype, "subLayers", null);
__decorate([
    action
], MapServerStratum.prototype, "createMembersFromLayers", null);
__decorate([
    action
], MapServerStratum.prototype, "createMemberFromLayer", null);
StratumOrder.addLoadStratum(MapServerStratum.stratumName);
export default class ArcGisMapServerCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(ArcGisMapServerCatalogGroupTraits)))) {
    get type() {
        return ArcGisMapServerCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.arcGisMapServerCatalogGroup.name");
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    forceLoadMetadata() {
        return MapServerStratum.load(this).then((stratum) => {
            runInAction(() => {
                this.strata.set(MapServerStratum.stratumName, stratum);
            });
        });
    }
    async forceLoadMembers() {
        const mapServerStratum = (this.strata.get(MapServerStratum.stratumName));
        if (mapServerStratum) {
            await runLater(() => mapServerStratum.createMembersFromLayers());
        }
    }
}
ArcGisMapServerCatalogGroup.type = "esri-mapServer-group";
__decorate([
    computed
], ArcGisMapServerCatalogGroup.prototype, "cacheDuration", null);
//# sourceMappingURL=ArcGisMapServerCatalogGroup.js.map