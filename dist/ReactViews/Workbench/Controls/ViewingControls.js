var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { sortBy, uniqBy } from "lodash";
import { action, computed, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import defined from "terriajs-cesium/Source/Core/defined";
import SplitDirection from "terriajs-cesium/Source/Scene/SplitDirection";
import { Category, DataSourceAction } from "../../../Core/AnalyticEvents/analyticEvents";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import getDereferencedIfExists from "../../../Core/getDereferencedIfExists";
import getPath from "../../../Core/getPath";
import isDefined from "../../../Core/isDefined";
import TerriaError from "../../../Core/TerriaError";
import CatalogMemberMixin, { getName } from "../../../ModelMixins/CatalogMemberMixin";
import DiffableMixin from "../../../ModelMixins/DiffableMixin";
import ExportableMixin from "../../../ModelMixins/ExportableMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import SearchableItemMixin from "../../../ModelMixins/SearchableItemMixin";
import TimeVarying from "../../../ModelMixins/TimeVarying";
import CameraView from "../../../Models/CameraView";
import addUserCatalogMember from "../../../Models/Catalog/addUserCatalogMember";
import SplitItemReference from "../../../Models/Catalog/CatalogReferences/SplitItemReference";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import hasTraits from "../../../Models/Definition/hasTraits";
import getAncestors from "../../../Models/getAncestors";
import AnimatedSpinnerIcon from "../../../Styled/AnimatedSpinnerIcon";
import Box from "../../../Styled/Box";
import { RawButton } from "../../../Styled/Button";
import Icon, { StyledIcon } from "../../../Styled/Icon";
import Ul from "../../../Styled/List";
import SplitterTraits from "../../../Traits/TraitsClasses/SplitterTraits";
import { exportData } from "../../Preview/ExportData";
import LazyItemSearchTool from "../../Tools/ItemSearchTool/LazyItemSearchTool";
import WorkbenchButton from "../WorkbenchButton";
const BoxViewingControl = styled(Box).attrs({
    centered: true,
    left: true,
    justifySpaceBetween: true
}) ``;
const ViewingControlMenuButton = styled(RawButton).attrs({
// primaryHover: true
}) `
  color: ${(props) => props.theme.textDarker};
  background-color: ${(props) => props.theme.textLight};

  ${StyledIcon} {
    width: 35px;
  }

  svg {
    fill: ${(props) => props.theme.textDarker};
    width: 18px;
    height: 18px;
  }
  & > span {
    // position: absolute;
    // left: 37px;
  }

  border-radius: 0;

  width: 114px;
  // ensure we support long strings
  min-height: 32px;
  display: block;

  &:hover,
  &:focus {
    color: ${(props) => props.theme.textLight};
    background-color: ${(props) => props.theme.colorPrimary};
    svg {
      fill: ${(props) => props.theme.textLight};
    }
  }
`;
let ViewingControls = class ViewingControls extends React.Component {
    constructor(props) {
        // Required step: always call the parent class' constructor
        super(props);
        // Set the state directly. Use props if necessary.
        this.state = {
            isMapZoomingToCatalogItem: false
        };
    }
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
        window.addEventListener("click", this.hideMenu.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener("click", this.hideMenu.bind(this));
    }
    hideMenu() {
        runInAction(() => {
            this.props.viewState.workbenchItemWithOpenControls = undefined;
        });
    }
    removeFromMap() {
        var _a;
        const terria = this.props.viewState.terria;
        terria.workbench.remove(this.props.item);
        terria.removeSelectedFeaturesForModel(this.props.item);
        if (TimeVarying.is(this.props.item))
            this.props.viewState.terria.timelineStack.remove(this.props.item);
        (_a = this.props.viewState.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.dataSource, DataSourceAction.removeFromWorkbench, getPath(this.props.item));
    }
    zoomTo() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const viewer = this.props.viewState.terria.currentViewer;
        const item = this.props.item;
        if (!MappableMixin.isMixedInto(item))
            return;
        let zoomToView = item;
        function vectorToJson(vector) {
            if (typeof (vector === null || vector === void 0 ? void 0 : vector.x) === "number" &&
                typeof (vector === null || vector === void 0 ? void 0 : vector.y) === "number" &&
                typeof (vector === null || vector === void 0 ? void 0 : vector.z) === "number") {
                return {
                    x: vector.x,
                    y: vector.y,
                    z: vector.z
                };
            }
            else {
                return undefined;
            }
        }
        // camera is likely used more often than lookAt.
        const theWest = (_b = (_a = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _a === void 0 ? void 0 : _a.camera) === null || _b === void 0 ? void 0 : _b.west;
        const theEast = (_d = (_c = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _c === void 0 ? void 0 : _c.camera) === null || _d === void 0 ? void 0 : _d.east;
        const theNorth = (_f = (_e = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _e === void 0 ? void 0 : _e.camera) === null || _f === void 0 ? void 0 : _f.north;
        const theSouth = (_h = (_g = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _g === void 0 ? void 0 : _g.camera) === null || _h === void 0 ? void 0 : _h.south;
        if (isDefined((_k = (_j = item.idealZoom) === null || _j === void 0 ? void 0 : _j.lookAt) === null || _k === void 0 ? void 0 : _k.targetLongitude) &&
            isDefined((_m = (_l = item.idealZoom) === null || _l === void 0 ? void 0 : _l.lookAt) === null || _m === void 0 ? void 0 : _m.targetLatitude) &&
            ((_q = (_p = (_o = item.idealZoom) === null || _o === void 0 ? void 0 : _o.lookAt) === null || _p === void 0 ? void 0 : _p.range) !== null && _q !== void 0 ? _q : 0) >= 0) {
            // No value checking here. Improper values can lead to unexpected results.
            const lookAt = {
                targetLongitude: item.idealZoom.lookAt.targetLongitude,
                targetLatitude: item.idealZoom.lookAt.targetLatitude,
                targetHeight: item.idealZoom.lookAt.targetHeight,
                heading: item.idealZoom.lookAt.heading,
                pitch: item.idealZoom.lookAt.pitch,
                range: item.idealZoom.lookAt.range
            };
            // In the case of 2D viewer, it zooms to rectangle area approximated by the camera view parameters.
            zoomToView = CameraView.fromJson({ lookAt: lookAt });
        }
        else if (theWest && theEast && theNorth && theSouth) {
            const thePosition = vectorToJson((_s = (_r = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _r === void 0 ? void 0 : _r.camera) === null || _s === void 0 ? void 0 : _s.position);
            const theDirection = vectorToJson((_u = (_t = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _t === void 0 ? void 0 : _t.camera) === null || _u === void 0 ? void 0 : _u.direction);
            const theUp = vectorToJson((_w = (_v = item === null || item === void 0 ? void 0 : item.idealZoom) === null || _v === void 0 ? void 0 : _v.camera) === null || _w === void 0 ? void 0 : _w.up);
            // No value checking here. Improper values can lead to unexpected results.
            const camera = {
                west: theWest,
                east: theEast,
                north: theNorth,
                south: theSouth,
                position: thePosition,
                direction: theDirection,
                up: theUp
            };
            zoomToView = CameraView.fromJson(camera);
        }
        else if (((_x = item.rectangle) === null || _x === void 0 ? void 0 : _x.east) !== undefined &&
            ((_y = item.rectangle) === null || _y === void 0 ? void 0 : _y.west) !== undefined &&
            item.rectangle.east - item.rectangle.west >= 360) {
            zoomToView = this.props.viewState.terria.mainViewer.homeCamera;
            console.log("Extent is wider than world so using homeCamera.");
        }
        this.setState({ isMapZoomingToCatalogItem: true });
        viewer.zoomTo(zoomToView).finally(() => {
            this.setState({ isMapZoomingToCatalogItem: false });
        });
    }
    splitItem() {
        const { t } = this.props;
        const item = this.props.item;
        const terria = item.terria;
        const splitRef = new SplitItemReference(createGuid(), terria);
        runInAction(async () => {
            if (!hasTraits(item, SplitterTraits, "splitDirection"))
                return;
            if (item.splitDirection === SplitDirection.NONE) {
                item.setTrait(CommonStrata.user, "splitDirection", SplitDirection.RIGHT);
            }
            splitRef.setTrait(CommonStrata.user, "splitSourceItemId", item.uniqueId);
            terria.addModel(splitRef);
            terria.showSplitter = true;
            await splitRef.loadReference();
            runInAction(() => {
                const target = splitRef.target;
                if (target) {
                    target.setTrait(CommonStrata.user, "name", t("splitterTool.workbench.copyName", {
                        name: getName(item)
                    }));
                    // Set a direction opposite to the original item
                    target.setTrait(CommonStrata.user, "splitDirection", item.splitDirection === SplitDirection.LEFT
                        ? SplitDirection.RIGHT
                        : SplitDirection.LEFT);
                }
            });
            // Add it to terria.catalog, which is required so the new item can be shared.
            addUserCatalogMember(terria, splitRef, {
                open: false
            });
        });
    }
    openDiffTool() {
        this.props.viewState.openTool({
            toolName: "Difference",
            getToolComponent: () => import("../../Tools/DiffTool/DiffTool").then((m) => m.default),
            showCloseButton: true,
            params: {
                sourceItem: this.props.item
            }
        });
    }
    searchItem() {
        runInAction(() => {
            const { item, viewState } = this.props;
            if (!SearchableItemMixin.isMixedInto(item))
                return;
            let itemSearchProvider;
            try {
                itemSearchProvider = item.createItemSearchProvider();
            }
            catch (error) {
                viewState.terria.raiseErrorToUser(error);
                return;
            }
            this.props.viewState.openTool({
                toolName: "Search Item",
                getToolComponent: () => LazyItemSearchTool,
                showCloseButton: false,
                params: {
                    item,
                    itemSearchProvider,
                    viewState
                }
            });
        });
    }
    async previewItem() {
        let item = this.props.item;
        // Open up all the parents (doesn't matter that this sets it to enabled as well because it already is).
        getAncestors(this.props.item)
            .map((item) => getDereferencedIfExists(item))
            .forEach((group) => {
            runInAction(() => {
                group.setTrait(CommonStrata.user, "isOpen", true);
            });
        });
        this.props.viewState
            .viewCatalogMember(item)
            .then((result) => result.raiseError(this.props.viewState.terria));
    }
    exportDataClicked() {
        const item = this.props.item;
        if (!ExportableMixin.isMixedInto(item))
            return;
        exportData(item).catch((e) => {
            this.props.item.terria.raiseErrorToUser(e);
        });
    }
    /**
     * Return a list of viewing controls collated from global and item specific settings.
     */
    get viewingControls() {
        const item = this.props.item;
        const viewState = this.props.viewState;
        if (!CatalogMemberMixin.isMixedInto(item)) {
            return [];
        }
        // Global viewing controls (usually defined by plugins).
        const globalViewingControls = filterOutUndefined(viewState.globalViewingControlOptions.map((generateViewingControlForItem) => {
            try {
                return generateViewingControlForItem(item);
            }
            catch (err) {
                TerriaError.from(err).log();
                return undefined;
            }
        }));
        // Item specific viewing controls
        const itemViewingControls = item.viewingControls;
        // Collate list, unique by id and sorted by name
        const viewingControls = sortBy(uniqBy([...itemViewingControls, ...globalViewingControls], "id"), "name");
        return viewingControls;
    }
    renderViewingControlsMenu() {
        const { t, item, viewState } = this.props;
        const canSplit = !item.terria.configParameters.disableSplitter &&
            hasTraits(item, SplitterTraits, "splitDirection") &&
            hasTraits(item, SplitterTraits, "disableSplitter") &&
            !item.disableSplitter &&
            defined(item.splitDirection) &&
            item.terria.currentViewer.canShowSplitter;
        const handleOnClick = (viewingControl) => {
            try {
                viewingControl.onClick(this.props.viewState);
            }
            catch (err) {
                viewState.terria.raiseErrorToUser(TerriaError.from(err));
            }
        };
        return (React.createElement("ul", null,
            this.viewingControls.map((viewingControl) => (React.createElement("li", { key: viewingControl.id },
                React.createElement(ViewingControlMenuButton, { onClick: () => handleOnClick(viewingControl), title: viewingControl.iconTitle },
                    React.createElement(BoxViewingControl, null,
                        React.createElement(StyledIcon, Object.assign({}, viewingControl.icon)),
                        React.createElement("span", null, viewingControl.name)))))),
            canSplit ? (React.createElement("li", { key: "workbench.splitItem" },
                React.createElement(ViewingControlMenuButton, { onClick: this.splitItem.bind(this), title: t("workbench.splitItemTitle") },
                    React.createElement(BoxViewingControl, null,
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.compare }),
                        React.createElement("span", null, t("workbench.splitItem")))))) : null,
            viewState.useSmallScreenInterface === false &&
                DiffableMixin.isMixedInto(item) &&
                !item.isShowingDiff &&
                item.canDiffImages ? (React.createElement("li", { key: "workbench.diffImage" },
                React.createElement(ViewingControlMenuButton, { onClick: this.openDiffTool.bind(this), title: t("workbench.diffImageTitle") },
                    React.createElement(BoxViewingControl, null,
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.difference }),
                        React.createElement("span", null, t("workbench.diffImage")))))) : null,
            viewState.useSmallScreenInterface === false &&
                ExportableMixin.isMixedInto(item) &&
                item.canExportData ? (React.createElement("li", { key: "workbench.exportData" },
                React.createElement(ViewingControlMenuButton, { onClick: this.exportDataClicked.bind(this), title: t("workbench.exportDataTitle") },
                    React.createElement(BoxViewingControl, null,
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.upload }),
                        React.createElement("span", null, t("workbench.exportData")))))) : null,
            viewState.useSmallScreenInterface === false &&
                SearchableItemMixin.isMixedInto(item) &&
                item.canSearch ? (React.createElement("li", { key: "workbench.searchItem" },
                React.createElement(ViewingControlMenuButton, { onClick: this.searchItem.bind(this), title: t("workbench.searchItemTitle") },
                    React.createElement(BoxViewingControl, null,
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.search }),
                        React.createElement("span", null, t("workbench.searchItem")))))) : null,
            React.createElement("li", { key: "workbench.removeFromMap" },
                React.createElement(ViewingControlMenuButton, { onClick: this.removeFromMap.bind(this), title: t("workbench.removeFromMapTitle") },
                    React.createElement(BoxViewingControl, null,
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.cancel }),
                        React.createElement("span", null, t("workbench.removeFromMap")))))));
    }
    render() {
        const viewState = this.props.viewState;
        const item = this.props.item;
        const { t } = this.props;
        const showMenu = item.uniqueId === viewState.workbenchItemWithOpenControls;
        return (React.createElement(Box, null,
            React.createElement(Ul, { css: `
            list-style: none;
            padding-left: 0;
            margin: 0;
            width: 100%;
            position: relative;
            display: flex;
            justify-content: space-between;

            li {
              display: block;
              float: left;
              box-sizing: border-box;
            }
            & > button:last-child {
              margin-right: 0;
            }
          `, gap: 2 },
                React.createElement(WorkbenchButton, { onClick: this.zoomTo.bind(this), title: t("workbench.zoomToTitle"), disabled: 
                    // disabled if the item cannot be zoomed to or if a zoom is already in progress
                    (MappableMixin.isMixedInto(item) && item.disableZoomTo) ||
                        this.state.isMapZoomingToCatalogItem === true, iconElement: () => this.state.isMapZoomingToCatalogItem ? (React.createElement(AnimatedSpinnerIcon, null)) : (React.createElement(Icon, { glyph: Icon.GLYPHS.search })) }, t("workbench.zoomTo")),
                React.createElement(WorkbenchButton, { onClick: this.previewItem.bind(this), title: t("workbench.previewItemTitle"), iconElement: () => React.createElement(Icon, { glyph: Icon.GLYPHS.about }), disabled: CatalogMemberMixin.isMixedInto(item) && item.disableAboutData }, t("workbench.previewItem")),
                React.createElement(WorkbenchButton, { css: "flex-grow:0;", onClick: (e) => {
                        e.stopPropagation();
                        runInAction(() => {
                            if (viewState.workbenchItemWithOpenControls === item.uniqueId) {
                                viewState.workbenchItemWithOpenControls = undefined;
                            }
                            else {
                                viewState.workbenchItemWithOpenControls = item.uniqueId;
                            }
                        });
                    }, title: t("workbench.showMoreActionsTitle"), iconOnly: true, iconElement: () => React.createElement(Icon, { glyph: Icon.GLYPHS.menuDotted }) })),
            showMenu && (React.createElement(Box, { css: `
              position: absolute;
              z-index: 100;
              right: 0;
              top: 0;
              top: 32px;
              top: 42px;

              padding: 0;
              margin: 0;

              ul {
                list-style: none;
              }
            ` }, this.renderViewingControlsMenu()))));
    }
};
__decorate([
    action
], ViewingControls.prototype, "zoomTo", null);
__decorate([
    computed
], ViewingControls.prototype, "viewingControls", null);
ViewingControls = __decorate([
    observer
], ViewingControls);
export default withTranslation()(ViewingControls);
//# sourceMappingURL=ViewingControls.js.map