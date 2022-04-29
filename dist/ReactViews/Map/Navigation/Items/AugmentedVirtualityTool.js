var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ViewerMode from "../../../../Models/ViewerMode";
import { GLYPHS, Icon } from "../../../../Styled/Icon";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";
import MapIconButton from "../../../MapIconButton/MapIconButton";
export const AR_TOOL_ID = "AR_TOOL";
export class AugmentedVirtualityController extends MapNavigationItemController {
    constructor(props) {
        super();
        this.props = props;
        this.experimentalWarningShown = false;
    }
    get active() {
        return this.props.augmentedVirtuality.active;
    }
    get glyph() {
        return this.active ? GLYPHS.arOn : GLYPHS.arOff;
    }
    get viewerMode() {
        return ViewerMode.Cesium;
    }
    activate() {
        // Make the AugmentedVirtuality module avaliable elsewhere.
        this.props.terria.augmentedVirtuality = this.props.augmentedVirtuality;
        // feature detect for new ios 13
        // it seems you don't need to ask for both, but who knows, ios 14 / something
        // could change again
        if (window.DeviceMotionEvent &&
            // exists on window by now?
            typeof DeviceMotionEvent.requestPermission === "function") {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                if (permissionState !== "granted") {
                    console.error("couldn't get access for motion events");
                }
            })
                .catch(console.error);
        }
        if (window.DeviceOrientationEvent &&
            // exists on window by now?
            typeof DeviceOrientationEvent.requestPermission === "function") {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                if (permissionState !== "granted") {
                    console.error("couldn't get access for orientation events");
                }
            })
                .catch(console.error);
        }
        const { experimentalWarning = true } = this.props;
        if (experimentalWarning !== false && !this.experimentalWarningShown) {
            this.experimentalWarningShown = true;
            this.props.viewState.terria.notificationState.addNotificationToQueue({
                title: i18next.t("AR.title"),
                message: i18next.t("AR.experimentalFeatureMessage"),
                confirmText: i18next.t("AR.confirmText")
            });
        }
        this.props.augmentedVirtuality.activate();
    }
    deactivate() {
        this.props.augmentedVirtuality.deactivate();
    }
}
__decorate([
    observable
], AugmentedVirtualityController.prototype, "experimentalWarningShown", void 0);
__decorate([
    computed
], AugmentedVirtualityController.prototype, "active", null);
__decorate([
    action.bound
], AugmentedVirtualityController.prototype, "activate", null);
export class AugmentedVirtualityRealignController extends MapNavigationItemController {
    constructor(props) {
        super();
        this.props = props;
        this.experimentalWarningShown = false;
        this.realignHelpShown = false;
        this.resetRealignHelpShown = false;
        this.augmentedVirtuality = props.augmentedVirtuality;
    }
    get glyph() {
        return !this.augmentedVirtuality.manualAlignmentSet
            ? GLYPHS.arRealign
            : GLYPHS.arResetAlignment;
    }
    get viewerMode() {
        return ViewerMode.Cesium;
    }
    get visible() {
        return this.props.augmentedVirtuality.active && super.visible;
    }
    handleClick() {
        if (!this.augmentedVirtuality.manualAlignmentSet) {
            this.handleClickRealign();
        }
        else if (!this.augmentedVirtuality.manualAlignment) {
            this.handleClickResetRealign();
        }
    }
    handleClickRealign() {
        if (!this.realignHelpShown) {
            this.realignHelpShown = true;
            this.props.viewState.terria.notificationState.addNotificationToQueue({
                title: i18next.t("AR.manualAlignmentTitle"),
                message: i18next.t("AR.manualAlignmentMessage", {
                    img: '<img width="100%" src="./build/TerriaJS/images/ar-realign-guide.gif" />'
                }),
                confirmText: i18next.t("AR.confirmText")
            });
        }
        this.augmentedVirtuality.toggleManualAlignment();
    }
    handleClickResetRealign() {
        if (!this.resetRealignHelpShown) {
            this.resetRealignHelpShown = true;
            this.props.viewState.terria.notificationState.addNotificationToQueue({
                title: i18next.t("AR.resetAlignmentTitle"),
                message: i18next.t("AR.resetAlignmentMessage"),
                confirmText: i18next.t("AR.confirmText")
            });
        }
        this.augmentedVirtuality.resetAlignment();
    }
}
__decorate([
    observable
], AugmentedVirtualityRealignController.prototype, "experimentalWarningShown", void 0);
__decorate([
    observable
], AugmentedVirtualityRealignController.prototype, "realignHelpShown", void 0);
__decorate([
    observable
], AugmentedVirtualityRealignController.prototype, "resetRealignHelpShown", void 0);
__decorate([
    computed
], AugmentedVirtualityRealignController.prototype, "glyph", null);
__decorate([
    computed
], AugmentedVirtualityRealignController.prototype, "visible", null);
__decorate([
    action.bound
], AugmentedVirtualityRealignController.prototype, "handleClickRealign", null);
__decorate([
    action.bound
], AugmentedVirtualityRealignController.prototype, "handleClickResetRealign", null);
export const AugmentedVirtualityRealign = observer((props) => {
    const augmentedVirtuality = props.arRealignController.augmentedVirtuality;
    const realignment = augmentedVirtuality.manualAlignment;
    const { t } = useTranslation();
    return !augmentedVirtuality.manualAlignmentSet ? (React.createElement(StyledMapIconButton, { noExpand: true, blink: realignment, iconElement: () => React.createElement(Icon, { glyph: GLYPHS.arRealign }), title: t("AR.btnRealign"), onClick: props.arRealignController.handleClickRealign })) : (React.createElement(MapIconButton, { noExpand: true, iconElement: () => React.createElement(Icon, { glyph: GLYPHS.arResetAlignment }), title: t("AR.btnResetRealign"), onClick: props.arRealignController.handleClickResetRealign }));
});
export class AugmentedVirtualityHoverController extends MapNavigationItemController {
    constructor(props) {
        super();
        this.props = props;
    }
    get glyph() {
        const hoverLevel = this.props.augmentedVirtuality.hoverLevel;
        // Note: We use the image of the next level that we will be changing to, not the level the we are currently at.
        switch (hoverLevel) {
            case 0:
                return GLYPHS.arHover0;
            case 1:
                return GLYPHS.arHover1;
            case 2:
                return GLYPHS.arHover2;
            default:
                return GLYPHS.arHover0;
        }
    }
    get viewerMode() {
        return ViewerMode.Cesium;
    }
    get visible() {
        return this.props.augmentedVirtuality.active && super.visible;
    }
    handleClick() {
        this.props.augmentedVirtuality.toggleHoverHeight();
    }
}
__decorate([
    computed
], AugmentedVirtualityHoverController.prototype, "visible", null);
const StyledMapIconButton = styled(MapIconButton) `
  svg {
    ${p => p.blink &&
    `
      -webkit-animation-name: blinker;
      -webkit-animation-duration: 1s;
      -webkit-animation-timing-function: linear;
      -webkit-animation-iteration-count: infinite;

      -moz-animation-name: blinker;
      -moz-animation-duration: 1s;
      -moz-animation-timing-function: linear;
      -moz-animation-iteration-count: infinite;

      animation-name: blinker;
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    `}
  }

  @-moz-keyframes blinker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes blinker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes blinker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
//# sourceMappingURL=AugmentedVirtualityTool.js.map