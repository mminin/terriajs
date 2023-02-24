var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import PolygonHierarchy from "terriajs-cesium/Source/Core/PolygonHierarchy";
import sampleTerrain from "terriajs-cesium/Source/Core/sampleTerrain";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import KmlDataSource from "terriajs-cesium/Source/DataSources/KmlDataSource";
import isDefined from "../../../Core/isDefined";
import readXml from "../../../Core/readXml";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import KmlCatalogItemTraits from "../../../Traits/TraitsClasses/KmlCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
const kmzRegex = /\.kmz$/i;
class KmlCatalogItem extends MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(KmlCatalogItemTraits)))) {
    get type() {
        return KmlCatalogItem.type;
    }
    setFileInput(file) {
        this._kmlFile = file;
    }
    get hasLocalData() {
        return isDefined(this._kmlFile);
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    forceLoadMapItems() {
        return new Promise((resolve) => {
            if (isDefined(this.kmlString)) {
                const parser = new DOMParser();
                resolve(parser.parseFromString(this.kmlString, "text/xml"));
            }
            else if (isDefined(this._kmlFile)) {
                if (this._kmlFile.name && this._kmlFile.name.match(kmzRegex)) {
                    resolve(this._kmlFile);
                }
                else {
                    resolve(readXml(this._kmlFile));
                }
            }
            else if (isDefined(this.url)) {
                resolve(proxyCatalogItemUrl(this, this.url));
            }
            else {
                throw networkRequestError({
                    sender: this,
                    title: i18next.t("models.kml.unableToLoadItemTitle"),
                    message: i18next.t("models.kml.unableToLoadItemMessage")
                });
            }
        })
            .then((kmlLoadInput) => {
            return KmlDataSource.load(kmlLoadInput);
        })
            .then((dataSource) => {
            this._dataSource = dataSource;
            this.doneLoading(dataSource); // Unsure if this is necessary
        })
            .catch((e) => {
            throw networkRequestError(TerriaError.from(e, {
                sender: this,
                title: i18next.t("models.kml.errorLoadingTitle"),
                message: i18next.t("models.kml.errorLoadingMessage", {
                    appName: this.terria.appName
                })
            }));
        });
    }
    get mapItems() {
        if (this.isLoadingMapItems || this._dataSource === undefined) {
            return [];
        }
        this._dataSource.show = this.show;
        return [this._dataSource];
    }
    forceLoadMetadata() {
        return Promise.resolve();
    }
    doneLoading(kmlDataSource) {
        // Clamp features to terrain.
        if (isDefined(this.terria.cesium)) {
            const positionsToSample = [];
            const correspondingCartesians = [];
            const entities = kmlDataSource.entities.values;
            for (let i = 0; i < entities.length; ++i) {
                const entity = entities[i];
                const polygon = entity.polygon;
                if (isDefined(polygon)) {
                    polygon.perPositionHeight = true;
                    const polygonHierarchy = getPropertyValue(polygon.hierarchy);
                    if (polygonHierarchy) {
                        samplePolygonHierarchyPositions(polygonHierarchy, positionsToSample, correspondingCartesians);
                    }
                }
            }
            const terrainProvider = this.terria.cesium.scene.globe.terrainProvider;
            sampleTerrain(terrainProvider, 11, positionsToSample).then(function () {
                for (let i = 0; i < positionsToSample.length; ++i) {
                    const position = positionsToSample[i];
                    if (!isDefined(position.height)) {
                        continue;
                    }
                    Ellipsoid.WGS84.cartographicToCartesian(position, correspondingCartesians[i]);
                }
                // Force the polygons to be rebuilt.
                for (let i = 0; i < entities.length; ++i) {
                    const polygon = entities[i].polygon;
                    if (!isDefined(polygon)) {
                        continue;
                    }
                    const existingHierarchy = getPropertyValue(polygon.hierarchy);
                    if (existingHierarchy) {
                        polygon.hierarchy = new ConstantProperty(new PolygonHierarchy(existingHierarchy.positions, existingHierarchy.holes));
                    }
                }
            });
        }
    }
}
KmlCatalogItem.type = "kml";
__decorate([
    computed
], KmlCatalogItem.prototype, "hasLocalData", null);
__decorate([
    computed
], KmlCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], KmlCatalogItem.prototype, "mapItems", null);
export default KmlCatalogItem;
function getPropertyValue(property) {
    if (property === undefined) {
        return undefined;
    }
    return property.getValue(JulianDate.now());
}
function samplePolygonHierarchyPositions(polygonHierarchy, positionsToSample, correspondingCartesians) {
    const positions = polygonHierarchy.positions;
    for (let i = 0; i < positions.length; ++i) {
        const position = positions[i];
        correspondingCartesians.push(position);
        positionsToSample.push(Ellipsoid.WGS84.cartesianToCartographic(position));
    }
    const holes = polygonHierarchy.holes;
    for (let i = 0; i < holes.length; ++i) {
        samplePolygonHierarchyPositions(holes[i], positionsToSample, correspondingCartesians);
    }
}
//# sourceMappingURL=KmlCatalogItem.js.map