var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { debounce } from "lodash-es";
import { action, computed, observable, reaction, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import isDefined from "../../../Core/isDefined";
import Box from "../../../Styled/Box";
import Icon, { GLYPHS } from "../../../Styled/Icon";
import { OVERFLOW_ITEM_ID } from "../../../ViewModels/MapNavigation/MapNavigationModel";
import withControlledVisibility from "../../HOCs/withControlledVisibility";
import MapIconButton from "../../MapIconButton/MapIconButton";
import MapNavigationItem, { Control } from "./Items/MapNavigationItem";
import { registerMapNavigations } from "./registerMapNavigations";
const OVERFLOW_ACTION_SIZE = 42;
/**
 * TODO: fix this so that we don't need to override pointer events like this.
 * a fix would look like breaking up the top and bottom parts, so there is
 * no element "drawn/painted" between the top and bottom parts of map
 * navigation
 */
const StyledMapNavigation = styled.div `
  position: absolute;
  right: 5px;
  z-index: 1;
  bottom: 25px;
  @media (min-width: ${(props) => props.theme.sm}px) {
    top: 80px;
    bottom: 50px;
    right: 16px;
  }
  @media (max-width: ${(props) => props.theme.mobile}px) {
    & > div {
      flex-direction: row;
    }
  }
  pointer-events: none;

  button {
    pointer-events: auto;
  }

  ${(p) => p.trainerBarVisible &&
    `
    top: ${Number(p.theme.trainerHeight) + Number(p.theme.mapNavigationTop)}px;
  `}
`;
const ControlWrapper = styled(Box) `
  @media (min-width: ${(props) => props.theme.sm}px) {
    & > :first-child {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
  }
`;
var Orientation;
(function (Orientation) {
    Orientation[Orientation["HORIZONTAL"] = 0] = "HORIZONTAL";
    Orientation[Orientation["VERTICAL"] = 1] = "VERTICAL";
})(Orientation || (Orientation = {}));
let MapNavigation = class MapNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.navigationRef = React.createRef();
        registerMapNavigations(props.viewState);
        this.viewState = props.viewState;
        this.model = props.viewState.terria.mapNavigationModel;
        this.resizeListener = debounce(() => this.updateNavigation(), 250);
        this.itemSizeInBar = new Map();
        this.computeSizes();
        this.overflows = runInAction(() => this.model.visibleItems.some((item) => item.controller.collapsed));
        this.viewerModeReactionDisposer = reaction(() => this.viewState.terria.currentViewer, () => this.updateNavigation(), {
            equals: (a, b) => {
                return a === b;
            }
        });
    }
    componentDidMount() {
        this.computeSizes();
        this.updateNavigation();
        window.addEventListener("resize", this.resizeListener, false);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeListener);
        if (this.viewerModeReactionDisposer) {
            this.viewerModeReactionDisposer();
        }
    }
    get orientation() {
        return this.viewState.useSmallScreenInterface
            ? Orientation.HORIZONTAL
            : Orientation.VERTICAL;
    }
    computeSizes(items) {
        (items !== null && items !== void 0 ? items : this.model.visibleItems).forEach((item) => {
            if (this.orientation === Orientation.VERTICAL) {
                if (item.controller.height && item.controller.height > 0) {
                    this.itemSizeInBar.set(item.id, item.controller.height || 42);
                }
            }
            else {
                if (item.controller.width && item.controller.width > 0) {
                    this.itemSizeInBar.set(item.id, item.controller.width || 42);
                }
            }
        });
    }
    /**
     * Check if we need to collapse navigation items and determine which one need to be collapsed.
     */
    updateNavigation() {
        var _a, _b, _c;
        if (!this.navigationRef.current) {
            // navigation bar has not been rendered yet so there is nothing to update.
            return;
        }
        if (this.computeSizes.length !== this.model.visibleItems.length) {
            this.computeSizes();
        }
        let itemsToShow = this.model.visibleItems.filter((item) => filterViewerAndScreenSize(item, this.viewState));
        // items we have to show in the navigation bar
        let pinnedItems = this.model.pinnedItems.filter((item) => filterViewerAndScreenSize(item, this.viewState));
        // items that are possible to be collapsed
        let possibleToCollapse = itemsToShow
            .filter((item) => !pinnedItems.some((pinnedItem) => pinnedItem.id === item.id))
            .reverse();
        // Ensure we are not showing more composites than we have height for
        let overflows = false;
        let maxVisible = itemsToShow.length;
        let size = 0;
        if (this.overflows) {
            size += OVERFLOW_ACTION_SIZE;
        }
        const limit = this.orientation === Orientation.VERTICAL
            ? this.navigationRef.current.clientHeight
            : ((_a = this.navigationRef.current.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) ? ((_c = (_b = this.navigationRef.current.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.clientWidth) -
                100
                : this.navigationRef.current.clientWidth;
        for (let i = 0; i < itemsToShow.length; i++) {
            size += this.itemSizeInBar.get(itemsToShow[i].id) || 0;
            if (size <= limit) {
                maxVisible = i + 1;
            }
        }
        if (pinnedItems.length > maxVisible) {
            possibleToCollapse.forEach((item) => {
                this.model.setCollapsed(item.id, true);
            });
            //there is nothing else we can do, we have to show the rest of items as it is.
            return;
        }
        overflows = itemsToShow.length > maxVisible;
        const itemsToCollapseId = [];
        const activeCollapsible = [];
        if (overflows) {
            if (!this.overflows) {
                // overflow is not currently visible so add its height here
                size += OVERFLOW_ACTION_SIZE;
                this.overflows = true;
            }
            maxVisible = maxVisible - pinnedItems.length;
            // first try to collapse inactive items and then active ones if needed
            for (let i = 0; i < possibleToCollapse.length; i++) {
                const item = possibleToCollapse[i];
                if (item.controller.active) {
                    activeCollapsible.push(item.id);
                    continue;
                }
                itemsToCollapseId.push(item.id);
                size -= this.itemSizeInBar.get(item.id) || 0;
                if (size <= limit) {
                    break;
                }
            }
            if (size > limit) {
                for (let i = 0; i < activeCollapsible.length; i++) {
                    const itemId = activeCollapsible[i];
                    itemsToCollapseId.push(itemId);
                    size -= this.itemSizeInBar.get(itemId) || 0;
                    if (size <= limit) {
                        break;
                    }
                }
            }
        }
        else {
            this.overflows = false;
        }
        this.model.visibleItems.forEach((item) => {
            if (itemsToCollapseId.includes(item.id)) {
                this.model.setCollapsed(item.id, true);
            }
            else {
                this.model.setCollapsed(item.id, false);
            }
        });
    }
    render() {
        const { viewState, t } = this.props;
        const terria = viewState.terria;
        let items = terria.mapNavigationModel.visibleItems.filter((item) => !item.controller.collapsed &&
            filterViewerAndScreenSize(item, this.viewState));
        let bottomItems;
        if (!this.overflows && this.orientation !== Orientation.HORIZONTAL) {
            bottomItems = items.filter((item) => item.location === "BOTTOM");
            items = items.filter((item) => item.location === "TOP");
        }
        return (React.createElement(StyledMapNavigation, { trainerBarVisible: viewState.trainerBarVisible },
            React.createElement(Box, { centered: true, column: true, justifySpaceBetween: true, fullHeight: true, alignItemsFlexEnd: true, ref: this.navigationRef },
                React.createElement(ControlWrapper, { column: this.orientation === Orientation.VERTICAL, css: `
              ${this.orientation === Orientation.HORIZONTAL &&
                        `margin-bottom: 5px;
                flex-wrap: wrap;`}
            ` },
                    items.map((item) => {
                        // Do not expand in place for horizontal orientation
                        // as it results in buttons overlapping and hiding neighboring buttons.
                        return (React.createElement(MapNavigationItem, { expandInPlace: this.orientation !== Orientation.HORIZONTAL, key: item.id, item: item, terria: terria }));
                    }),
                    this.overflows && (React.createElement(Control, { key: OVERFLOW_ITEM_ID },
                        React.createElement(MapIconButton, { expandInPlace: true, iconElement: () => React.createElement(Icon, { glyph: GLYPHS.moreItems }), title: t("mapNavigation.additionalToolsTitle"), onClick: () => runInAction(() => {
                                viewState.showCollapsedNavigation = true;
                            }) }, t("mapNavigation.additionalTools"))))),
                React.createElement(ControlWrapper, { column: this.orientation === Orientation.VERTICAL }, bottomItems === null || bottomItems === void 0 ? void 0 : bottomItems.map((item) => (React.createElement(MapNavigationItem, { key: item.id, item: item, terria: terria })))))));
    }
};
MapNavigation.displayName = "MapNavigation";
__decorate([
    observable
], MapNavigation.prototype, "model", void 0);
__decorate([
    observable
], MapNavigation.prototype, "overflows", void 0);
__decorate([
    computed
], MapNavigation.prototype, "orientation", null);
__decorate([
    action
], MapNavigation.prototype, "computeSizes", null);
__decorate([
    action
], MapNavigation.prototype, "updateNavigation", null);
MapNavigation = __decorate([
    observer
], MapNavigation);
export default withTranslation()(withTheme(withControlledVisibility(MapNavigation)));
export function filterViewerAndScreenSize(item, viewState) {
    var _a;
    const currentViewer = viewState.terria.mainViewer.viewerMode;
    const screenSize = (_a = item.screenSize) !== null && _a !== void 0 ? _a : "any";
    if (viewState.useSmallScreenInterface) {
        return ((!isDefined(item.controller.viewerMode) ||
            item.controller.viewerMode === currentViewer) &&
            (screenSize === "any" || item.screenSize === "small"));
    }
    else {
        return ((!isDefined(item.controller.viewerMode) ||
            item.controller.viewerMode === currentViewer) &&
            (screenSize === "any" || item.screenSize === "medium"));
    }
}
//# sourceMappingURL=MapNavigation.js.map