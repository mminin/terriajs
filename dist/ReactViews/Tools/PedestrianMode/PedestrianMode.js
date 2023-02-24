import { reaction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Cesium from "../../../Models/Cesium";
import PositionRightOfWorkbench from "../../Workbench/PositionRightOfWorkbench";
import DropPedestrianToGround from "./DropPedestrianToGround";
import MiniMap, { getViewFromScene } from "./MiniMap";
import MovementControls from "./MovementControls";
import MeasureTool from "../../Map/Navigation/Items/MeasureTool";
// The desired camera height measured from the surface in metres
export const PEDESTRIAN_HEIGHT = 1.7;
// Maximum up/down look angle in degrees
export const MAX_VERTICAL_LOOK_ANGLE = 40;
export const PEDESTRIAN_MODE_ID = "pedestrian-mode";
const PedestrianMode = observer((props) => {
    const { viewState } = props;
    const cesium = viewState.terria.currentViewer;
    const [isDropped, setIsDropped] = useState(false);
    const [view, setView] = useState();
    const onDropCancelled = () => viewState.closeTool();
    //if viewer is not cesium close tool.
    if (!(cesium instanceof Cesium)) {
        viewState.closeTool();
        return null;
    }
    const updateView = () => setView(getViewFromScene(cesium.scene));
    useEffect(() => {
        var _a;
        const item = (_a = viewState.terria.mapNavigationModel.findItem(MeasureTool.id)) === null || _a === void 0 ? void 0 : _a.controller;
        if (item && item.active) {
            item.deactivate();
        }
        viewState.terria.mapNavigationModel.disable(MeasureTool.id);
        return () => {
            viewState.terria.mapNavigationModel.enable(MeasureTool.id);
        };
    }, []);
    useEffect(function closeOnZoomTo() {
        return reaction(() => cesium.isMapZooming, (isMapZooming) => {
            if (isMapZooming)
                viewState.closeTool();
        });
    }, []);
    return (React.createElement(React.Fragment, null,
        !isDropped && (React.createElement(DropPedestrianToGround, { cesium: cesium, afterDrop: () => setIsDropped(true), onDropCancelled: onDropCancelled, pedestrianHeight: PEDESTRIAN_HEIGHT })),
        isDropped && (React.createElement(React.Fragment, null,
            React.createElement(ControlsContainer, { viewState: viewState },
                React.createElement(MovementControls, { cesium: cesium, onMove: updateView, pedestrianHeight: PEDESTRIAN_HEIGHT, maxVerticalLookAngle: MAX_VERTICAL_LOOK_ANGLE })),
            React.createElement(MiniMapContainer, { viewState: viewState },
                React.createElement(MiniMap, { terria: viewState.terria, baseMap: viewState.terria.mainViewer.baseMap, view: view || getViewFromScene(cesium.scene) }))))));
});
const ControlsContainer = styled(PositionRightOfWorkbench) `
  width: 140px;
  top: unset;
  left: 0;
  bottom: 300px;
`;
const MiniMapContainer = styled(PositionRightOfWorkbench) `
  width: 140px;
  height: 180px;
  top: unset;
  left: 0;
  bottom: 100px;
`;
export default PedestrianMode;
//# sourceMappingURL=PedestrianMode.js.map