import { runInAction } from "mobx";
var ViewerMode;
(function (ViewerMode) {
    ViewerMode["Cesium"] = "cesium";
    ViewerMode["Leaflet"] = "leaflet";
})(ViewerMode || (ViewerMode = {}));
export const MapViewers = Object.seal({
    "3d": {
        viewerMode: ViewerMode.Cesium,
        terrain: true,
        label: "settingPanel.viewerModeLabels.CesiumTerrain",
        available: true
    },
    "3dsmooth": {
        viewerMode: ViewerMode.Cesium,
        terrain: false,
        label: "settingPanel.viewerModeLabels.CesiumEllipsoid",
        available: true
    },
    "2d": {
        viewerMode: ViewerMode.Leaflet,
        terrain: false,
        label: "settingPanel.viewerModeLabels.Leaflet",
        available: true
    }
});
export const isViewerMode = (mode) => mode in MapViewers;
export function setViewerMode(viewerMode, viewer) {
    runInAction(() => {
        if (viewerMode === "3d" || viewerMode === "3dsmooth") {
            viewer.viewerMode = ViewerMode.Cesium;
            viewer.viewerOptions.useTerrain = viewerMode === "3d";
        }
        else if (viewerMode === "2d") {
            viewer.viewerMode = ViewerMode.Leaflet;
        }
        else {
            console.error(`Trying to select ViewerMode ${viewerMode} that doesn't exist`);
        }
    });
}
export default ViewerMode;
//# sourceMappingURL=ViewerMode.js.map