var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import { DataSourceAction } from "../../Core/AnalyticEvents/analyticEvents";
import MappableMixin from "../../ModelMixins/MappableMixin";
import toggleItemOnMapFromCatalog, { Op as ToggleOnMapOp } from "../DataCatalog/toggleItemOnMapFromCatalog";
import measureElement from "../HOCs/measureElement";
import SharePanel from "../Map/Panels/SharePanel/SharePanel.jsx";
import DataPreviewMap from "./DataPreviewMap";
import Description from "./Description";
import Styles from "./mappable-preview.scss";
import WarningBox from "./WarningBox";
/**
 * @typedef {object} Props
 * @prop {Terria} terria
 * @prop {MappableMixin.Instance} previewed
 * @prop {ViewState} viewState
 *
 */
/**
 * CatalogItem preview that is mappable (as opposed to say, an analytics item that can't be displayed on a map without
 * configuration of other parameters.
 * @extends {React.Component<Props>}
 */
let MappablePreview = class MappablePreview extends React.Component {
    async toggleOnMap(event) {
        if (defined(this.props.viewState.storyShown)) {
            runInAction(() => (this.props.viewState.storyShown = false));
        }
        const keepCatalogOpen = event.shiftKey || event.ctrlKey;
        await toggleItemOnMapFromCatalog(this.props.viewState, this.props.previewed, keepCatalogOpen, {
            [ToggleOnMapOp.Add]: DataSourceAction.addFromPreviewButton,
            [ToggleOnMapOp.Remove]: DataSourceAction.removeFromPreviewButton
        });
    }
    backToMap() {
        this.props.viewState.explorerPanelIsVisible = false;
    }
    render() {
        var _a, _b, _c, _d;
        const { t } = this.props;
        const catalogItem = this.props.previewed;
        return (React.createElement("div", { className: Styles.root },
            React.createElement(If, { condition: MappableMixin.isMixedInto(catalogItem) &&
                    !catalogItem.disablePreview },
                React.createElement(DataPreviewMap, { terria: this.props.terria, previewed: catalogItem, showMap: !this.props.viewState.explorerPanelAnimating ||
                        this.props.viewState.useSmallScreenInterface })),
            React.createElement("button", { type: "button", onClick: this.toggleOnMap.bind(this), className: Styles.btnAdd }, this.props.terria.workbench.contains(catalogItem)
                ? t("preview.removeFromMap")
                : t("preview.addToMap")),
            React.createElement("div", { className: Styles.previewedInfo },
                React.createElement("div", { className: Styles.titleAndShareWrapper, ref: component => (this.refToMeasure = component) },
                    React.createElement("h3", { className: Styles.h3 }, catalogItem.name),
                    React.createElement(If, { condition: !catalogItem.hasLocalData &&
                            !this.props.viewState.useSmallScreenInterface },
                        React.createElement("div", { className: Styles.shareLinkWrapper },
                            React.createElement(SharePanel, { catalogShare: true, catalogShareWithoutText: true, modalWidth: this.props.widthFromMeasureElementHOC, terria: this.props.terria, viewState: this.props.viewState })))),
                React.createElement(If, { condition: (_a = catalogItem.loadMetadataResult) === null || _a === void 0 ? void 0 : _a.error },
                    React.createElement(WarningBox, { error: (_b = catalogItem.loadMetadataResult) === null || _b === void 0 ? void 0 : _b.error, viewState: this.props.viewState })),
                React.createElement(If, { condition: (_c = catalogItem.loadMapItemsResult) === null || _c === void 0 ? void 0 : _c.error },
                    React.createElement(WarningBox, { error: (_d = catalogItem.loadMapItemsResult) === null || _d === void 0 ? void 0 : _d.error, viewState: this.props.viewState })),
                React.createElement(Description, { item: catalogItem }))));
    }
};
MappablePreview.propTypes = {
    previewed: PropTypes.object.isRequired,
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    widthFromMeasureElementHOC: PropTypes.number,
    t: PropTypes.func.isRequired
};
MappablePreview = __decorate([
    observer
], MappablePreview);
export default withTranslation()(measureElement(MappablePreview));
//# sourceMappingURL=MappablePreview.js.map