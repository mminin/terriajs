"use strict";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import CameraView from "./CameraView";
import GlobeOrMap from "./GlobeOrMap";
class NoViewer extends GlobeOrMap {
    constructor(terriaViewer) {
        super();
        this.type = "none";
        this.canShowSplitter = false;
        this._currentView = new CameraView(Rectangle.MAX_VALUE);
        this.terria = terriaViewer.terria;
    }
    destroy() { }
    doZoomTo(v, t) {
        if (v instanceof CameraView) {
            this._currentView = v;
        }
        else if (v instanceof Rectangle) {
            this._currentView = new CameraView(v);
        }
        return Promise.resolve();
    }
    notifyRepaintRequired() { }
    pickFromLocation(latLngHeight, providerCoords, existingFeatures) { }
    /**
     * Return features at a latitude, longitude and (optionally) height for the given imageryLayer
     * @param latLngHeight The position on the earth to pick
     * @param providerCoords A map of imagery provider urls to the tile coords used to get features for those imagery
     * @returns A flat array of all the features for the given tiles that are currently on the map
     */
    getFeaturesAtLocation(latLngHeight, providerCoords) { }
    getCurrentCameraView() {
        return this._currentView;
    }
    getContainer() {
        return undefined;
    }
    pauseMapInteraction() { }
    resumeMapInteraction() { }
    _addVectorTileHighlight(imageryProvider, rectangle) {
        return () => { };
    }
}
export default NoViewer;
//# sourceMappingURL=NoViewer.js.map