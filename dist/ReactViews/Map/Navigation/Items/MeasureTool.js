"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, observable } from "mobx";
import React from "react";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import EllipsoidGeodesic from "terriajs-cesium/Source/Core/EllipsoidGeodesic";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import PolygonHierarchy from "terriajs-cesium/Source/Core/PolygonHierarchy";
import VertexFormat from "terriajs-cesium/Source/Core/VertexFormat";
import UserDrawing from "../../../../Models/UserDrawing";
import { GLYPHS } from "../../../../Styled/Icon";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";
const EllipsoidTangentPlane = require("terriajs-cesium/Source/Core/EllipsoidTangentPlane");
const PolygonGeometryLibrary = require("terriajs-cesium/Source/Core/PolygonGeometryLibrary");
export default class MeasureTool extends MapNavigationItemController {
    constructor(props) {
        super();
        this.totalDistanceMetres = 0;
        this.totalAreaMetresSquared = 0;
        this.itemRef = React.createRef();
        this.onMakeDialogMessage = () => {
            const distance = this.prettifyNumber(this.totalDistanceMetres, false);
            let message = distance;
            if (this.totalAreaMetresSquared !== 0) {
                message +=
                    "<br>" + this.prettifyNumber(this.totalAreaMetresSquared, true);
            }
            return message;
        };
        const t = i18next.t.bind(i18next);
        this.terria = props.terria;
        this.userDrawing = new UserDrawing({
            terria: props.terria,
            messageHeader: i18next.t("measure.measureTool"),
            allowPolygon: false,
            onPointClicked: this.onPointClicked,
            onPointMoved: this.onPointMoved,
            onCleanUp: this.onCleanUp,
            onMakeDialogMessage: this.onMakeDialogMessage
        });
        this.onClose = props.onClose;
    }
    get glyph() {
        return GLYPHS.measure;
    }
    get viewerMode() {
        return undefined;
    }
    prettifyNumber(number, squared) {
        if (number <= 0) {
            return "";
        }
        // Given a number representing a number in metres, make it human readable
        let label = "m";
        if (squared) {
            if (number > 999999) {
                label = "km";
                number = number / 1000000.0;
            }
        }
        else {
            if (number > 999) {
                label = "km";
                number = number / 1000.0;
            }
        }
        let numberStr = number.toFixed(2);
        // http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        numberStr = `${numberStr} ${label}`;
        if (squared) {
            numberStr += "\u00B2";
        }
        return numberStr;
    }
    updateDistance(pointEntities) {
        this.totalDistanceMetres = 0;
        if (pointEntities.entities.values.length < 1) {
            return;
        }
        const prevPoint = pointEntities.entities.values[0];
        let prevPointPos = prevPoint.position.getValue(this.terria.timelineClock.currentTime);
        for (let i = 1; i < pointEntities.entities.values.length; i++) {
            const currentPoint = pointEntities.entities.values[i];
            const currentPointPos = currentPoint.position.getValue(this.terria.timelineClock.currentTime);
            this.totalDistanceMetres =
                this.totalDistanceMetres +
                    this.getGeodesicDistance(prevPointPos, currentPointPos);
            prevPointPos = currentPointPos;
        }
        if (this.userDrawing.closeLoop) {
            const firstPoint = pointEntities.entities.values[0];
            const firstPointPos = firstPoint.position.getValue(this.terria.timelineClock.currentTime);
            this.totalDistanceMetres =
                this.totalDistanceMetres +
                    this.getGeodesicDistance(prevPointPos, firstPointPos);
        }
    }
    updateArea(pointEntities) {
        this.totalAreaMetresSquared = 0;
        if (!this.userDrawing.closeLoop) {
            // Not a closed polygon? Don't calculate area.
            return;
        }
        if (pointEntities.entities.values.length < 3) {
            return;
        }
        const perPositionHeight = true;
        const positions = [];
        for (let i = 0; i < pointEntities.entities.values.length; i++) {
            const currentPoint = pointEntities.entities.values[i];
            const currentPointPos = currentPoint.position.getValue(this.terria.timelineClock.currentTime);
            positions.push(currentPointPos);
        }
        // Request the triangles that make up the polygon from Cesium.
        const tangentPlane = EllipsoidTangentPlane.fromPoints(positions, Ellipsoid.WGS84);
        const polygons = PolygonGeometryLibrary.polygonsFromHierarchy(new PolygonHierarchy(positions), tangentPlane.projectPointsOntoPlane.bind(tangentPlane), !perPositionHeight, Ellipsoid.WGS84);
        const geom = PolygonGeometryLibrary.createGeometryFromPositions(Ellipsoid.WGS84, polygons.polygons[0], CesiumMath.RADIANS_PER_DEGREE, perPositionHeight, VertexFormat.POSITION_ONLY);
        if (geom.indices.length % 3 !== 0 ||
            geom.attributes.position.values.length % 3 !== 0) {
            // Something has gone wrong. We expect triangles. Can't calcuate area.
            return;
        }
        const coords = [];
        for (let i = 0; i < geom.attributes.position.values.length; i += 3) {
            coords.push(new Cartesian3(geom.attributes.position.values[i], geom.attributes.position.values[i + 1], geom.attributes.position.values[i + 2]));
        }
        let area = 0;
        for (let i = 0; i < geom.indices.length; i += 3) {
            const ind1 = geom.indices[i];
            const ind2 = geom.indices[i + 1];
            const ind3 = geom.indices[i + 2];
            const a = Cartesian3.distance(coords[ind1], coords[ind2]);
            const b = Cartesian3.distance(coords[ind2], coords[ind3]);
            const c = Cartesian3.distance(coords[ind3], coords[ind1]);
            // Heron's formula
            const s = (a + b + c) / 2.0;
            area += Math.sqrt(s * (s - a) * (s - b) * (s - c));
        }
        this.totalAreaMetresSquared = area;
    }
    getGeodesicDistance(pointOne, pointTwo) {
        // Note that Cartesian.distance gives the straight line distance between the two points, ignoring
        // curvature. This is not what we want.
        const pickedPointCartographic = Ellipsoid.WGS84.cartesianToCartographic(pointOne);
        const lastPointCartographic = Ellipsoid.WGS84.cartesianToCartographic(pointTwo);
        const geodesic = new EllipsoidGeodesic(pickedPointCartographic, lastPointCartographic);
        return geodesic.surfaceDistance;
    }
    onCleanUp() {
        this.totalDistanceMetres = 0;
        this.totalAreaMetresSquared = 0;
        super.deactivate();
    }
    onPointClicked(pointEntities) {
        this.updateDistance(pointEntities);
        this.updateArea(pointEntities);
    }
    onPointMoved(pointEntities) {
        // This is no different to clicking a point.
        this.onPointClicked(pointEntities);
    }
    /**
     * @overrides
     */
    deactivate() {
        this.userDrawing.endDrawing();
        super.deactivate();
    }
    /**
     * @overrides
     */
    activate() {
        this.userDrawing.enterDrawMode();
        super.activate();
    }
}
MeasureTool.id = "measure-tool";
MeasureTool.displayName = "MeasureTool";
__decorate([
    observable
], MeasureTool.prototype, "totalDistanceMetres", void 0);
__decorate([
    observable
], MeasureTool.prototype, "totalAreaMetresSquared", void 0);
__decorate([
    observable
], MeasureTool.prototype, "userDrawing", void 0);
__decorate([
    action
], MeasureTool.prototype, "updateDistance", null);
__decorate([
    action
], MeasureTool.prototype, "updateArea", null);
__decorate([
    action.bound
], MeasureTool.prototype, "onCleanUp", null);
__decorate([
    action.bound
], MeasureTool.prototype, "onPointClicked", null);
__decorate([
    action.bound
], MeasureTool.prototype, "onPointMoved", null);
//# sourceMappingURL=MeasureTool.js.map