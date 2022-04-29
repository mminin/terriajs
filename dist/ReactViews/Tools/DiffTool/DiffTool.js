var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import hoistStatics from "hoist-non-react-statics";
import { action, computed, observable, reaction, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { withTranslation } from "react-i18next";
import styled, { useTheme, withTheme } from "styled-components";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import ImagerySplitDirection from "terriajs-cesium/Source/Scene/ImagerySplitDirection";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import prettifyCoordinates from "../../../Map/prettifyCoordinates";
import DiffableMixin from "../../../ModelMixins/DiffableMixin";
import MappableMixin, { ImageryParts } from "../../../ModelMixins/MappableMixin";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import hasTraits from "../../../Models/Definition/hasTraits";
import { getMarkerLocation, removeMarker } from "../../../Models/LocationMarkerUtils";
import SplitItemReference from "../../../Models/Catalog/CatalogReferences/SplitItemReference";
import Box, { BoxSpan } from "../../../Styled/Box";
import Button, { RawButton } from "../../../Styled/Button";
import Select from "../../../Styled/Select";
import Spacing from "../../../Styled/Spacing";
import Text, { TextSpan } from "../../../Styled/Text";
import RasterLayerTraits from "../../../Traits/TraitsClasses/RasterLayerTraits";
import { parseCustomMarkdownToReactWithOptions } from "../../Custom/parseCustomMarkdownToReact";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
import Loader from "../../Loader";
import DatePicker from "./DatePicker";
import LocationPicker from "./LocationPicker";
import { CLOSE_TOOL_ID } from "../../Map/Navigation/registerMapNavigations";
const dateFormat = require("dateformat");
let DiffTool = class DiffTool extends React.Component {
    get sourceItem() {
        return this.userSelectedSourceItem || this.props.sourceItem;
    }
    changeSourceItem(sourceItem) {
        this.userSelectedSourceItem = sourceItem;
    }
    async createSplitterItems() {
        try {
            const [leftItem, rightItem] = await Promise.all([
                createSplitItem(this.sourceItem, ImagerySplitDirection.LEFT),
                createSplitItem(this.sourceItem, ImagerySplitDirection.RIGHT)
            ]);
            runInAction(() => {
                this.leftItem = leftItem;
                this.rightItem = rightItem;
            });
        }
        catch { }
    }
    removeSplitterItems() {
        this.leftItem && removeSplitItem(this.leftItem);
        this.rightItem && removeSplitItem(this.rightItem);
    }
    enterDiffTool() {
        // Start the reaction that splits the sourceItem into left & right items
        this.splitterItemsDisposer = reaction(() => this.sourceItem, () => {
            this.removeSplitterItems();
            this.createSplitterItems();
        }, { fireImmediately: true });
        const viewState = this.props.viewState;
        const terria = viewState.terria;
        this.originalSettings = {
            showSplitter: terria.showSplitter,
            isMapFullScreen: viewState.isMapFullScreen
        };
        terria.showSplitter = true;
        viewState.setIsMapFullScreen(true);
        this.sourceItem.setTrait(CommonStrata.user, "show", false);
        terria.mapNavigationModel.show(CLOSE_TOOL_ID);
        const closeTool = terria.mapNavigationModel.findItem(CLOSE_TOOL_ID);
        if (closeTool) {
            closeTool.controller.activate();
        }
    }
    leaveDiffTool() {
        var _a;
        const viewState = this.props.viewState;
        const terria = viewState.terria;
        const originalSettings = this.originalSettings;
        this.removeSplitterItems();
        (_a = this.splitterItemsDisposer) === null || _a === void 0 ? void 0 : _a.call(this);
        terria.showSplitter = originalSettings.showSplitter;
        viewState.setIsMapFullScreen(originalSettings.isMapFullScreen);
        this.sourceItem.setTrait(CommonStrata.user, "show", true);
        terria.mapNavigationModel.hide(CLOSE_TOOL_ID);
        const closeTool = terria.mapNavigationModel.findItem(CLOSE_TOOL_ID);
        if (closeTool) {
            closeTool.controller.deactivate();
        }
    }
    componentDidMount() {
        this.enterDiffTool();
    }
    componentWillUnmount() {
        this.leaveDiffTool();
    }
    render() {
        if (this.leftItem && this.rightItem) {
            return (React.createElement(Main, Object.assign({}, this.props, { theme: this.props.theme, terria: this.props.viewState.terria, sourceItem: this.sourceItem, changeSourceItem: this.changeSourceItem, leftItem: this.leftItem, rightItem: this.rightItem })));
        }
        else
            return null;
    }
};
DiffTool.toolName = "Image Difference";
__decorate([
    observable
], DiffTool.prototype, "leftItem", void 0);
__decorate([
    observable
], DiffTool.prototype, "rightItem", void 0);
__decorate([
    observable
], DiffTool.prototype, "userSelectedSourceItem", void 0);
__decorate([
    computed
], DiffTool.prototype, "sourceItem", null);
__decorate([
    action.bound
], DiffTool.prototype, "changeSourceItem", null);
__decorate([
    action
], DiffTool.prototype, "createSplitterItems", null);
__decorate([
    action
], DiffTool.prototype, "removeSplitterItems", null);
__decorate([
    action
], DiffTool.prototype, "enterDiffTool", null);
__decorate([
    action
], DiffTool.prototype, "leaveDiffTool", null);
DiffTool = __decorate([
    observer
], DiffTool);
let Main = class Main extends React.Component {
    constructor(props) {
        super(props);
        this._locationPickError = false;
        this._isPickingNewLocation = false;
        this.openLeftDatePickerButton = React.createRef();
        this.openRightDatePickerButton = React.createRef();
    }
    get locationPickerMessages() {
        const t = this.props.t;
        if (this._locationPickError) {
            return {
                title: t("diffTool.locationPicker.errorMessages.title"),
                beforePick: t("diffTool.locationPicker.errorMessages.beforePick"),
                afterPick: t("diffTool.locationPicker.errorMessages.afterPick")
            };
        }
        else if (this.location) {
            return {
                title: t("diffTool.locationPicker.nextMessages.title", prettifyCoordinates(this.location.longitude, this.location.latitude, {
                    digits: 2
                })),
                beforePick: t("diffTool.locationPicker.nextMessages.beforePick"),
                afterPick: t("diffTool.locationPicker.nextMessages.afterPick")
            };
        }
        else {
            return {
                title: t("diffTool.locationPicker.initialMessages.title"),
                beforePick: t("diffTool.locationPicker.initialMessages.beforePick"),
                afterPick: t("diffTool.locationPicker.initialMessages.afterPick")
            };
        }
    }
    get diffItem() {
        return this.props.leftItem;
    }
    get diffItemName() {
        const name = this.props.sourceItem.name || "";
        const firstDate = this.leftDate;
        const secondDate = this.rightDate;
        const format = "yyyy/mm/dd";
        if (!firstDate || !secondDate) {
            return name;
        }
        else {
            const d1 = dateFormat(firstDate, format);
            const d2 = dateFormat(secondDate, format);
            return `${name} - difference for dates ${d1}, ${d2}`;
        }
    }
    get diffableItemsInWorkbench() {
        return this.props.terria.workbench.items.filter(item => DiffableMixin.isMixedInto(item) && item.canDiffImages);
    }
    get previewStyle() {
        var _a, _b;
        return (_b = (_a = this.diffItem.styleSelectableDimensions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.selectedId;
    }
    get diffStyle() {
        return this.diffItem.diffStyleId;
    }
    get availableDiffStyles() {
        return filterOutUndefined(this.diffItem.availableDiffStyles.map(diffStyleId => { var _a, _b, _c; return (_c = (_b = (_a = this.diffItem.styleSelectableDimensions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.find(style => style.id === diffStyleId); }));
    }
    get leftDate() {
        return this.props.leftItem.currentDiscreteJulianDate;
    }
    get rightDate() {
        return this.props.rightItem.currentDiscreteJulianDate;
    }
    get diffLegendUrl() {
        return (this.diffStyle &&
            this.leftDate &&
            this.rightDate &&
            this.diffItem.getLegendUrlForStyle(this.diffStyle, this.leftDate, this.rightDate));
    }
    get previewLegendUrl() {
        return (this.previewStyle && this.diffItem.getLegendUrlForStyle(this.previewStyle));
    }
    showItem(model) {
        // We change the opacity instead of setting `show` to true/false, because
        // we want the item to be on the map for date selection to work
        hasOpacity(model) && model.setTrait(CommonStrata.user, "opacity", 0.8);
    }
    hideItem(model) {
        // We change the opacity instead of setting `show` to true/false, because
        // we want the item to be on the map for date selection to work
        hasOpacity(model) && model.setTrait(CommonStrata.user, "opacity", 0);
    }
    changeSourceItem(e) {
        const newSourceItem = this.diffableItemsInWorkbench.find(item => item.uniqueId === e.target.value);
        if (newSourceItem)
            this.props.changeSourceItem(newSourceItem);
    }
    changePreviewStyle(e) {
        var _a, _b, _c, _d;
        const styleId = e.target.value;
        (_b = (_a = this.props.leftItem.styleSelectableDimensions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.setDimensionValue(CommonStrata.user, styleId);
        (_d = (_c = this.props.rightItem.styleSelectableDimensions) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.setDimensionValue(CommonStrata.user, styleId);
    }
    changeDiffStyle(e) {
        this.diffItem.setTrait(CommonStrata.user, "diffStyleId", e.target.value);
    }
    onUserPickingLocation(pickingLocation) {
        this._isPickingNewLocation = true;
    }
    onUserPickLocation(pickedFeatures, pickedLocation) {
        const { leftItem, rightItem, t } = this.props;
        const feature = pickedFeatures.features.find(f => doesFeatureBelongToItem(f, leftItem) ||
            doesFeatureBelongToItem(f, rightItem));
        if (feature) {
            leftItem.setTimeFilterFeature(feature, pickedFeatures.providerCoords);
            rightItem.setTimeFilterFeature(feature, pickedFeatures.providerCoords);
            this.location = pickedLocation;
            this._locationPickError = false;
        }
        else {
            this._locationPickError = true;
        }
        this._isPickingNewLocation = false;
    }
    unsetDates() {
        const { leftItem, rightItem } = this.props;
        leftItem.setTrait(CommonStrata.user, "currentTime", null);
        rightItem.setTrait(CommonStrata.user, "currentTime", null);
        this.hideItem(leftItem);
        this.hideItem(rightItem);
    }
    generateDiff() {
        if (this.leftDate === undefined ||
            this.rightDate === undefined ||
            this.diffStyle === undefined) {
            return;
        }
        const terria = this.props.terria;
        terria.overlays.remove(this.props.leftItem);
        terria.overlays.remove(this.props.rightItem);
        terria.workbench.add(this.diffItem);
        this.diffItem.setTrait(CommonStrata.user, "name", this.diffItemName);
        this.diffItem.showDiffImage(this.leftDate, this.rightDate, this.diffStyle);
        terria.showSplitter = false;
    }
    resetTool() {
        const terria = this.props.terria;
        this.diffItem.clearDiffImage();
        setDefaultDiffStyle(this.diffItem);
        terria.overlays.add(this.props.leftItem);
        terria.overlays.add(this.props.rightItem);
        terria.workbench.remove(this.diffItem);
        this.props.terria.showSplitter = true;
        this.props.leftItem.setTrait(CommonStrata.user, "splitDirection", ImagerySplitDirection.LEFT);
        this.props.rightItem.setTrait(CommonStrata.user, "splitDirection", ImagerySplitDirection.RIGHT);
    }
    async setLocationFromActiveSearch() {
        // Look for any existing marker like from a search result and filter
        // imagery at that location
        const markerLocation = getMarkerLocation(this.props.terria);
        const sourceItem = this.props.sourceItem;
        if (markerLocation && MappableMixin.isMixedInto(sourceItem)) {
            const part = sourceItem.mapItems.find(p => ImageryParts.is(p));
            const imageryProvider = part && ImageryParts.is(part) && part.imageryProvider;
            if (imageryProvider) {
                const promises = [
                    setTimeFilterFromLocation(this.props.leftItem, markerLocation, imageryProvider),
                    setTimeFilterFromLocation(this.props.rightItem, markerLocation, imageryProvider)
                ];
                const someSuccessful = (await Promise.all(promises)).some(ok => ok);
                if (someSuccessful) {
                    runInAction(() => (this.location = markerLocation));
                }
                else {
                    // If we cannot resolve imagery at the marker location, remove it
                    removeMarker(this.props.terria);
                }
            }
        }
    }
    async componentDidMount() {
        if (this.location === undefined) {
            const { latitude, longitude, height } = this.diffItem.timeFilterCoordinates;
            if (latitude !== undefined && longitude !== undefined) {
                this.location = {
                    latitude,
                    longitude,
                    height
                };
                // remove any active search location marker to avoid showing two markers
                removeMarker(this.props.terria);
            }
            else {
                await this.setLocationFromActiveSearch();
            }
        }
    }
    // i want to restructure the render so that there's 2 distinct "showing diff"
    // or not states, right now intertwining them means way too many conditionals
    // that confuse the required spacing etc.
    render() {
        var _a, _b, _c;
        const { terria, viewState, sourceItem, t, theme } = this.props;
        const isShowingDiff = this.diffItem.isShowingDiff;
        const datesSelected = this.leftDate && this.rightDate;
        const isReadyToGenerateDiff = this.location && datesSelected && this.diffStyle !== undefined;
        return (React.createElement(Text, { large: true },
            React.createElement(DiffAccordion, { viewState: viewState, t: t },
                React.createElement(MainPanel, { isMapFullScreen: viewState.isMapFullScreen, styledMaxHeight: `calc(100vh - ${viewState.bottomDockHeight}px - 150px)` },
                    isShowingDiff && (React.createElement(React.Fragment, null,
                        React.createElement(Box, { centered: true, left: true },
                            React.createElement(BackButton, { css: `
                      color: ${theme.textLight};
                      border-color: ${theme.textLight};
                    `, transparentBg: true, onClick: this.resetTool },
                                React.createElement(BoxSpan, { centered: true },
                                    React.createElement(StyledIcon, { css: "transform:rotate(90deg);", light: true, styledWidth: "16px", glyph: GLYPHS.arrowDown }),
                                    React.createElement(TextSpan, { noFontSize: true }, t("general.back"))))),
                        React.createElement(Spacing, { bottom: 3 }),
                        React.createElement(Text, { medium: true, textLight: true }, t("diffTool.differenceResultsTitle")),
                        React.createElement(Spacing, { bottom: 2 }))),
                    React.createElement(Text, { textLight: true }, t("diffTool.instructions.paneDescription")),
                    React.createElement(Spacing, { bottom: 3 }),
                    React.createElement(LocationAndDatesDisplayBox, null,
                        React.createElement(Box, null,
                            React.createElement(Text, { medium: true },
                                t("diffTool.labels.area"),
                                ":"),
                            React.createElement("div", null,
                                React.createElement(Text, { medium: true, textLightDimmed: !this.location }, this.location
                                    ? t("diffTool.locationDisplay.locationSelected.title")
                                    : t("diffTool.locationDisplay.noLocationSelected.title")),
                                React.createElement(Text, { light: true, textLight: true, small: true }, this.location
                                    ? t("diffTool.locationDisplay.locationSelected.description")
                                    : t("diffTool.locationDisplay.noLocationSelected.description")))),
                        React.createElement(Box, null,
                            React.createElement(Text, { medium: true },
                                t("diffTool.labels.dates"),
                                ":"),
                            React.createElement(Box, { column: true, alignItemsFlexStart: true },
                                this.leftDate && (React.createElement(Text, { large: true },
                                    "(A) ",
                                    dateFormat(this.leftDate, "dd/mm/yyyy"))),
                                !this.leftDate && (React.createElement(RawButton, { ref: this.openLeftDatePickerButton },
                                    React.createElement(TextSpan, { isLink: true, small: true }, t("diffTool.instructions.setDateA")))),
                                React.createElement(Spacing, { bottom: 1 }),
                                this.rightDate && (React.createElement(Text, { large: true },
                                    "(B) ",
                                    dateFormat(this.rightDate, "dd/mm/yyyy"))),
                                !this.rightDate && (React.createElement(RawButton, { ref: this.openRightDatePickerButton },
                                    React.createElement(TextSpan, { isLink: true, small: true }, t("diffTool.instructions.setDateB")))),
                                isShowingDiff === false && this.leftDate && this.rightDate && (React.createElement(RawButton, { onClick: this.unsetDates },
                                    React.createElement(TextSpan, { isLink: true, small: true }, t("diffTool.instructions.changeDates"))))))),
                    !isShowingDiff && (React.createElement(React.Fragment, null,
                        React.createElement(Spacing, { bottom: 4 }),
                        React.createElement(Selector, { viewState: viewState, value: sourceItem.uniqueId, onChange: this.changeSourceItem, label: t("diffTool.labels.sourceDataset") },
                            React.createElement("option", { disabled: true }, "Select source item"),
                            this.diffableItemsInWorkbench.map(item => (React.createElement("option", { key: item.uniqueId, value: item.uniqueId }, item.name)))))),
                    !isShowingDiff && (React.createElement(React.Fragment, null,
                        React.createElement(Spacing, { bottom: 4 }),
                        React.createElement(Selector, { viewState: viewState, spacingBottom: true, value: this.previewStyle, onChange: this.changePreviewStyle, label: t("diffTool.labels.previewStyle") },
                            React.createElement("option", { disabled: true, value: "" }, t("diffTool.choosePreview")), (_c = (_b = (_a = this.diffItem.styleSelectableDimensions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 :
                            _c.map(style => (React.createElement("option", { key: style.id, value: style.id }, style.name)))),
                        this.previewLegendUrl && (React.createElement(React.Fragment, null,
                            React.createElement(Spacing, { bottom: 2 }),
                            React.createElement(LegendImage, { width: "100%", src: this.previewLegendUrl }))))),
                    React.createElement(Spacing, { bottom: 2 }),
                    React.createElement(Selector, { viewState: viewState, value: this.diffStyle || "", onChange: this.changeDiffStyle, label: t("diffTool.labels.differenceOutput") },
                        React.createElement("option", { disabled: true, value: "" }, t("diffTool.chooseDifference")),
                        this.availableDiffStyles.map(style => (React.createElement("option", { key: style.id, value: style.id }, style.name)))),
                    isShowingDiff && this.diffLegendUrl && (React.createElement(React.Fragment, null,
                        React.createElement(LegendImage, { width: "100%", src: this.diffLegendUrl }),
                        React.createElement(Spacing, { bottom: 4 }))),
                    !isShowingDiff && (React.createElement(React.Fragment, null,
                        React.createElement(Spacing, { bottom: 4 }),
                        React.createElement(GenerateButton, { onClick: this.generateDiff, disabled: !isReadyToGenerateDiff, "aria-describedby": "TJSDifferenceDisabledButtonPrompt" },
                            React.createElement(TextSpan, { large: true }, t("diffTool.labels.generateDiffButtonText"))),
                        !isReadyToGenerateDiff && (React.createElement(React.Fragment, null,
                            React.createElement(Spacing, { bottom: 3 }),
                            React.createElement(Text, { small: true, light: true, textLight: true, id: "TJSDifferenceDisabledButtonPrompt" }, t("diffTool.labels.disabledButtonPrompt")),
                            React.createElement(Spacing, { bottom: 4 }))))))),
            isShowingDiff && (React.createElement(CloseDifferenceButton, { primary: true, rounded: true, textProps: {
                    semiBold: true,
                    extraLarge: true
                }, theme: theme, activeStyles: true, onClick: this.resetTool, renderIcon: () => (React.createElement(StyledIcon, { light: true, styledWidth: "13px", glyph: GLYPHS.closeLight })), iconProps: {
                    css: `margin-right: 10px;`
                } }, "Close")),
            !isShowingDiff && (React.createElement(LocationPicker, { terria: terria, location: this.location, onPicking: this.onUserPickingLocation, onPicked: this.onUserPickLocation })),
            !isShowingDiff &&
                ReactDOM.createPortal(
                // Bottom Panel
                React.createElement(Box, { centered: true, fullWidth: true, flexWrap: true, backgroundColor: theme.dark },
                    React.createElement(DatePicker, { heading: t("diffTool.labels.dateComparisonA"), item: this.props.leftItem, externalOpenButton: this.openLeftDatePickerButton, onDateSet: () => this.showItem(this.props.leftItem) }),
                    React.createElement(AreaFilterSelection, { t: t, location: this.location, isPickingNewLocation: this._isPickingNewLocation }),
                    React.createElement(DatePicker, { heading: t("diffTool.labels.dateComparisonB"), item: this.props.rightItem, externalOpenButton: this.openRightDatePickerButton, onDateSet: () => this.showItem(this.props.rightItem) })), document.getElementById("TJS-BottomDockPortalForTool"))));
    }
};
__decorate([
    observable
], Main.prototype, "location", void 0);
__decorate([
    observable
], Main.prototype, "_locationPickError", void 0);
__decorate([
    observable
], Main.prototype, "_isPickingNewLocation", void 0);
__decorate([
    computed
], Main.prototype, "locationPickerMessages", null);
__decorate([
    computed
], Main.prototype, "diffItem", null);
__decorate([
    computed
], Main.prototype, "diffItemName", null);
__decorate([
    computed
], Main.prototype, "diffableItemsInWorkbench", null);
__decorate([
    computed
], Main.prototype, "previewStyle", null);
__decorate([
    computed
], Main.prototype, "diffStyle", null);
__decorate([
    computed
], Main.prototype, "availableDiffStyles", null);
__decorate([
    computed
], Main.prototype, "leftDate", null);
__decorate([
    computed
], Main.prototype, "rightDate", null);
__decorate([
    computed
], Main.prototype, "diffLegendUrl", null);
__decorate([
    computed
], Main.prototype, "previewLegendUrl", null);
__decorate([
    action
], Main.prototype, "showItem", null);
__decorate([
    action
], Main.prototype, "hideItem", null);
__decorate([
    action.bound
], Main.prototype, "changeSourceItem", null);
__decorate([
    action.bound
], Main.prototype, "changePreviewStyle", null);
__decorate([
    action.bound
], Main.prototype, "changeDiffStyle", null);
__decorate([
    action.bound
], Main.prototype, "onUserPickingLocation", null);
__decorate([
    action.bound
], Main.prototype, "onUserPickLocation", null);
__decorate([
    action.bound
], Main.prototype, "unsetDates", null);
__decorate([
    action.bound
], Main.prototype, "generateDiff", null);
__decorate([
    action.bound
], Main.prototype, "resetTool", null);
__decorate([
    action
], Main.prototype, "setLocationFromActiveSearch", null);
__decorate([
    action
], Main.prototype, "componentDidMount", null);
Main = __decorate([
    observer
], Main);
const DiffAccordionToggle = styled(Box) `
  ${({ theme }) => theme.borderRadiusTop(theme.radius40Button)}
`;
const DiffAccordion = props => {
    const [showChildren, setShowChildren] = useState(true);
    const { t, viewState } = props;
    const theme = useTheme();
    return (React.createElement(DiffAccordionWrapper, { isMapFullScreen: viewState.isMapFullScreen, column: true },
        React.createElement(DiffAccordionToggle, { paddedVertically: true, paddedHorizontally: 2, centered: true, justifySpaceBetween: true, backgroundColor: theme.colorSecondary },
            React.createElement(Box, { centered: true },
                React.createElement(StyledIcon, { styledWidth: "20px", light: true, glyph: GLYPHS.difference }),
                React.createElement(Spacing, { right: 1 }),
                React.createElement(Text, { textLight: true, semiBold: true, 
                    // font-size is non standard with what we have so far in terria,
                    // lineheight as well to hit nonstandard paddings
                    styledFontSize: "17px", styledLineHeight: "30px" }, t("diffTool.title"))),
            React.createElement(Box, { centered: true, css: "margin-right:-5px;" },
                React.createElement(RawButton, { onClick: () => viewState.closeTool() },
                    React.createElement(Text, { textLight: true, small: true, semiBold: true, uppercase: true }, t("diffTool.exit"))),
                React.createElement(Spacing, { right: 4 }),
                React.createElement(RawButton, { onClick: () => setShowChildren(!showChildren) },
                    React.createElement(Box, { paddedRatio: 1, centered: true },
                        React.createElement(StyledIcon, { styledWidth: "12px", light: true, glyph: showChildren ? GLYPHS.opened : GLYPHS.closed }))))),
        showChildren && props.children));
};
const DiffAccordionWrapper = styled(Box).attrs({
    column: true,
    position: "absolute",
    styledWidth: "340px"
    // charcoalGreyBg: true
}) `
  top: 70px;
  left: 0px;
  min-height: 220px;
  // background: ${p => p.theme.dark};
  margin-left: ${props => props.isMapFullScreen ? 16 : parseInt(props.theme.workbenchWidth) + 40}px;
  transition: margin-left 0.25s;
`;
const MainPanel = styled(Box).attrs({
    column: true,
    overflowY: "auto",
    paddedRatio: 2
}) `
  ${({ theme }) => theme.borderRadiusBottom(theme.radius40Button)}
  background-color: ${p => p.theme.darkWithOverlay};
`;
const BackButton = styled(Button).attrs({
    secondary: true
}) ``;
const CloseDifferenceButton = styled(Button) `
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 18px;

  padding: 0 20px;
`;
const GenerateButton = styled(Button).attrs({
    primary: true,
    splitter: true,
    fullWidth: true
}) ``;
const Selector = (props) => (React.createElement(Box, { fullWidth: true, column: true },
    React.createElement("label", null,
        React.createElement(Text, { textLight: true, css: "p {margin: 0;}" }, parseCustomMarkdownToReactWithOptions(`${props.label}:`, {
            injectTermsAsTooltips: true,
            tooltipTerms: props.viewState.terria.configParameters.helpContentTerms
        })),
        React.createElement(Spacing, { bottom: 1 }),
        React.createElement(Select, Object.assign({}, props), props.children),
        props.spacingBottom && React.createElement(Spacing, { bottom: 2 }))));
const AreaFilterSelection = (props) => {
    const { t, location, isPickingNewLocation } = props;
    let locationText = "-";
    if (location) {
        const { longitude, latitude } = prettifyCoordinates(location.longitude, location.latitude, {
            digits: 2
        });
        locationText = `${longitude} ${latitude}`;
    }
    return (React.createElement(Box, { column: true, centered: true, styledMinWidth: "230px", css: `
        @media (max-width: ${(props) => props.theme.md}px) {
          width: 100%;
        }
      ` },
        React.createElement(Box, { centered: true },
            React.createElement(StyledIcon, { light: true, styledWidth: "16px", glyph: GLYPHS.location2 }),
            React.createElement(Spacing, { right: 2 }),
            React.createElement(Text, { textLight: true, extraLarge: true }, t("diffTool.labels.areaFilterSelection"))),
        React.createElement(Spacing, { bottom: 3 }),
        React.createElement(Box, { styledMinHeight: "40px" }, isPickingNewLocation ? (React.createElement(Text, { textLight: true, extraExtraLarge: true, bold: true, 
            // Using legacy Loader.jsx means we override at a higher level to inherit
            // this fills tyle
            css: `
              fill: ${({ theme }) => theme.textLight};
            ` },
            React.createElement(Loader, { light: true, message: `Querying ${location ? "new" : ""} position...` }))) : (React.createElement(Text, { textLight: true, bold: true, heading: true, textAlignCenter: true }, locationText)))));
};
const LocationAndDatesDisplayBox = styled(Box).attrs({
    column: true,
    charcoalGreyBg: true
}) `
  color: ${p => p.theme.textLight};
  padding: 15px;
  > ${Box}:first-child {
    margin-bottom: 13px;
  }
  > div > div:first-child {
    /* The labels */
    margin-right: 5px;
    min-width: 50px;
  }
`;
const LegendImage = function (props) {
    return (React.createElement("img", Object.assign({}, props, { 
        // Show the legend only if it loads successfully, so we start out hidden
        style: { display: "none", marginTop: "4px" }, 
        // @ts-ignore
        onLoad: e => (e.target.style.display = "block"), 
        // @ts-ignore
        onError: e => (e.target.style.display = "none") })));
};
async function createSplitItem(sourceItem, splitDirection) {
    const terria = sourceItem.terria;
    const ref = new SplitItemReference(createGuid(), terria);
    ref.setTrait(CommonStrata.user, "splitSourceItemId", sourceItem.uniqueId);
    terria.addModel(ref);
    await ref.loadReference();
    return runInAction(() => {
        var _a, _b, _c, _d, _e;
        if (ref.target === undefined) {
            throw Error("failed to split item");
        }
        const newItem = ref.target;
        newItem.setTrait(CommonStrata.user, "show", true);
        newItem.setTrait(CommonStrata.user, "splitDirection", splitDirection);
        newItem.setTrait(CommonStrata.user, "currentTime", null);
        newItem.setTrait(CommonStrata.user, "initialTimeSource", "none");
        if (hasOpacity(newItem)) {
            // We want to show the item on the map only after date selection. At the
            // same time we cannot set `show` to false because if we
            // do so, date picking which relies on feature picking, will not work. So
            // we simply set the opacity of the item to 0.
            newItem.setTrait(CommonStrata.user, "opacity", 0);
        }
        setDefaultDiffStyle(newItem);
        // Set the default style to true color style if it exists
        const trueColor = (_c = (_b = (_a = newItem.styleSelectableDimensions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.find(style => isDefined(style.name) && style.name.search(/true/i) >= 0);
        if (trueColor === null || trueColor === void 0 ? void 0 : trueColor.id) {
            (_e = (_d = newItem.styleSelectableDimensions) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.setDimensionValue(CommonStrata.user, trueColor.id);
        }
        terria.overlays.add(newItem);
        return newItem;
    });
}
/**
 * If the item has only one available diff style, auto-select it
 */
function setDefaultDiffStyle(item) {
    if (item.diffStyleId !== undefined) {
        return;
    }
    const availableStyles = filterOutUndefined(item.availableDiffStyles.map(diffStyleId => { var _a, _b, _c; return (_c = (_b = (_a = item.styleSelectableDimensions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.find(style => style.id === diffStyleId); }));
    if (availableStyles.length === 1) {
        item.setTrait(CommonStrata.user, "diffStyleId", availableStyles[0].id);
    }
}
function removeSplitItem(item) {
    const terria = item.terria;
    terria.overlays.remove(item);
    if (item.sourceReference && terria.workbench.contains(item) === false) {
        terria.removeModelReferences(item.sourceReference);
    }
}
function doesFeatureBelongToItem(feature, item) {
    var _a;
    if (!MappableMixin.isMixedInto(item))
        return false;
    const imageryProvider = (_a = feature.imageryLayer) === null || _a === void 0 ? void 0 : _a.imageryProvider;
    if (imageryProvider === undefined)
        return false;
    return (item.mapItems.find(m => ImageryParts.is(m) && m.imageryProvider === imageryProvider) !== undefined);
}
function setTimeFilterFromLocation(item, location, im) {
    const carto = new Cartographic(CesiumMath.toRadians(location.longitude), CesiumMath.toRadians(location.latitude));
    // We just need to set this to a high enough level supported by the service
    const level = 30;
    const tile = im.tilingScheme.positionToTileXY(carto, level);
    return item.setTimeFilterFromLocation({
        position: {
            latitude: location.latitude,
            longitude: location.longitude,
            height: location.height
        },
        tileCoords: {
            x: tile.x,
            y: tile.y,
            level
        }
    });
}
function hasOpacity(model) {
    return hasTraits(model, RasterLayerTraits, "opacity");
}
export default hoistStatics(withTranslation()(withTheme(DiffTool)), DiffTool);
//# sourceMappingURL=DiffTool.js.map