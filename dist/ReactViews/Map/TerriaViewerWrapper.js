var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Styles from "./terria-viewer-wrapper.scss";
import Splitter from "./Splitter";
/**
 * @typedef {object} Props
 * @prop {Terria} terria
 * @prop {ViewState} viewState
 *
 * @extends {React.Component<Props>}
 */
let TerriaViewerWrapper = class TerriaViewerWrapper extends React.Component {
    constructor() {
        super(...arguments);
        /**
         * @argument {HTMLDivElement} container
         */
        this.containerRef = (container) => {
            this.props.terria.mainViewer.attached &&
                this.props.terria.mainViewer.detach();
            if (container !== null) {
                this.props.terria.mainViewer.attach(container);
            }
        };
    }
    componentWillUnmount() {
        this.props.terria.mainViewer.attached &&
            this.props.terria.mainViewer.detach();
    }
    render() {
        return (React.createElement("aside", { className: Styles.container },
            React.createElement("div", { className: Styles.mapPlaceholder }, "Loading the map, please wait..."),
            React.createElement(Splitter, { terria: this.props.terria, viewState: this.props.viewState }),
            React.createElement("div", { id: "cesiumContainer", className: Styles.cesiumContainer, ref: this.containerRef })));
    }
};
TerriaViewerWrapper.propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired
};
TerriaViewerWrapper = __decorate([
    observer
], TerriaViewerWrapper);
module.exports = TerriaViewerWrapper;
//# sourceMappingURL=TerriaViewerWrapper.js.map