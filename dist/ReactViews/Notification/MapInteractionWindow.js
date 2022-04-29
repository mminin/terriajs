"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
const parseCustomHtmlToReact = require("../Custom/parseCustomHtmlToReact")
    .default;
import Styles from "./map-interaction-window.scss";
import classNames from "classnames";
import { observer } from "mobx-react";
import { UIMode } from "../../Models/MapInteractionMode";
import { observable, reaction } from "mobx";
import isDefined from "../../Core/isDefined";
const MapInteractionWindowWrapper = styled.div `
  ${props => props.isDiffTool &&
    `
    display: none;
    top: initial;
    bottom: 100px;
    min-width: 330px;
    width: auto;

    box-sizing: border-box;
    padding: 10px 15px;
    background: ${props.theme.colorSecondary};
    color:${props.theme.textLight};
  `}
`;
let MapInteractionWindow = class MapInteractionWindow extends React.Component {
    constructor() {
        super(...arguments);
        this.displayName = "MapInteractionWindow";
    }
    componentWillUnmount() {
        var _a;
        // this.removeContextItem();
        if (typeof ((_a = this.currentInteractionMode) === null || _a === void 0 ? void 0 : _a.onEnable) === "function") {
            this.currentInteractionMode.onEnable(this.props.viewState);
        }
        this.disposeMapInteractionObserver && this.disposeMapInteractionObserver();
    }
    componentDidMount() {
        this.disposeMapInteractionObserver = reaction(() => this.props.terria.mapInteractionModeStack.length > 0 &&
            this.props.terria.mapInteractionModeStack[this.props.terria.mapInteractionModeStack.length - 1], () => {
            var _a;
            const mapInteractionMode = this.props.terria.mapInteractionModeStack[this.props.terria.mapInteractionModeStack.length - 1];
            if (mapInteractionMode !== this.currentInteractionMode) {
                this.currentInteractionMode = mapInteractionMode;
            }
            if (typeof ((_a = this.currentInteractionMode) === null || _a === void 0 ? void 0 : _a.onEnable) === "function") {
                this.currentInteractionMode.onEnable(this.props.viewState);
            }
        });
    }
    // /* eslint-disable-next-line camelcase */
    // UNSAFE_componentWillReceiveProps(nextProps: any) {
    //   // Only enable context item if MapInteractionWindow is rendering
    //   if (isDefined(this.currentInteractionMode)) {
    //     this.enableContextItem(nextProps);
    //   } else {
    //     this.removeContextItem();
    //   }
    // }
    // enableContextItem(props: any) {
    //   this.removeContextItem();
    //   if (
    //     defined(props.viewState.previewedItem) &&
    //     defined(props.viewState.previewedItem.contextItem)
    //   ) {
    //     props.viewState.previewedItem.contextItem.isEnabled = true;
    //     this._lastContextItem = props.viewState.previewedItem.contextItem;
    //   }
    // }
    // removeContextItem() {
    //   if (defined(this._lastContextItem)) {
    //     this._lastContextItem.isEnabled = false;
    //     this._lastContextItem = undefined;
    //   }
    // }
    render() {
        var _a, _b, _c;
        const isActive = isDefined(this.currentInteractionMode) &&
            !this.currentInteractionMode.invisible;
        const windowClass = classNames(Styles.window, {
            [Styles.isActive]: isActive
        });
        const isDiffTool = ((_a = this.currentInteractionMode) === null || _a === void 0 ? void 0 : _a.uiMode) === UIMode.Difference;
        return (React.createElement(MapInteractionWindowWrapper, { className: windowClass, "aria-hidden": !isActive, isDiffTool: isDiffTool },
            React.createElement("div", { className: classNames({
                    [Styles.content]: !isDiffTool
                }) },
                isDefined(this.currentInteractionMode) &&
                    parseCustomHtmlToReact(this.currentInteractionMode.message()),
                isDefined(this.currentInteractionMode) &&
                    this.currentInteractionMode.messageAsNode()),
            typeof ((_b = this.currentInteractionMode) === null || _b === void 0 ? void 0 : _b.customUi) === "function" &&
                this.currentInteractionMode.customUi(),
            ((_c = this.currentInteractionMode) === null || _c === void 0 ? void 0 : _c.onCancel) && (React.createElement("button", { type: "button", onClick: this.currentInteractionMode.onCancel, className: Styles.btn }, this.currentInteractionMode.buttonText))));
    }
};
MapInteractionWindow.propTypes = {
    terria: PropTypes.object,
    viewState: PropTypes.object
};
__decorate([
    observable
], MapInteractionWindow.prototype, "currentInteractionMode", void 0);
MapInteractionWindow = __decorate([
    observer
], MapInteractionWindow);
export default MapInteractionWindow;
//# sourceMappingURL=MapInteractionWindow.js.map