var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import debounce from "lodash-es/debounce";
import { observable, action, runInAction } from "mobx";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import EllipsoidTerrainProvider from "terriajs-cesium/Source/Core/EllipsoidTerrainProvider";
import Intersections2D from "terriajs-cesium/Source/Core/Intersections2D";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import isDefined from "../Core/isDefined";
import JSEarthGravityModel1996 from "../Map/EarthGravityModel1996";
import prettifyCoordinates from "../Map/prettifyCoordinates";
import prettifyProjection from "../Map/prettifyProjection";
// TypeScript 3.6.3 can't tell JSEarthGravityModel1996 is a class and reports
//   Cannot use namespace 'JSEarthGravityModel1996' as a type.ts(2709)
// This is a dodgy workaround.
class EarthGravityModel1996 extends JSEarthGravityModel1996 {
}
const sampleTerrainMostDetailed = require("terriajs-cesium/Source/Core/sampleTerrainMostDetailed")
    .default;
export default class MouseCoords {
    constructor() {
        this.useProjection = false;
        this.geoidModel = new EarthGravityModel1996(require("file-loader!../../wwwroot/data/WW15MGH.DAC"));
        this.proj4Projection = "+proj=utm +ellps=GRS80 +units=m +no_defs";
        this.projectionUnits = "m";
        this.proj4longlat =
            "+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs";
        this.accurateSamplingDebounceTime = 250;
        this.tileRequestInFlight = undefined;
        this.debounceSampleAccurateHeight = debounce(this.sampleAccurateHeight, this.accurateSamplingDebounceTime);
    }
    toggleUseProjection() {
        this.useProjection = !this.useProjection;
    }
    updateCoordinatesFromCesium(terria, position) {
        if (!terria.cesium) {
            return;
        }
        const scene = terria.cesium.scene;
        const camera = scene.camera;
        const pickRay = camera.getPickRay(position);
        const globe = scene.globe;
        const pickedTriangle = globe.pickTriangle(pickRay, scene);
        if (isDefined(pickedTriangle)) {
            // Get a fast, accurate-ish height every time the mouse moves.
            const ellipsoid = globe.ellipsoid;
            const v0 = ellipsoid.cartesianToCartographic(pickedTriangle.v0);
            const v1 = ellipsoid.cartesianToCartographic(pickedTriangle.v1);
            const v2 = ellipsoid.cartesianToCartographic(pickedTriangle.v2);
            const intersection = ellipsoid.cartesianToCartographic(pickedTriangle.intersection);
            let errorBar;
            if (globe.terrainProvider instanceof EllipsoidTerrainProvider) {
                intersection.height = undefined;
            }
            else {
                const barycentric = Intersections2D.computeBarycentricCoordinates(intersection.longitude, intersection.latitude, v0.longitude, v0.latitude, v1.longitude, v1.latitude, v2.longitude, v2.latitude);
                if (barycentric.x >= -1e-15 &&
                    barycentric.y >= -1e-15 &&
                    barycentric.z >= -1e-15) {
                    const height = barycentric.x * v0.height +
                        barycentric.y * v1.height +
                        barycentric.z * v2.height;
                    intersection.height = height;
                }
                const geometricError = globe.terrainProvider.getLevelMaximumGeometricError(pickedTriangle.tile.level);
                const approximateHeight = intersection.height;
                const minHeight = Math.max(pickedTriangle.tile.data.tileBoundingRegion.minimumHeight, approximateHeight - geometricError);
                const maxHeight = Math.min(pickedTriangle.tile.data.tileBoundingRegion.maximumHeight, approximateHeight + geometricError);
                const minHeightGeoid = minHeight - (this.geoidModel ? this.geoidModel.minimumHeight : 0.0);
                const maxHeightGeoid = maxHeight + (this.geoidModel ? this.geoidModel.maximumHeight : 0.0);
                errorBar = Math.max(Math.abs(approximateHeight - minHeightGeoid), Math.abs(maxHeightGeoid - approximateHeight));
            }
            const terrainProvider = globe.terrainProvider;
            this.cartographicToFields(intersection, errorBar);
            if (!(terrainProvider instanceof EllipsoidTerrainProvider)) {
                this.debounceSampleAccurateHeight(terrainProvider, intersection);
            }
        }
        else {
            runInAction(() => {
                this.elevation = undefined;
                this.utmZone = undefined;
                this.latitude = undefined;
                this.longitude = undefined;
                this.north = undefined;
                this.east = undefined;
            });
        }
    }
    updateCoordinatesFromLeaflet(terria, mouseMoveEvent) {
        if (!terria.leaflet) {
            return;
        }
        const latLng = terria.leaflet.map.mouseEventToLatLng(mouseMoveEvent);
        const coordinates = Cartographic.fromDegrees(latLng.lng, latLng.lat);
        coordinates.height = undefined;
        this.cartographicToFields(coordinates);
    }
    cartographicToFields(coordinates, errorBar) {
        this.cartographic = Cartographic.clone(coordinates);
        const latitude = CesiumMath.toDegrees(coordinates.latitude);
        const longitude = CesiumMath.toDegrees(coordinates.longitude);
        if (this.useProjection) {
            const prettyProjection = prettifyProjection(longitude, latitude, this.proj4Projection, this.proj4longlat, this.projectionUnits);
            this.utmZone = prettyProjection.utmZone;
            this.north = prettyProjection.north;
            this.east = prettyProjection.east;
        }
        const prettyCoordinate = prettifyCoordinates(longitude, latitude, {
            height: coordinates.height,
            errorBar: errorBar
        });
        this.latitude = prettyCoordinate.latitude;
        this.longitude = prettyCoordinate.longitude;
        this.elevation = prettyCoordinate.elevation;
    }
    sampleAccurateHeight(terrainProvider, position) {
        if (this.tileRequestInFlight) {
            // A tile request is already in flight, so reschedule for later.
            this.debounceSampleAccurateHeight.cancel();
            this.debounceSampleAccurateHeight(terrainProvider, position);
            return;
        }
        const positionWithHeight = Cartographic.clone(position);
        const geoidHeightPromise = this.geoidModel
            ? this.geoidModel.getHeight(position.longitude, position.latitude)
            : undefined;
        const terrainPromise = sampleTerrainMostDetailed(terrainProvider, [
            positionWithHeight
        ]);
        this.tileRequestInFlight = Promise.all([geoidHeightPromise, terrainPromise])
            .then(result => {
            const geoidHeight = result[0] || 0.0;
            this.tileRequestInFlight = undefined;
            if (Cartographic.equals(position, this.cartographic)) {
                position.height = positionWithHeight.height - geoidHeight;
                this.cartographicToFields(position);
            }
            else {
                // Mouse moved since we started this request, so the result isn't useful.  Try again next time.
            }
        })
            .catch(() => {
            this.tileRequestInFlight = undefined;
        });
    }
}
__decorate([
    observable
], MouseCoords.prototype, "elevation", void 0);
__decorate([
    observable
], MouseCoords.prototype, "utmZone", void 0);
__decorate([
    observable
], MouseCoords.prototype, "latitude", void 0);
__decorate([
    observable
], MouseCoords.prototype, "longitude", void 0);
__decorate([
    observable
], MouseCoords.prototype, "north", void 0);
__decorate([
    observable
], MouseCoords.prototype, "east", void 0);
__decorate([
    observable
], MouseCoords.prototype, "cartographic", void 0);
__decorate([
    observable
], MouseCoords.prototype, "useProjection", void 0);
__decorate([
    action
], MouseCoords.prototype, "toggleUseProjection", null);
__decorate([
    action
], MouseCoords.prototype, "cartographicToFields", null);
//# sourceMappingURL=MouseCoords.js.map