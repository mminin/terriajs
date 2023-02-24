var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ChartPanel from "../Custom/Chart/ChartPanel";
import measureElement from "../HOCs/measureElement";
import withControlledVisibility from "../HOCs/withControlledVisibility";
import Styles from "./bottom-dock.scss";
import ChartDisclaimer from "./ChartDisclaimer";
import Timeline from "./Timeline/Timeline";
let BottomDock = class BottomDock extends React.Component {
    constructor() {
        super(...arguments);
        this.refToMeasure = null;
    }
    handleClick() {
        runInAction(() => {
            this.props.viewState.topElement = "BottomDock";
        });
    }
    componentDidUpdate(prevProps) {
        var _a;
        if (prevProps.heightFromMeasureElementHOC !==
            this.props.heightFromMeasureElementHOC) {
            this.props.viewState.setBottomDockHeight((_a = this.props.heightFromMeasureElementHOC) !== null && _a !== void 0 ? _a : 0);
        }
    }
    render() {
        const { terria } = this.props;
        const top = terria.timelineStack.top;
        return (React.createElement("div", { className: `${Styles.bottomDock} ${this.props.viewState.topElement === "BottomDock" ? "top-element" : ""}`, ref: (element) => {
                if (element !== null) {
                    this.refToMeasure = element;
                }
            }, tabIndex: 0, onClick: this.handleClick.bind(this), css: `
          background: ${(p) => p.theme.dark};
        ` },
            React.createElement("div", { id: "TJS-BottomDockFirstPortal" }),
            React.createElement(ChartDisclaimer, { terria: terria, viewState: this.props.viewState }),
            React.createElement(ChartPanel, { terria: terria, viewState: this.props.viewState }),
            top && (React.createElement(Timeline, { terria: terria, elementConfig: this.props.terria.elements.get("timeline") })),
            React.createElement("div", { id: "TJS-BottomDockLastPortal" })));
    }
};
BottomDock = __decorate([
    observer
], BottomDock);
export default withControlledVisibility(measureElement(BottomDock, false));
//# sourceMappingURL=BottomDock.js.map