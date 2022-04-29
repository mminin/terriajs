import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import EllipsoidTerrainProvider from "terriajs-cesium/Source/Core/EllipsoidTerrainProvider";
import sampleTerrainMostDetailed from "terriajs-cesium/Source/Core/sampleTerrainMostDetailed";
import ScreenSpaceEventHandler from "terriajs-cesium/Source/Core/ScreenSpaceEventHandler";
import ScreenSpaceEventType from "terriajs-cesium/Source/Core/ScreenSpaceEventType";
import MouseTooltip from "./MouseTooltip";
const DropPedestrianToGround = props => {
    const cesium = props.cesium;
    const scene = cesium.scene;
    const eventHandler = new ScreenSpaceEventHandler(scene.canvas);
    const [t] = useTranslation();
    const [showMouseTooltip, setShowMouseTooltip] = useState(true);
    useEffect(function setupEventHandlers() {
        // Pause feature picking while we select a drop point on the map.
        cesium.isFeaturePickingPaused = true;
        const dropPedestrian = ({ position: mousePosition }) => {
            // Convert mouse position to a point on the globe.
            const pickRay = scene.camera.getPickRay(mousePosition);
            const pickPosition = scene.globe.pick(pickRay, scene);
            if (!pickPosition)
                return;
            setShowMouseTooltip(false);
            // Get the precise position and fly to it.
            getPrecisePosition(scene, pickPosition).then(cartographic => {
                cartographic.height += props.pedestrianHeight;
                const position = Cartographic.toCartesian(cartographic);
                flyTo(scene, position, {
                    orientation: {
                        heading: 0,
                        pitch: 0,
                        roll: 0
                    }
                }).then(props.afterDrop);
            });
        };
        const onKeyDown = (ev) => {
            if (ev.key === "Escape")
                props.onDropCancelled();
        };
        eventHandler.setInputAction(dropPedestrian, ScreenSpaceEventType.LEFT_CLICK);
        eventHandler.setInputAction(props.onDropCancelled, ScreenSpaceEventType.RIGHT_CLICK);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            eventHandler.destroy();
            cesium.isFeaturePickingPaused = false;
        };
    });
    return (React.createElement(React.Fragment, null, showMouseTooltip && (React.createElement(MouseTooltip, { scene: scene, text: t("pedestrianMode.dropPedestrianTooltipMessage") }))));
};
async function getPrecisePosition(scene, position) {
    const terrainProvider = scene.terrainProvider;
    const cartographic = Cartographic.fromCartesian(position);
    let preciseCartographic;
    if (terrainProvider === undefined ||
        terrainProvider instanceof EllipsoidTerrainProvider) {
        preciseCartographic = cartographic;
        preciseCartographic.height = Math.max(0, preciseCartographic.height);
    }
    else {
        [preciseCartographic] = await sampleTerrainMostDetailed(terrainProvider, [
            cartographic
        ]);
    }
    return preciseCartographic;
}
async function flyTo(scene, destination, options) {
    return new Promise(resolve => scene.camera.flyTo({
        destination,
        ...options,
        complete: () => {
            scene.requestRender();
            resolve();
        }
    }));
}
export default DropPedestrianToGround;
//# sourceMappingURL=DropPedestrianToGround.js.map