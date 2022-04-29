var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, runInAction, when } from "mobx";
import React from "react";
import { withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import getTimestamp from "terriajs-cesium/Source/Core/getTimestamp";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Matrix4 from "terriajs-cesium/Source/Core/Matrix4";
import Ray from "terriajs-cesium/Source/Core/Ray";
import Transforms from "terriajs-cesium/Source/Core/Transforms";
import isDefined from "../../../../Core/isDefined";
import Box from "../../../../Styled/Box";
import Icon, { StyledIcon } from "../../../../Styled/Icon";
import GyroscopeGuidance from "../../../GyroscopeGuidance/GyroscopeGuidance";
import { withTerriaRef } from "../../../HOCs/withTerriaRef";
import FadeIn from "../../../Transitions/FadeIn/FadeIn";
const CameraFlightPath = require("terriajs-cesium/Source/Scene/CameraFlightPath")
    .default;
export const COMPASS_LOCAL_PROPERTY_KEY = "CompassHelpPrompted";
const StyledCompass = styled.div `
  display: none;
  position: relative;
  width: ${props => props.theme.compassWidth}px;
  height: ${props => props.theme.compassWidth}px;
  @media (min-width: ${props => props.theme.sm}px) {
    display: block;
  }
`;
/**
 * Take a compass width and scale it up 10px, instead of hardcoding values like:
 * // const compassScaleRatio = 66 / 56;
 */
const getCompassScaleRatio = (compassWidth) => (Number(compassWidth) + 10) / Number(compassWidth);
/**
 * You think 0.9999 is a joke but I kid you not, it's the root of all evil in
 * bandaging these related issues:
 * https://github.com/TerriaJS/terriajs/issues/4261
 * https://github.com/TerriaJS/terriajs/pull/4262
 * https://github.com/TerriaJS/terriajs/pull/4213
 *
 * It seems the rendering in Chrome means that in certain conditions
 * - chrome (not even another webkit browser)
 * - "default browser zoom" (doesn't happen when you are even at 110%, but will
 *   when shrunk down enough)
 * - the way our compass is composed
 *
 * The action of triggering the 'active' state (scaled up to
 * `getCompassScaleRatio()`) & back down means that the "InnerRing" will look
 * off-center by 0.5-1px until you switch windows/tabs away and back, then
 * chrome will decide to render it in the correct position.
 *
 * I haven't dug further to the root cause as doing it like this means wew now
 * have a beautiful animating compass.
 *
 * So please leave scale(0.9999) alone unless you can fix the rendering issue in
 * chrome, or if you want to develop a burning hatred for the compass 🙏🔥
 *
 **/
const StyledCompassOuterRing = styled.div `
  ${props => props.theme.centerWithoutFlex()}
  // override the transform provided in centerWithoutFlex()
  transform: translate(-50%,-50%) scale(0.9999);
  z-index: ${props => (props.active ? "2" : "1")};
  width: 100%;
  ${props => props.active &&
    `transform: translate(-50%,-50%) scale(${getCompassScaleRatio(props.theme.compassWidth)});`};
  transition: transform 0.3s;
`;
const StyledCompassInnerRing = styled.div `
  ${props => props.theme.verticalAlign()}

  width: ${props => Number(props.theme.compassWidth) - Number(props.theme.ringWidth) - 10}px;
  height: ${props => Number(props.theme.compassWidth) - Number(props.theme.ringWidth) - 10}px;
  margin: 0 auto;
  padding: 4px;
  box-sizing: border-box;
`;
const StyledCompassRotationMarker = styled.div `
  ${props => props.theme.centerWithoutFlex()}
  z-index: 3;
  cursor: pointer;
  width: ${props => Number(props.theme.compassWidth) + Number(props.theme.ringWidth) - 4}px;
  height: ${props => Number(props.theme.compassWidth) + Number(props.theme.ringWidth) - 4}px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: contain;
`;
// the compass on map
class Compass extends React.Component {
    /**
     * @param {Props} props
     */
    constructor(props) {
        super(props);
        this.isRotating = false;
        this.rotateInitialCursorAngle = 0;
        this.rotateIsLook = false;
        this.rotateInitialCameraAngle = 0;
        this.rotateInitialCameraDistance = 0;
        this.orbitIsLook = false;
        this.orbitLastTimestamp = 0;
        this.isOrbiting = false;
        this.state = {
            orbitCursorAngle: 0,
            heading: 0.0,
            orbitCursorOpacity: 0,
            active: false,
            activeForTransition: false
        };
        when(() => isDefined(this.cesiumViewer), () => this.cesiumLoaded());
    }
    get cesiumViewer() {
        return this.props.terria.cesium;
    }
    cesiumLoaded() {
        this._unsubscribeFromViewerChange = this.props.terria.mainViewer.afterViewerChanged.addEventListener(() => viewerChange(this));
        viewerChange(this);
    }
    componentWillUnmount() {
        if (this.orbitMouseMoveFunction) {
            document.removeEventListener("mousemove", this.orbitMouseMoveFunction, false);
        }
        if (this.orbitMouseUpFunction) {
            document.removeEventListener("mouseup", this.orbitMouseUpFunction, false);
        }
        this._unsubscribeFromAnimationFrame &&
            this._unsubscribeFromAnimationFrame();
        this._unsubscribeFromPostRender && this._unsubscribeFromPostRender();
        this._unsubscribeFromViewerChange && this._unsubscribeFromViewerChange();
    }
    handleMouseDown(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        if (e.preventDefault)
            e.preventDefault();
        const compassElement = e.currentTarget;
        const compassRectangle = e.currentTarget.getBoundingClientRect();
        const maxDistance = compassRectangle.width / 2.0;
        const center = new Cartesian2((compassRectangle.right - compassRectangle.left) / 2.0, (compassRectangle.bottom - compassRectangle.top) / 2.0);
        const clickLocation = new Cartesian2(e.clientX - compassRectangle.left, e.clientY - compassRectangle.top);
        const vector = Cartesian2.subtract(clickLocation, center, vectorScratch);
        const distanceFromCenter = Cartesian2.magnitude(vector);
        const distanceFraction = distanceFromCenter / maxDistance;
        const nominalTotalRadius = 145;
        const nominalGyroRadius = 50;
        if (distanceFraction < nominalGyroRadius / nominalTotalRadius) {
            orbit(this, compassElement, vector);
        }
        else if (distanceFraction < 1.0) {
            rotate(this, compassElement, vector);
        }
        else {
            return true;
        }
    }
    handleDoubleClick(e) {
        const scene = this.props.terria.cesium.scene;
        const camera = scene.camera;
        const windowPosition = windowPositionScratch;
        windowPosition.x = scene.canvas.clientWidth / 2;
        windowPosition.y = scene.canvas.clientHeight / 2;
        const ray = camera.getPickRay(windowPosition, pickRayScratch);
        const center = scene.globe.pick(ray, scene, centerScratch);
        if (!isDefined(center)) {
            // Globe is barely visible, so reset to home view.
            this.props.terria.currentViewer.zoomTo(this.props.terria.mainViewer.homeCamera, 1.5);
            return;
        }
        const rotateFrame = Transforms.eastNorthUpToFixedFrame(center, Ellipsoid.WGS84);
        const lookVector = Cartesian3.subtract(center, camera.position, new Cartesian3());
        const flight = CameraFlightPath.createTween(scene, {
            destination: Matrix4.multiplyByPoint(rotateFrame, new Cartesian3(0.0, 0.0, Cartesian3.magnitude(lookVector)), new Cartesian3()),
            direction: Matrix4.multiplyByPointAsVector(rotateFrame, new Cartesian3(0.0, 0.0, -1.0), new Cartesian3()),
            up: Matrix4.multiplyByPointAsVector(rotateFrame, new Cartesian3(0.0, 1.0, 0.0), new Cartesian3()),
            duration: 1.5
        });
        scene.tweens.add(flight);
    }
    resetRotater() {
        this.setState({
            orbitCursorOpacity: 0,
            orbitCursorAngle: 0
        });
    }
    render() {
        const rotationMarkerStyle = {
            transform: "rotate(-" + this.state.orbitCursorAngle + "rad)",
            WebkitTransform: "rotate(-" + this.state.orbitCursorAngle + "rad)",
            opacity: this.state.orbitCursorOpacity
        };
        const outerCircleStyle = {
            transform: "rotate(-" + this.state.heading + "rad)",
            WebkitTransform: "rotate(-" + this.state.heading + "rad)",
            opacity: ""
        };
        const { t } = this.props;
        const active = this.state.active;
        const description = t("compass.description");
        const showGuidance = !this.props.viewState.terria.getLocalProperty(COMPASS_LOCAL_PROPERTY_KEY);
        return (React.createElement(StyledCompass, { onMouseDown: this.handleMouseDown.bind(this), onDoubleClick: this.handleDoubleClick.bind(this), onMouseUp: this.resetRotater.bind(this), active: active },
            React.createElement(StyledCompassOuterRing, { active: false },
                React.createElement("div", { style: outerCircleStyle },
                    React.createElement(StyledIcon, { fillColor: this.props.theme.darkWithOverlay, 
                        // if it's active, show a white circle only, as we need the base layer
                        glyph: active
                            ? Icon.GLYPHS.compassOuterSkeleton
                            : Icon.GLYPHS.compassOuter }))),
            React.createElement(StyledCompassOuterRing, { active: active, title: description, "aria-hidden": "true", role: "presentation" },
                React.createElement("div", { ref: this.props.refFromHOC, style: outerCircleStyle },
                    React.createElement(StyledIcon, { fillColor: this.props.theme.darkWithOverlay, glyph: Icon.GLYPHS.compassOuter }))),
            React.createElement(StyledCompassInnerRing, { title: t("compass.title") },
                React.createElement(StyledIcon, { fillColor: this.props.theme.darkWithOverlay, glyph: active ? Icon.GLYPHS.compassInnerArrows : Icon.GLYPHS.compassInner })),
            React.createElement(StyledCompassRotationMarker, { title: description, style: {
                    backgroundImage: require("../../../../../wwwroot/images/compass-rotation-marker.svg")
                }, onMouseOver: () => this.setState({ active: true }), onMouseOut: () => {
                    if (showGuidance) {
                        this.setState({ active: true });
                    }
                    else {
                        this.setState({ active: false });
                    }
                }, 
                // do we give focus to this? given it's purely a mouse tool
                // focus it anyway..
                tabIndex: 0, onFocus: () => this.setState({ active: true }) },
                React.createElement("div", { style: rotationMarkerStyle },
                    React.createElement(StyledIcon, { fillColor: this.props.theme.darkWithOverlay, glyph: Icon.GLYPHS.compassRotationMarker }))),
            showGuidance && (React.createElement(FadeIn, { isVisible: active },
                React.createElement(Box, { css: `
                ${(p) => p.theme.verticalAlign("absolute")}
                direction: rtl;
                right: 55px;
              ` },
                    React.createElement(GyroscopeGuidance
                    //@ts-ignore
                    , { 
                        //@ts-ignore
                        rightOffset: "72px", viewState: this.props.viewState, 
                        // handleHelp={() => {
                        //   this.props.viewState.showHelpPanel();
                        //   this.props.viewState.selectHelpMenuItem("navigation");
                        // }}
                        onClose: () => this.setState({ active: false }) }))))));
    }
}
__decorate([
    computed
], Compass.prototype, "cesiumViewer", null);
const vectorScratch = new Cartesian2();
const oldTransformScratch = new Matrix4();
const newTransformScratch = new Matrix4();
const centerScratch = new Cartesian3();
const windowPositionScratch = new Cartesian2();
const pickRayScratch = new Ray();
function rotate(viewModel, compassElement, cursorVector) {
    // Remove existing event handlers, if any.
    if (viewModel.rotateMouseMoveFunction) {
        document.removeEventListener("mousemove", viewModel.rotateMouseMoveFunction, false);
    }
    if (viewModel.rotateMouseUpFunction) {
        document.removeEventListener("mouseup", viewModel.rotateMouseUpFunction, false);
    }
    viewModel.rotateMouseMoveFunction = undefined;
    viewModel.rotateMouseUpFunction = undefined;
    viewModel.isRotating = true;
    viewModel.rotateInitialCursorAngle = Math.atan2(-cursorVector.y, cursorVector.x);
    const scene = viewModel.props.terria.cesium.scene;
    let camera = scene.camera;
    const windowPosition = windowPositionScratch;
    windowPosition.x = scene.canvas.clientWidth / 2;
    windowPosition.y = scene.canvas.clientHeight / 2;
    const ray = camera.getPickRay(windowPosition, pickRayScratch);
    const viewCenter = scene.globe.pick(ray, scene, centerScratch);
    if (!isDefined(viewCenter)) {
        viewModel.rotateFrame = Transforms.eastNorthUpToFixedFrame(camera.positionWC, Ellipsoid.WGS84, newTransformScratch);
        viewModel.rotateIsLook = true;
    }
    else {
        viewModel.rotateFrame = Transforms.eastNorthUpToFixedFrame(viewCenter, Ellipsoid.WGS84, newTransformScratch);
        viewModel.rotateIsLook = false;
    }
    let oldTransform = Matrix4.clone(camera.transform, oldTransformScratch);
    camera.lookAtTransform(viewModel.rotateFrame);
    viewModel.rotateInitialCameraAngle = Math.atan2(camera.position.y, camera.position.x);
    viewModel.rotateInitialCameraDistance = Cartesian3.magnitude(new Cartesian3(camera.position.x, camera.position.y, 0.0));
    camera.lookAtTransform(oldTransform);
    viewModel.rotateMouseMoveFunction = function (e) {
        const compassRectangle = compassElement.getBoundingClientRect();
        const center = new Cartesian2((compassRectangle.right - compassRectangle.left) / 2.0, (compassRectangle.bottom - compassRectangle.top) / 2.0);
        const clickLocation = new Cartesian2(e.clientX - compassRectangle.left, e.clientY - compassRectangle.top);
        const vector = Cartesian2.subtract(clickLocation, center, vectorScratch);
        const angle = Math.atan2(-vector.y, vector.x);
        const angleDifference = angle - viewModel.rotateInitialCursorAngle;
        const newCameraAngle = CesiumMath.zeroToTwoPi(viewModel.rotateInitialCameraAngle - angleDifference);
        camera = viewModel.props.terria.cesium.scene.camera;
        oldTransform = Matrix4.clone(camera.transform, oldTransformScratch);
        camera.lookAtTransform(viewModel.rotateFrame);
        const currentCameraAngle = Math.atan2(camera.position.y, camera.position.x);
        camera.rotateRight(newCameraAngle - currentCameraAngle);
        camera.lookAtTransform(oldTransform);
        // viewModel.props.terria.cesium.notifyRepaintRequired();
    };
    viewModel.rotateMouseUpFunction = function (e) {
        viewModel.isRotating = false;
        if (viewModel.rotateMouseMoveFunction) {
            document.removeEventListener("mousemove", viewModel.rotateMouseMoveFunction, false);
        }
        if (viewModel.rotateMouseUpFunction) {
            document.removeEventListener("mouseup", viewModel.rotateMouseUpFunction, false);
        }
        viewModel.rotateMouseMoveFunction = undefined;
        viewModel.rotateMouseUpFunction = undefined;
    };
    document.addEventListener("mousemove", viewModel.rotateMouseMoveFunction, false);
    document.addEventListener("mouseup", viewModel.rotateMouseUpFunction, false);
}
function orbit(viewModel, compassElement, cursorVector) {
    // Remove existing event handlers, if any.
    if (viewModel.orbitMouseMoveFunction) {
        document.removeEventListener("mousemove", viewModel.orbitMouseMoveFunction, false);
    }
    if (viewModel.orbitMouseUpFunction) {
        document.removeEventListener("mouseup", viewModel.orbitMouseUpFunction, false);
    }
    viewModel._unsubscribeFromAnimationFrame &&
        viewModel._unsubscribeFromAnimationFrame();
    viewModel._unsubscribeFromAnimationFrame = undefined;
    viewModel.orbitMouseMoveFunction = undefined;
    viewModel.orbitMouseUpFunction = undefined;
    viewModel.orbitAnimationFrameFunction = undefined;
    viewModel.isOrbiting = true;
    viewModel.orbitLastTimestamp = getTimestamp();
    const scene = viewModel.props.terria.cesium.scene;
    const camera = scene.camera;
    const windowPosition = windowPositionScratch;
    windowPosition.x = scene.canvas.clientWidth / 2;
    windowPosition.y = scene.canvas.clientHeight / 2;
    const ray = camera.getPickRay(windowPosition, pickRayScratch);
    const center = scene.globe.pick(ray, scene, centerScratch);
    if (!isDefined(center)) {
        viewModel.orbitFrame = Transforms.eastNorthUpToFixedFrame(camera.positionWC, Ellipsoid.WGS84, newTransformScratch);
        viewModel.orbitIsLook = true;
    }
    else {
        viewModel.orbitFrame = Transforms.eastNorthUpToFixedFrame(center, Ellipsoid.WGS84, newTransformScratch);
        viewModel.orbitIsLook = false;
    }
    viewModel.orbitAnimationFrameFunction = function (e) {
        const timestamp = getTimestamp();
        const deltaT = timestamp - viewModel.orbitLastTimestamp;
        const rate = ((viewModel.state.orbitCursorOpacity - 0.5) * 2.5) / 1000;
        const distance = deltaT * rate;
        const angle = viewModel.state.orbitCursorAngle + CesiumMath.PI_OVER_TWO;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const scene = viewModel.props.terria.cesium.scene;
        const camera = scene.camera;
        const oldTransform = Matrix4.clone(camera.transform, oldTransformScratch);
        camera.lookAtTransform(viewModel.orbitFrame);
        if (viewModel.orbitIsLook) {
            camera.look(Cartesian3.UNIT_Z, -x);
            camera.look(camera.right, -y);
        }
        else {
            camera.rotateLeft(x);
            camera.rotateUp(y);
        }
        camera.lookAtTransform(oldTransform);
        // viewModel.props.terria.cesium.notifyRepaintRequired();
        viewModel.orbitLastTimestamp = timestamp;
    };
    function updateAngleAndOpacity(vector, compassWidth) {
        const angle = Math.atan2(-vector.y, vector.x);
        viewModel.setState({
            orbitCursorAngle: CesiumMath.zeroToTwoPi(angle - CesiumMath.PI_OVER_TWO)
        });
        const distance = Cartesian2.magnitude(vector);
        const maxDistance = compassWidth / 2.0;
        const distanceFraction = Math.min(distance / maxDistance, 1.0);
        const easedOpacity = 0.5 * distanceFraction * distanceFraction + 0.5;
        viewModel.setState({
            orbitCursorOpacity: easedOpacity
        });
        // viewModel.props.terria.cesium.notifyRepaintRequired();
    }
    viewModel.orbitMouseMoveFunction = function (e) {
        const compassRectangle = compassElement.getBoundingClientRect();
        const center = new Cartesian2((compassRectangle.right - compassRectangle.left) / 2.0, (compassRectangle.bottom - compassRectangle.top) / 2.0);
        const clickLocation = new Cartesian2(e.clientX - compassRectangle.left, e.clientY - compassRectangle.top);
        const vector = Cartesian2.subtract(clickLocation, center, vectorScratch);
        updateAngleAndOpacity(vector, compassRectangle.width);
    };
    viewModel.orbitMouseUpFunction = function (e) {
        // TODO: if mouse didn't move, reset view to looking down, north is up?
        viewModel.isOrbiting = false;
        if (viewModel.orbitMouseMoveFunction) {
            document.removeEventListener("mousemove", viewModel.orbitMouseMoveFunction, false);
        }
        if (viewModel.orbitMouseUpFunction) {
            document.removeEventListener("mouseup", viewModel.orbitMouseUpFunction, false);
        }
        viewModel._unsubscribeFromAnimationFrame &&
            viewModel._unsubscribeFromAnimationFrame();
        viewModel._unsubscribeFromAnimationFrame = undefined;
        viewModel.orbitMouseMoveFunction = undefined;
        viewModel.orbitMouseUpFunction = undefined;
        viewModel.orbitAnimationFrameFunction = undefined;
    };
    document.addEventListener("mousemove", viewModel.orbitMouseMoveFunction, false);
    document.addEventListener("mouseup", viewModel.orbitMouseUpFunction, false);
    subscribeToAnimationFrame(viewModel);
    updateAngleAndOpacity(cursorVector, compassElement.getBoundingClientRect().width);
}
function subscribeToAnimationFrame(viewModel) {
    viewModel._unsubscribeFromAnimationFrame = (id => () => cancelAnimationFrame(id))(requestAnimationFrame(() => {
        if (isDefined(viewModel.orbitAnimationFrameFunction)) {
            viewModel.orbitAnimationFrameFunction();
        }
        subscribeToAnimationFrame(viewModel);
    }));
}
function viewerChange(viewModel) {
    runInAction(() => {
        if (isDefined(viewModel.props.terria.cesium)) {
            if (viewModel._unsubscribeFromPostRender) {
                viewModel._unsubscribeFromPostRender();
                viewModel._unsubscribeFromPostRender = undefined;
            }
            viewModel._unsubscribeFromPostRender = viewModel.props.terria.cesium.scene.postRender.addEventListener(function () {
                runInAction(() => {
                    viewModel.setState({
                        heading: viewModel.props.terria.cesium.scene.camera.heading
                    });
                });
            });
        }
        else {
            if (viewModel._unsubscribeFromPostRender) {
                viewModel._unsubscribeFromPostRender();
                viewModel._unsubscribeFromPostRender = undefined;
            }
            viewModel.showCompass = false;
        }
    });
}
export const COMPASS_NAME = "MapNavigationCompassOuterRing";
export const COMPASS_TOOL_ID = "compass";
export default withTranslation()(withTheme(withTerriaRef(Compass, COMPASS_NAME)));
//# sourceMappingURL=Compass.js.map