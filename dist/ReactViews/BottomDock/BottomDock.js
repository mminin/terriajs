"use strict";
import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import measureElement from "../../ReactViews/HOCs/measureElement";
import ChartPanel from "../Custom/Chart/ChartPanel";
import Styles from "./bottom-dock.scss";
import ChartDisclaimer from "./ChartDisclaimer";
import Timeline from "./Timeline/Timeline";
const BottomDock = observer(createReactClass({
    displayName: "BottomDock",
    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        heightFromMeasureElementHOC: PropTypes.number,
        domElementRef: PropTypes.func
    },
    handleClick() {
        runInAction(() => {
            this.props.viewState.topElement = "BottomDock";
        });
    },
    componentDidUpdate(prevProps) {
        if (prevProps.heightFromMeasureElementHOC !==
            this.props.heightFromMeasureElementHOC) {
            this.props.viewState.setBottomDockHeight(this.props.heightFromMeasureElementHOC);
        }
    },
    render() {
        const { terria } = this.props;
        const top = terria.timelineStack.top;
        return (React.createElement("div", { className: `${Styles.bottomDock} ${this.props.viewState.topElement === "BottomDock"
                ? "top-element"
                : ""}`, ref: element => {
                this.props.domElementRef(element);
                this.refToMeasure = element;
            }, tabIndex: 0, onClick: this.handleClick, css: `
            background: ${p => p.theme.dark};
          ` },
            React.createElement(ChartDisclaimer, { terria: terria, viewState: this.props.viewState }),
            React.createElement(ChartPanel, { terria: terria, onHeightChange: this.onHeightChange, viewState: this.props.viewState }),
            React.createElement(If, { condition: top },
                React.createElement(Timeline, { terria: terria })),
            React.createElement("div", { id: "TJS-BottomDockPortalForTool" })));
    }
}));
module.exports = measureElement(BottomDock, false);
//# sourceMappingURL=BottomDock.js.map