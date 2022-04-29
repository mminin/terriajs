var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, observable, runInAction } from "mobx";
import { createTransformer } from "mobx-utils";
import Pbf from "pbf";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Color from "terriajs-cesium/Source/Core/Color";
import HeadingPitchRoll from "terriajs-cesium/Source/Core/HeadingPitchRoll";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import NearFarScalar from "terriajs-cesium/Source/Core/NearFarScalar";
import Transforms from "terriajs-cesium/Source/Core/Transforms";
import BillboardGraphics from "terriajs-cesium/Source/DataSources/BillboardGraphics";
import ConstantPositionProperty from "terriajs-cesium/Source/DataSources/ConstantPositionProperty";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import DataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import ModelGraphics from "terriajs-cesium/Source/DataSources/ModelGraphics";
import PointGraphics from "terriajs-cesium/Source/DataSources/PointGraphics";
import PropertyBag from "terriajs-cesium/Source/DataSources/PropertyBag";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import URI from "urijs";
import loadArrayBuffer from "../../../Core/loadArrayBuffer";
import TerriaError from "../../../Core/TerriaError";
import AutoRefreshingMixin from "../../../ModelMixins/AutoRefreshingMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import GtfsCatalogItemTraits from "../../../Traits/TraitsClasses/GtfsCatalogItemTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import { FeedMessageReader } from "./GtfsRealtimeProtoBufReaders";
import prettyPrintGtfsEntityField from "./prettyPrintGtfsEntityField";
// We want TS to look at the type declared in lib/ThirdParty/terriajs-cesium-extra/index.d.ts
// and import doesn't allows us to do that, so instead we use require + type casting to ensure
// we still maintain the type checking, without TS screaming with errors
const Axis = require("terriajs-cesium/Source/Scene/Axis").default;
class GtfsStratum extends LoadableStratum(GtfsCatalogItemTraits) {
    constructor(_item) {
        super();
        this._item = _item;
    }
    duplicateLoadableStratum(newModel) {
        return new GtfsStratum(newModel);
    }
    static async load(item) {
        return new GtfsStratum(item);
    }
    get rectangle() {
        return createStratumInstance(RectangleTraits, this._item._bbox);
    }
}
GtfsStratum.stratumName = "gtfs";
__decorate([
    computed
], GtfsStratum.prototype, "rectangle", null);
StratumOrder.addLoadStratum(GtfsStratum.stratumName);
/**
 * For displaying realtime transport data. See [here](https://developers.google.com/transit/gtfs-realtime/reference/)
 * for the spec.
 */
export default class GtfsCatalogItem extends MappableMixin(UrlMixin(AutoRefreshingMixin(CatalogMemberMixin(CreateModel(GtfsCatalogItemTraits))))) {
    constructor(id, terria, sourceReference) {
        super(id, terria, sourceReference);
        this._bbox = {
            west: Infinity,
            south: Infinity,
            east: -Infinity,
            north: -Infinity
        };
        /**
         * Always use the getter to read this. This is a cache for a computed property.
         *
         * We cache it because recreating it reactively is computationally expensive, so we modify it reactively instead.
         */
        this._dataSource = new DataSource("billboard");
        this.gtfsFeedEntities = [];
        this.convertManyFeedEntitiesToBillboardData = createTransformer((feedEntities) => {
            // Sometimes the feed can contain many records for the same vehicle
            // so we'll only display the newest record.
            // Although technically the timestamp property is optional, if none is
            // present we'll show the record.
            const vehicleMap = new Map();
            for (var i = 0; i < feedEntities.length; ++i) {
                const entity = feedEntities[i];
                const item = this.convertFeedEntityToBillboardData(entity);
                if (item && item.position && item.featureInfo) {
                    const vehicleInfo = item.featureInfo.get("entity").vehicle.vehicle;
                    if (vehicleMap.has(vehicleInfo.id) && vehicleInfo.timestamp) {
                        let existingRecord = vehicleMap.get(vehicleInfo.id);
                        if (existingRecord.timestamp < vehicleInfo.timestamp) {
                            vehicleMap.set(vehicleInfo.id, item);
                        }
                    }
                    else {
                        vehicleMap.set(vehicleInfo.id, item);
                    }
                }
            }
            return [...vehicleMap.values()];
        });
    }
    static get type() {
        return "gtfs";
    }
    get type() {
        return GtfsCatalogItem.type;
    }
    get dataSource() {
        this._dataSource.entities.suspendEvents();
        // Convert the GTFS protobuf into a more useful shape
        const vehicleData = this.convertManyFeedEntitiesToBillboardData(this.gtfsFeedEntities);
        for (let data of vehicleData) {
            if (data.sourceId === undefined) {
                continue;
            }
            const entity = this._dataSource.entities.getOrCreateEntity(data.sourceId);
            if (!entity.model && this._model) {
                entity.model = this._model;
            }
            if (this.model !== undefined &&
                this.model !== null &&
                data.orientation !== undefined &&
                data.orientation !== null) {
                entity.orientation = new ConstantProperty(data.orientation);
            }
            if (data.position !== undefined &&
                (!entity.position ||
                    entity.position.getValue(new JulianDate()) !== data.position)) {
                entity.position = new ConstantPositionProperty(data.position);
            }
            // If we're using a billboard
            if (data.billboard !== null && data.billboard !== undefined) {
                if (entity.billboard === null || entity.billboard === undefined) {
                    entity.billboard = data.billboard;
                }
                if (data.billboard.color) {
                    data.billboard.color.getValue(new JulianDate()).alpha = this.opacity;
                }
                if (!entity.billboard.color ||
                    !entity.billboard.color.equals(data.billboard.color)) {
                    entity.billboard.color = data.billboard.color;
                }
            }
            // If we're using a point
            if (data.point !== null && data.point !== undefined) {
                if (entity.point === null || entity.point === undefined) {
                    entity.point = data.point;
                }
                if (data.point.color) {
                    data.point.color.getValue(new JulianDate()).alpha = this.opacity;
                }
                if (!entity.point.color ||
                    !entity.point.color.equals(data.point.color)) {
                    entity.point.color = data.point.color;
                }
            }
            if (data.featureInfo !== undefined && data.featureInfo !== null) {
                entity.properties = new PropertyBag();
                for (let key of data.featureInfo.keys()) {
                    entity.properties.addProperty(key, data.featureInfo.get(key));
                }
            }
        }
        // remove entities that no longer exist
        if (this._dataSource.entities.values.length > vehicleData.length) {
            const idSet = new Set(vehicleData.map(val => val.sourceId));
            this._dataSource.entities.values
                .filter(entity => !idSet.has(entity.id))
                .forEach(entity => this._dataSource.entities.remove(entity));
        }
        this._dataSource.entities.resumeEvents();
        return this._dataSource;
    }
    refreshData() {
        this.forceLoadMapItems();
    }
    get mapItems() {
        this._dataSource.show = this.show;
        return [this.dataSource];
    }
    get _cesiumUpAxis() {
        if (this.model.upAxis === undefined) {
            return Axis.Y;
        }
        return Axis.fromName(this.model.upAxis);
    }
    get _cesiumForwardAxis() {
        if (this.model.forwardAxis === undefined) {
            return Axis.Z;
        }
        return Axis.fromName(this.model.forwardAxis);
    }
    get _model() {
        if (this.model.url === undefined) {
            return undefined;
        }
        const options = {
            uri: new ConstantProperty(this.model.url),
            upAxis: new ConstantProperty(this._cesiumUpAxis),
            forwardAxis: new ConstantProperty(this._cesiumForwardAxis),
            scale: new ConstantProperty(this.model.scale !== undefined ? this.model.scale : 1),
            heightReference: new ConstantProperty(HeightReference.RELATIVE_TO_GROUND),
            distanceDisplayCondition: new ConstantProperty({
                near: 0.0,
                far: this.model.maximumDistance
            })
        };
        return new ModelGraphics(options);
    }
    forceLoadMetadata() {
        return Promise.resolve();
    }
    forceLoadMapItems() {
        if (this.strata.get(GtfsStratum.stratumName) === undefined) {
            GtfsStratum.load(this).then(stratum => {
                runInAction(() => {
                    this.strata.set(GtfsStratum.stratumName, stratum);
                });
            });
        }
        const promise = this.retrieveData()
            .then((data) => {
            runInAction(() => {
                if (data.entity !== undefined && data.entity !== null) {
                    this.gtfsFeedEntities = data.entity;
                    this.terria.currentViewer.notifyRepaintRequired();
                }
            });
        })
            .catch((e) => {
            throw new TerriaError({
                title: `Could not load ${this.nameInCatalog}.`,
                sender: this,
                message: `There was an error loading the data for ${this.nameInCatalog}.`
            });
        });
        return promise;
    }
    retrieveData() {
        // These headers work for the Transport for NSW APIs. Presumably, other services will require different headers.
        const headers = {
            "Content-Type": "application/x-google-protobuf;charset=UTF-8",
            "Cache-Control": "no-cache"
        };
        if (this.apiKey !== undefined) {
            headers.Authorization = `apikey ${this.apiKey}`;
        }
        if (this.url !== null && this.url !== undefined) {
            return loadArrayBuffer(proxyCatalogItemUrl(this, this.url), headers).then((arr) => {
                const pbfBuffer = new Pbf(new Uint8Array(arr));
                return new FeedMessageReader().read(pbfBuffer);
            });
        }
        else {
            return Promise.reject();
        }
    }
    convertFeedEntityToBillboardData(entity) {
        if (entity.id == undefined) {
            return {};
        }
        let position = undefined;
        let orientation = undefined;
        let featureInfo = new Map();
        if (entity.vehicle !== null &&
            entity.vehicle !== undefined &&
            entity.vehicle.position !== null &&
            entity.vehicle.position !== undefined &&
            entity.vehicle.position.latitude !== null &&
            entity.vehicle.position.latitude !== undefined &&
            entity.vehicle.position.longitude !== null &&
            entity.vehicle.position.longitude !== undefined &&
            entity.vehicle.position.bearing !== null &&
            entity.vehicle.position.bearing !== undefined) {
            updateBbox(entity.vehicle.position.latitude, entity.vehicle.position.longitude, this._bbox);
            position = Cartesian3.fromDegrees(entity.vehicle.position.longitude, entity.vehicle.position.latitude);
            orientation = Transforms.headingPitchRollQuaternion(position, HeadingPitchRoll.fromDegrees(entity.vehicle.position.bearing - 90.0, 0.0, 0.0));
        }
        // Add the values that the feature info template gets populated with
        for (let field of GtfsCatalogItem.FEATURE_INFO_TEMPLATE_FIELDS) {
            featureInfo.set(field, prettyPrintGtfsEntityField(field, entity));
        }
        featureInfo.set("entity", entity);
        let billboard;
        let point;
        if (this.image !== undefined && this.image !== null) {
            billboard = new BillboardGraphics({
                image: new ConstantProperty(new URI(this.image).absoluteTo(this.terria.baseUrl).toString()),
                heightReference: new ConstantProperty(HeightReference.RELATIVE_TO_GROUND),
                scaleByDistance: this.scaleImageByDistance.nearValue ===
                    this.scaleImageByDistance.farValue
                    ? undefined
                    : new ConstantProperty(new NearFarScalar(this.scaleImageByDistance.near, this.scaleImageByDistance.nearValue, this.scaleImageByDistance.far, this.scaleImageByDistance.farValue)),
                scale: this.scaleImageByDistance.nearValue ===
                    this.scaleImageByDistance.farValue &&
                    this.scaleImageByDistance.nearValue !== 1.0
                    ? new ConstantProperty(this.scaleImageByDistance.nearValue)
                    : undefined,
                color: new ConstantProperty(new Color(1.0, 1.0, 1.0, this.opacity))
            });
        }
        else {
            point = new PointGraphics({
                color: new ConstantProperty(Color.CYAN),
                outlineWidth: new ConstantProperty(1),
                outlineColor: new ConstantProperty(Color.WHITE),
                scaleByDistance: this.scaleImageByDistance.nearValue ===
                    this.scaleImageByDistance.farValue
                    ? undefined
                    : new ConstantProperty(new NearFarScalar(this.scaleImageByDistance.near, this.scaleImageByDistance.nearValue, this.scaleImageByDistance.far, this.scaleImageByDistance.farValue)),
                pixelSize: this.scaleImageByDistance.nearValue ===
                    this.scaleImageByDistance.farValue &&
                    this.scaleImageByDistance.nearValue !== 1.0
                    ? new ConstantProperty(32 * this.scaleImageByDistance.nearValue)
                    : new ConstantProperty(32),
                heightReference: new ConstantProperty(HeightReference.RELATIVE_TO_GROUND)
            });
        }
        return {
            sourceId: entity.id,
            position: position,
            orientation: orientation,
            featureInfo: featureInfo,
            billboard: billboard,
            point: point
        };
    }
}
GtfsCatalogItem.FEATURE_INFO_TEMPLATE_FIELDS = [
    "route_short_name",
    "occupancy_status#str",
    "speed#km",
    "speed",
    "bearing"
];
__decorate([
    observable
], GtfsCatalogItem.prototype, "gtfsFeedEntities", void 0);
__decorate([
    computed
], GtfsCatalogItem.prototype, "dataSource", null);
__decorate([
    computed
], GtfsCatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], GtfsCatalogItem.prototype, "_cesiumUpAxis", null);
__decorate([
    computed
], GtfsCatalogItem.prototype, "_cesiumForwardAxis", null);
__decorate([
    computed
], GtfsCatalogItem.prototype, "_model", null);
function updateBbox(lat, lon, rectangle) {
    if (lon < rectangle.west)
        rectangle.west = lon;
    if (lat < rectangle.south)
        rectangle.south = lat;
    if (lon > rectangle.east)
        rectangle.east = lon;
    if (lat > rectangle.north)
        rectangle.north = lat;
}
//# sourceMappingURL=GtfsCatalogItem.js.map