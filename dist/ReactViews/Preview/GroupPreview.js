import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import DataPreviewSections from "./DataPreviewSections";
import DataPreviewUrl from "./DataPreviewUrl";
import measureElement from "../HOCs/measureElement";
import Styles from "./mappable-preview.scss";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import SharePanel from "../Map/Panels/SharePanel/SharePanel";
import { withTranslation } from "react-i18next";
import WarningBox from "./WarningBox";
/**
 * A "preview" for CatalogGroup.
 */
const GroupPreview = observer(createReactClass({
    displayName: "GroupPreview",
    propTypes: {
        previewed: PropTypes.object.isRequired,
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        widthFromMeasureElementHOC: PropTypes.number,
        t: PropTypes.func.isRequired
    },
    backToMap() {
        this.props.viewState.explorerPanelIsVisible = false;
    },
    render() {
        var _a, _b, _c, _d;
        const metadataItem = this.props.previewed.nowViewingCatalogItem || this.props.previewed;
        const { t } = this.props;
        return (React.createElement("div", null,
            React.createElement("div", { className: Styles.titleAndShareWrapper, ref: (component) => (this.refToMeasure = component) },
                React.createElement("h3", null, this.props.previewed.name),
                React.createElement("div", { className: Styles.shareLinkWrapper },
                    React.createElement(SharePanel, { catalogShare: true, modalWidth: this.props.widthFromMeasureElementHOC, terria: this.props.terria, viewState: this.props.viewState }))),
            React.createElement(If, { condition: (_a = this.props.previewed.loadMetadataResult) === null || _a === void 0 ? void 0 : _a.error },
                React.createElement(WarningBox, { error: (_b = this.props.previewed.loadMetadataResult) === null || _b === void 0 ? void 0 : _b.error, viewState: this.props.viewState })),
            React.createElement(If, { condition: (_c = this.props.previewed.loadMembersResult) === null || _c === void 0 ? void 0 : _c.error },
                React.createElement(WarningBox, { error: (_d = this.props.previewed.loadMembersResult) === null || _d === void 0 ? void 0 : _d.error, viewState: this.props.viewState })),
            React.createElement("div", { className: Styles.previewedInfo },
                React.createElement("div", { className: Styles.url },
                    React.createElement(Choose, null,
                        React.createElement(When, { condition: this.props.previewed.description &&
                                this.props.previewed.description.length > 0 },
                            React.createElement("div", null,
                                React.createElement("h4", { className: Styles.h4 }, t("description.name")),
                                parseCustomMarkdownToReact(this.props.previewed.description, { catalogItem: this.props.previewed })))),
                    React.createElement(DataPreviewSections, { metadataItem: metadataItem }),
                    React.createElement(If, { condition: metadataItem.dataCustodian },
                        React.createElement("div", null,
                            React.createElement("h4", { className: Styles.h4 }, t("preview.dataCustodian")),
                            parseCustomMarkdownToReact(metadataItem.dataCustodian, {
                                catalogItem: metadataItem
                            }))),
                    React.createElement(If, { condition: metadataItem.url &&
                            metadataItem.url.length &&
                            !metadataItem.hideSource },
                        React.createElement(DataPreviewUrl, { metadataItem: metadataItem }))))));
    }
}));
export default withTranslation()(measureElement(GroupPreview));
//# sourceMappingURL=GroupPreview.js.map