var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { isEqual } from "lodash-es";
import { action, computed, observable, reaction, runInAction, untracked } from "mobx";
import { fromPromise, FULFILLED } from "mobx-utils";
import CesiumEvent from "terriajs-cesium/Source/Core/Event";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import CatalogMemberMixin from "../ModelMixins/CatalogMemberMixin";
import CameraView from "../Models/CameraView";
import NoViewer from "../Models/NoViewer";
import ViewerMode from "../Models/ViewerMode";
const viewerOptionsDefaults = {
    useTerrain: true
};
export default class TerriaViewer {
    constructor(terria, items) {
        this.viewerMode = ViewerMode.Cesium;
        // Set by UI
        this.viewerOptions = viewerOptionsDefaults;
        // Disable all mouse (& keyboard) interaction
        this.disableInteraction = false;
        this._homeCamera = new CameraView(Rectangle.MAX_VALUE);
        /**
         * The distance between two pixels at the bottom center of the screen.
         * Set in lib/ReactViews/Map/Legend/DistanceLegend.jsx
         */
        this.scale = 1;
        this.beforeViewerChanged = new CesiumEvent();
        this.afterViewerChanged = new CesiumEvent();
        this.viewerChangeTracker = undefined;
        this.terria = terria;
        this.items = items;
        if (!this.viewerChangeTracker) {
            this.viewerChangeTracker = reaction(() => this.currentViewer, () => {
                this.afterViewerChanged.raiseEvent();
            });
        }
    }
    get baseMap() {
        return this._baseMap;
    }
    async setBaseMap(baseMap) {
        var _a;
        if (!baseMap)
            return;
        if (baseMap) {
            const result = await baseMap.loadMapItems();
            if (result.error) {
                result.raiseError(this.terria, {
                    title: {
                        key: "models.terria.loadingBaseMapErrorTitle",
                        parameters: {
                            name: (_a = (CatalogMemberMixin.isMixedInto(baseMap)
                                ? baseMap.name
                                : baseMap.uniqueId)) !== null && _a !== void 0 ? _a : "Unknown item"
                        }
                    }
                });
            }
            else {
                runInAction(() => (this._baseMap = baseMap));
            }
        }
    }
    get homeCamera() {
        return this._homeCamera;
    }
    set homeCamera(cameraView) {
        if (isEqual(this._homeCamera.rectangle, Rectangle.MAX_VALUE)) {
            this.currentViewer.zoomTo(cameraView, 0.0);
        }
        this._homeCamera = cameraView;
    }
    get attached() {
        return this.mapContainer !== undefined;
    }
    get currentViewer() {
        // Use untracked on everything to ensure the viewer isn't recreated
        //  except when the viewer is required to change, the currently required
        //  viewer class finishes loading from an async chunk or the map container
        //  is changed
        const currentView = untracked(() => this.destroyCurrentViewer());
        let newViewer;
        try {
            if (this.attached && this.viewerMode === ViewerMode.Leaflet) {
                const LeafletOrNoViewer = this._getLeafletIfLoaded();
                newViewer = untracked(() => new LeafletOrNoViewer(this, this.mapContainer));
            }
            else if (this.attached && this.viewerMode === ViewerMode.Cesium) {
                const CesiumOrNoViewer = this._getCesiumIfLoaded();
                newViewer = untracked(() => new CesiumOrNoViewer(this, this.mapContainer));
            }
            else {
                newViewer = untracked(() => new NoViewer(this));
            }
        }
        catch (error) {
            // Switch viewerMode inside computed. Could change viewers to
            //  guarantee no throw in constructor and instead have a `start()`
            //  method that can throw. Then call that `start()` method inside
            //  a reaction (reaction would also deal with viewer fallback).
            // Using this approach might remove the need for `untracked`
            setTimeout(action(() => {
                this.terria.raiseErrorToUser(error);
                this.viewerMode =
                    this.viewerMode === ViewerMode.Cesium
                        ? ViewerMode.Leaflet
                        : undefined;
            }), 0);
            newViewer = untracked(() => new NoViewer(this));
        }
        console.log(`Creating a viewer: ${newViewer.type}`);
        this._lastViewer = newViewer;
        newViewer.zoomTo(currentView || untracked(() => this.homeCamera), 0.0);
        return newViewer;
    }
    get _cesiumPromise() {
        return fromPromise(import("../Models/Cesium").then((Cesium) => Cesium.default));
    }
    _getCesiumIfLoaded() {
        if (this._cesiumPromise.state === FULFILLED) {
            return this._cesiumPromise.value;
        }
        else {
            // TODO: Handle error loading Cesium. What do you do if a bundle doesn't load?
            return NoViewer;
        }
    }
    get _leafletPromise() {
        return fromPromise(import("../Models/Leaflet").then((Leaflet) => Leaflet.default));
    }
    _getLeafletIfLoaded() {
        if (this._leafletPromise.state === FULFILLED) {
            return this._leafletPromise.value;
        }
        else {
            // TODO: Handle error loading Leaflet. What do you do if a bundle doesn't load?
            return NoViewer;
        }
    }
    // Pull out attaching logic into it's own step. This allows constructing a TerriaViewer
    // before its UI element is mounted in React to set basemap, items, viewermode
    attach(mapContainer) {
        this.mapContainer = mapContainer;
    }
    detach() {
        // Detach from a container
        this.mapContainer = undefined;
        this.destroyCurrentViewer();
    }
    destroy() {
        this.detach();
    }
    destroyCurrentViewer() {
        let currentView;
        if (this._lastViewer !== undefined) {
            this.beforeViewerChanged.raiseEvent();
            console.log(`Destroying viewer: ${this._lastViewer.type}`);
            currentView = this._lastViewer.getCurrentCameraView();
            this._lastViewer.destroy();
            this._lastViewer = undefined;
        }
        return currentView;
    }
}
__decorate([
    observable
], TerriaViewer.prototype, "_baseMap", void 0);
__decorate([
    observable
], TerriaViewer.prototype, "viewerMode", void 0);
__decorate([
    observable
], TerriaViewer.prototype, "viewerOptions", void 0);
__decorate([
    observable
], TerriaViewer.prototype, "disableInteraction", void 0);
__decorate([
    computed
], TerriaViewer.prototype, "homeCamera", null);
__decorate([
    observable
], TerriaViewer.prototype, "mapContainer", void 0);
__decorate([
    observable
], TerriaViewer.prototype, "scale", void 0);
__decorate([
    computed({
        keepAlive: true
    })
], TerriaViewer.prototype, "currentViewer", null);
__decorate([
    computed({
        keepAlive: true
    })
], TerriaViewer.prototype, "_cesiumPromise", null);
__decorate([
    computed({
        keepAlive: true
    })
], TerriaViewer.prototype, "_leafletPromise", null);
__decorate([
    action
], TerriaViewer.prototype, "attach", null);
__decorate([
    action
], TerriaViewer.prototype, "detach", null);
//# sourceMappingURL=TerriaViewer.js.map