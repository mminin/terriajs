"use strict";
// import Chart from "../Custom/Chart/Chart";
import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import CatalogFunctionMixin from "../../ModelMixins/CatalogFunctionMixin";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import InvokeFunction from "../Analytics/InvokeFunction";
import Loader from "../Loader";
import Styles from "./data-preview.scss";
import Description from "./Description";
import GroupPreview from "./GroupPreview";
import MappablePreview from "./MappablePreview";
import WarningBox from "./WarningBox";
/**
 * Data preview section, for the preview map see DataPreviewMap
 */
const DataPreview = observer(createReactClass({
    displayName: "DataPreview",
    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object,
        previewed: PropTypes.object,
        t: PropTypes.func.isRequired
    },
    backToMap() {
        runInAction(() => {
            this.props.viewState.explorerPanelIsVisible = false;
        });
    },
    render() {
        const { t } = this.props;
        let previewed = this.props.previewed;
        if (previewed !== undefined && ReferenceMixin.isMixedInto(previewed)) {
            // We are loading the nested target because we could be dealing with a nested reference here
            if (previewed.nestedTarget === undefined) {
                // Reference is not available yet.
                return this.renderUnloadedReference();
            }
            previewed = previewed.nestedTarget;
        }
        let chartData;
        if (previewed && !previewed.isMappable && previewed.tableStructure) {
            chartData = previewed.chartData();
        }
        return (React.createElement("div", { className: Styles.preview },
            React.createElement(Choose, null,
                React.createElement(When, { condition: previewed && previewed.isLoadingMetadata },
                    React.createElement("div", { className: Styles.previewInner },
                        React.createElement("h3", { className: Styles.h3 }, previewed.name),
                        React.createElement(Loader, null))),
                React.createElement(When, { condition: previewed && previewed.isMappable },
                    React.createElement("div", { className: Styles.previewInner },
                        React.createElement(MappablePreview, { previewed: previewed, terria: this.props.terria, viewState: this.props.viewState }))),
                React.createElement(When, { condition: chartData },
                    React.createElement("div", { className: Styles.previewInner },
                        React.createElement("h3", { className: Styles.h3 }, previewed.name),
                        React.createElement("p", null, t("preview.doesNotContainGeospatialData")),
                        React.createElement("div", { className: Styles.previewChart }),
                        React.createElement(Description, { item: previewed }))),
                React.createElement(When, { condition: previewed && CatalogFunctionMixin.isMixedInto(previewed) },
                    React.createElement(InvokeFunction, { previewed: previewed, terria: this.props.terria, viewState: this.props.viewState })),
                React.createElement(When, { condition: previewed && previewed.isGroup },
                    React.createElement("div", { className: Styles.previewInner },
                        React.createElement(GroupPreview, { previewed: previewed, terria: this.props.terria, viewState: this.props.viewState }))),
                React.createElement(Otherwise, null,
                    React.createElement("div", { className: Styles.placeholder },
                        React.createElement(Trans, { i18nKey: "preview.selectToPreview" },
                            React.createElement("p", null, "Select a dataset to see a preview"),
                            React.createElement("p", null, "- OR -"),
                            React.createElement("button", { className: Styles.btnBackToMap, onClick: this.backToMap }, "Go to the map")))))));
    },
    renderUnloadedReference() {
        var _a, _b, _c;
        const isLoading = this.props.previewed.isLoadingReference;
        const hasTarget = this.props.previewed.target !== undefined;
        return (React.createElement("div", { className: Styles.preview },
            React.createElement("div", { className: Styles.previewInner },
                isLoading && React.createElement(Loader, null),
                !isLoading && !hasTarget && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: Styles.placeholder },
                        React.createElement("h2", null, "Unable to resolve reference"),
                        !((_a = this.props.previewed.loadReferenceResult) === null || _a === void 0 ? void 0 : _a.error) ? (React.createElement("p", null, "This reference could not be resolved because it is invalid or because it points to something that cannot be visualised.")) : null),
                    ((_b = this.props.previewed.loadReferenceResult) === null || _b === void 0 ? void 0 : _b.error) ? (React.createElement(WarningBox, { error: (_c = this.props.previewed.loadReferenceResult) === null || _c === void 0 ? void 0 : _c.error, viewState: this.props.viewState })) : null)))));
    }
}));
module.exports = withTranslation()(DataPreview);
//# sourceMappingURL=DataPreview.js.map