var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { action, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import hasTraits from "../../../Models/Definition/hasTraits";
import Icon from "../../../Styled/Icon";
import UrlTraits from "../../../Traits/TraitsClasses/UrlTraits";
import Styles from "./chart-expand-and-download-buttons.scss";
const Dropdown = require("../../Generic/Dropdown");
let ChartExpandAndDownloadButtons = class ChartExpandAndDownloadButtons extends React.Component {
    constructor() {
        super(...arguments);
        this.sourceItems = [];
    }
    expandButton() {
        this.expandItem(this.sourceItems.length - 1);
    }
    expandDropdown(_selected, sourceIndex) {
        this.expandItem(sourceIndex);
    }
    /**
     * Expand sourceIndex item by adding it to the workbench.
     *
     * We also remove any existing sourceItems from workbench so that only one
     * source is shown at any time.
     */
    expandItem(sourceIndex) {
        const terria = this.props.terria;
        runInAction(async () => {
            const sourceItems = this.sourceItems;
            const itemToExpand = sourceItems[sourceIndex];
            const workbench = terria.workbench;
            if (!itemToExpand) {
                return;
            }
            // We want to show only one source item at a time, so remove any
            // existing source items from the workbench
            sourceItems.forEach(sourceItem => {
                workbench.items.forEach(workbenchItem => {
                    if (sourceItem.uniqueId === workbenchItem.uniqueId) {
                        workbench.remove(workbenchItem);
                    }
                });
            });
            try {
                terria.addModel(itemToExpand);
            }
            catch { }
            (await workbench.add(itemToExpand)).raiseError(terria, undefined, true);
        });
    }
    resolveSourceItems() {
        Promise.all(this.props.sourceItems.map(sourceItem => Promise.resolve(sourceItem))).then(action(results => {
            this.sourceItems = filterOutUndefined(results);
        }));
    }
    componentDidMount() {
        this.resolveSourceItems();
    }
    componentDidUpdate(prevProps) {
        if (this.props.sourceItems !== prevProps.sourceItems) {
            this.resolveSourceItems();
        }
    }
    render() {
        if (this.sourceItems.length === 0) {
            return null;
        }
        // The downloads and download names default to the sources and source names if not defined.
        let downloads = filterOutUndefined(this.props.downloads ||
            this.sourceItems.map(item => hasTraits(item, UrlTraits, "url") ? item.url : undefined));
        const { sourceNames, canDownload, raiseToTitle, t } = this.props;
        if (sourceNames && sourceNames.length > 0) {
            const downloadNames = this.props.downloadNames || sourceNames;
            return (React.createElement(ExpandAndDownloadDropdowns, { sourceNames: sourceNames, canDownload: canDownload, downloads: downloadNames.map((name, i) => ({
                    name,
                    href: downloads[i]
                })), onExpand: this.expandDropdown, raiseToTitle: raiseToTitle, t: t }));
        }
        return (React.createElement(ExpandAndDownloadButtons, { onExpand: this.expandButton, downloadUrl: canDownload && downloads.length > 0 ? downloads[0] : undefined, t: t }));
    }
};
__decorate([
    observable
], ChartExpandAndDownloadButtons.prototype, "sourceItems", void 0);
__decorate([
    action.bound
], ChartExpandAndDownloadButtons.prototype, "expandButton", null);
__decorate([
    action.bound
], ChartExpandAndDownloadButtons.prototype, "expandDropdown", null);
ChartExpandAndDownloadButtons = __decorate([
    observer
], ChartExpandAndDownloadButtons);
const ExpandAndDownloadDropdowns = function (props) {
    const expandDropdownTheme = {
        dropdown: Styles.dropdown,
        list: Styles.dropdownList,
        button: Styles.dropdownBtn,
        btnOption: Styles.dropdownBtnOption
    };
    const downloadDropdownTheme = {
        ...expandDropdownTheme,
        button: classNames(Styles.btnSmall, Styles.btnDownload)
    };
    return (React.createElement("div", { className: classNames(Styles.chartExpand, {
            [Styles.raiseToTitle]: props.raiseToTitle
        }) },
        React.createElement("div", { className: Styles.chartDropdownButton },
            React.createElement(Dropdown, { selectOption: props.onExpand, options: props.sourceNames.map(name => ({ name })), theme: expandDropdownTheme }, props.t("chart.expand") + " ▾"),
            props.canDownload && (React.createElement(Dropdown, { options: props.downloads, theme: downloadDropdownTheme }, props.t("chart.download") + " ▾")))));
};
const ExpandAndDownloadButtons = function (props) {
    return (React.createElement("div", { className: Styles.chartExpand },
        React.createElement("button", { type: "button", className: Styles.btnChartExpand, onClick: props.onExpand }, props.t("chart.expand")),
        props.downloadUrl && (React.createElement("a", { className: classNames(Styles.btnSmall, Styles.aDownload), href: props.downloadUrl },
            React.createElement(Icon, { glyph: Icon.GLYPHS.download })))));
};
export default withTranslation()(ChartExpandAndDownloadButtons);
//# sourceMappingURL=ChartExpandAndDownloadButtons.js.map