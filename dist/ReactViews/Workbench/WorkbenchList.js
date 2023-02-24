var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "!!style-loader!css-loader?sourceMap!./sortable.css";
import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
//@ts-ignore
import Sortable from "react-anything-sortable";
import styled from "styled-components";
import { Ul } from "../../Styled/List";
import WorkbenchItem from "./WorkbenchItem";
import WorkbenchSplitScreen from "./WorkbenchSplitScreen";
const StyledUl = styled(Ul) `
  margin: 5px 0;
  li {
    &:first-child {
      margin-top: 0;
    }
  }
`;
let WorkbenchList = class WorkbenchList extends React.Component {
    onSort(sortedArray, currentDraggingSortData, currentDraggingIndex) {
        this.props.terria.workbench.moveItemToIndex(currentDraggingSortData, currentDraggingIndex);
    }
    render() {
        return (React.createElement(StyledUl, { overflowY: "auto", overflowX: "hidden", scroll: true, paddedHorizontally: true, fullWidth: true, fullHeight: true, column: true },
            this.props.terria.showSplitter && (React.createElement(WorkbenchSplitScreen, { terria: this.props.terria })),
            React.createElement(Sortable, { onSort: this.onSort, direction: "vertical", dynamic: true, css: `
            width: 100%;
          ` }, this.props.terria.workbench.items.map((item) => {
                return (React.createElement(WorkbenchItem, { item: item, sortData: item, key: item.uniqueId, viewState: this.props.viewState }));
            }))));
    }
};
__decorate([
    action.bound
], WorkbenchList.prototype, "onSort", null);
WorkbenchList = __decorate([
    observer
], WorkbenchList);
export default WorkbenchList;
//# sourceMappingURL=WorkbenchList.js.map