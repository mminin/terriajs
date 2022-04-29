var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import PropTypes from "prop-types";
import Sortable from "react-anything-sortable";
import WorkbenchSplitScreen from "./WorkbenchSplitScreen";
import WorkbenchItem from "./WorkbenchItem";
import { observer } from "mobx-react";
import { action } from "mobx";
import Styles from "./workbench-list.scss";
import "!!style-loader!css-loader?sourceMap!./sortable.css";
let WorkbenchList = class WorkbenchList extends React.Component {
    onSort(sortedArray, currentDraggingSortData, currentDraggingIndex) {
        this.props.terria.workbench.moveItemToIndex(currentDraggingSortData, currentDraggingIndex);
    }
    render() {
        return (React.createElement("ul", { className: Styles.workbenchContent },
            this.props.terria.showSplitter && (React.createElement(WorkbenchSplitScreen, { terria: this.props.terria })),
            React.createElement(Sortable, { onSort: this.onSort, direction: "vertical", dynamic: true },
                React.createElement(For, { each: "item", of: this.props.terria.workbench.items },
                    React.createElement(WorkbenchItem, { item: item, sortData: item, key: item.uniqueId, viewState: this.props.viewState })))));
    }
};
WorkbenchList.propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired
};
__decorate([
    action.bound
], WorkbenchList.prototype, "onSort", null);
WorkbenchList = __decorate([
    observer
], WorkbenchList);
module.exports = WorkbenchList;
//# sourceMappingURL=WorkbenchList.js.map