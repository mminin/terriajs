var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, observable, toJS } from "mobx";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import CzmlDataSource from "terriajs-cesium/Source/DataSources/CzmlDataSource";
import isDefined from "../../../Core/isDefined";
import makeRealPromise from "../../../Core/makeRealPromise";
import readJson from "../../../Core/readJson";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import AutoRefreshingMixin from "../../../ModelMixins/AutoRefreshingMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import CzmlCatalogItemTraits from "../../../Traits/TraitsClasses/CzmlCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
/**
 * A loadable stratum for CzmlCatalogItemTraits that derives TimeVaryingTraits
 * from the CzmlDataSource
 */
class CzmlTimeVaryingStratum extends LoadableStratum(CzmlCatalogItemTraits) {
    constructor(catalogItem) {
        super();
        this.catalogItem = catalogItem;
    }
    duplicateLoadableStratum(model) {
        return new CzmlTimeVaryingStratum(model);
    }
    get clock() {
        var _a;
        return (_a = this.catalogItem._dataSource) === null || _a === void 0 ? void 0 : _a.clock;
    }
    get currentTime() {
        var _a;
        const currentTime = (_a = this.clock) === null || _a === void 0 ? void 0 : _a.currentTime;
        return currentTime ? JulianDate.toIso8601(currentTime) : undefined;
    }
    get startTime() {
        var _a;
        const startTime = (_a = this.clock) === null || _a === void 0 ? void 0 : _a.startTime;
        return startTime ? JulianDate.toIso8601(startTime) : undefined;
    }
    get stopTime() {
        var _a;
        const stopTime = (_a = this.clock) === null || _a === void 0 ? void 0 : _a.stopTime;
        return stopTime ? JulianDate.toIso8601(stopTime) : undefined;
    }
    get multiplier() {
        var _a;
        return (_a = this.clock) === null || _a === void 0 ? void 0 : _a.multiplier;
    }
}
CzmlTimeVaryingStratum.stratumName = "czmlLoadableStratum";
__decorate([
    computed
], CzmlTimeVaryingStratum.prototype, "clock", null);
__decorate([
    computed
], CzmlTimeVaryingStratum.prototype, "currentTime", null);
__decorate([
    computed
], CzmlTimeVaryingStratum.prototype, "startTime", null);
__decorate([
    computed
], CzmlTimeVaryingStratum.prototype, "stopTime", null);
__decorate([
    computed
], CzmlTimeVaryingStratum.prototype, "multiplier", null);
StratumOrder.addLoadStratum(CzmlTimeVaryingStratum.stratumName);
export default class CzmlCatalogItem extends AutoRefreshingMixin(MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(CzmlCatalogItemTraits))))) {
    get type() {
        return CzmlCatalogItem.type;
    }
    setFileInput(file) {
        this._czmlFile = file;
    }
    get hasLocalData() {
        return isDefined(this._czmlFile);
    }
    forceLoadMapItems() {
        const attribution = this.attribution;
        let loadableData = undefined;
        if (isDefined(this.czmlData)) {
            loadableData = toJS(this.czmlData);
        }
        else if (isDefined(this.czmlString)) {
            loadableData = JSON.parse(this.czmlString);
        }
        else if (isDefined(this._czmlFile)) {
            loadableData = readJson(this._czmlFile);
        }
        else if (isDefined(this.url)) {
            loadableData = proxyCatalogItemUrl(this, this.url, this.cacheDuration);
        }
        if (loadableData === undefined) {
            throw new TerriaError({
                sender: this,
                title: i18next.t("models.czml.unableToLoadItemTitle"),
                message: i18next.t("models.czml.unableToLoadItemMessage")
            });
        }
        return makeRealPromise(CzmlDataSource.load(loadableData, {
            credit: attribution
        }))
            .then(action(czmlDataSource => {
            this._dataSource = czmlDataSource;
            this.strata.set(CzmlTimeVaryingStratum.stratumName, new CzmlTimeVaryingStratum(this));
        }))
            .catch(e => {
            if (e instanceof TerriaError) {
                throw e;
            }
            else {
                throw networkRequestError({
                    sender: this,
                    title: i18next.t("models.czml.errorLoadingTitle"),
                    message: i18next.t("models.czml.errorLoadingMessage")
                });
            }
        });
    }
    forceLoadMetadata() {
        return Promise.resolve();
    }
    get mapItems() {
        if (this.isLoadingMapItems || this._dataSource === undefined) {
            return [];
        }
        this._dataSource.show = this.show;
        return [this._dataSource];
    }
    get currentTimeAsJulianDate() {
        return toJulianDate(this.currentTime);
    }
    get startTimeAsJulianDate() {
        return toJulianDate(this.startTime);
    }
    get stopTimeAsJulianDate() {
        return toJulianDate(this.stopTime);
    }
    /**
     * Reloads CzmlDataSource if the source is a URL
     * Required for AutoRefreshingMixin
     */
    refreshData() {
        var _a;
        if (this.url === undefined)
            return;
        const url = proxyCatalogItemUrl(this, this.url, this.cacheDuration);
        (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.process(url);
    }
}
CzmlCatalogItem.type = "czml";
__decorate([
    observable
], CzmlCatalogItem.prototype, "_dataSource", void 0);
__decorate([
    computed
], CzmlCatalogItem.prototype, "hasLocalData", null);
__decorate([
    computed
], CzmlCatalogItem.prototype, "mapItems", null);
__decorate([
    computed({ equals: JulianDate.equals })
], CzmlCatalogItem.prototype, "currentTimeAsJulianDate", null);
__decorate([
    computed({ equals: JulianDate.equals })
], CzmlCatalogItem.prototype, "startTimeAsJulianDate", null);
__decorate([
    computed({ equals: JulianDate.equals })
], CzmlCatalogItem.prototype, "stopTimeAsJulianDate", null);
function toJulianDate(time) {
    return time === undefined || time === null
        ? undefined
        : JulianDate.fromIso8601(time);
}
//# sourceMappingURL=CzmlCatalogItem.js.map