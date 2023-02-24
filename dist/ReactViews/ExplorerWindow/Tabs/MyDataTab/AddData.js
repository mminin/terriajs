import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import { Category, DatatabAction } from "../../../../Core/AnalyticEvents/analyticEvents";
import getDataType from "../../../../Core/getDataType";
import TimeVarying from "../../../../ModelMixins/TimeVarying";
import addUserCatalogMember from "../../../../Models/Catalog/addUserCatalogMember";
import addUserFiles from "../../../../Models/Catalog/addUserFiles";
import CatalogMemberFactory from "../../../../Models/Catalog/CatalogMemberFactory";
import createCatalogItemFromFileOrUrl from "../../../../Models/Catalog/createCatalogItemFromFileOrUrl";
import CommonStrata from "../../../../Models/Definition/CommonStrata";
import upsertModelFromJson from "../../../../Models/Definition/upsertModelFromJson";
import Icon from "../../../../Styled/Icon";
import Dropdown from "../../../Generic/Dropdown";
import Loader from "../../../Loader";
import Styles from "./add-data.scss";
import FileInput from "./FileInput";
import { parseCustomMarkdownToReactWithOptions } from "../../../Custom/parseCustomMarkdownToReact";
import loadJson from "../../../../Core/loadJson";
import TerriaError from "../../../../Core/TerriaError";
/**
 * Add data panel in modal window -> My data tab
 */
const AddData = createReactClass({
    displayName: "AddData",
    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        resetTab: PropTypes.func,
        activeTab: PropTypes.string,
        // localDataTypes & remoteDataTypes specifies the file types to show in dropdowns for local and remote data uploads.
        // These default to the lists defined in getDataType.ts
        // Some external components use these props to customize the types shown.
        localDataTypes: PropTypes.arrayOf(PropTypes.object),
        remoteDataTypes: PropTypes.arrayOf(PropTypes.object),
        onFileAddFinished: PropTypes.func.isRequired,
        onUrlAddFinished: PropTypes.func.isRequired,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        var _a, _b;
        const remoteDataTypes = (_a = this.props.remoteDataTypes) !== null && _a !== void 0 ? _a : getDataType().remoteDataType;
        // Automatically suffix supported extension types to localDataType names
        const localDataTypes = ((_b = this.props.localDataTypes) !== null && _b !== void 0 ? _b : getDataType().localDataType).map((dataType) => {
            var _a;
            const extensions = ((_a = dataType.extensions) === null || _a === void 0 ? void 0 : _a.length) ? ` (${buildExtensionsList(dataType.extensions)})`
                : "";
            return { ...dataType, name: `${dataType.name}${extensions}` };
        });
        return {
            remoteDataTypes,
            localDataTypes,
            remoteDataType: remoteDataTypes[0],
            localDataType: localDataTypes[0],
            remoteUrl: "",
            isLoading: false
        };
    },
    selectLocalOption(option) {
        this.setState({
            localDataType: option
        });
    },
    selectRemoteOption(option) {
        this.setState({
            remoteDataType: option
        });
    },
    handleUploadFile(e) {
        this.setState({
            isLoading: true
        });
        addUserFiles(e.target.files, this.props.terria, this.props.viewState, this.state.localDataType).then((addedCatalogItems) => {
            if (addedCatalogItems && addedCatalogItems.length > 0) {
                this.props.onFileAddFinished(addedCatalogItems);
            }
            this.setState({
                isLoading: false
            });
            // reset active tab when file handling is done
            this.props.resetTab();
        });
    },
    async handleUrl(e) {
        var _a;
        const url = this.state.remoteUrl;
        e.preventDefault();
        (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.dataTab, DatatabAction.addDataUrl, url);
        this.setState({
            isLoading: true
        });
        let promise;
        if (this.state.remoteDataType.value === "auto") {
            promise = createCatalogItemFromFileOrUrl(this.props.terria, this.props.viewState, this.state.remoteUrl, this.state.remoteDataType.value);
        }
        else if (this.state.remoteDataType.value === "json") {
            promise = loadJson(this.state.remoteUrl)
                .then((data) => {
                if (data.error) {
                    return Promise.reject(data.error);
                }
                this.props.terria.catalog.group
                    .addMembersFromJson(CommonStrata.user, data.catalog)
                    .raiseError(this.props.terria, "Failed to load catalog from file");
            })
                .then(() => {
                this.props.onUrlAddFinished();
            })
                .catch((error) => TerriaError.from(error).raiseError(this.props.terria, `An error occurred trying to add data from URL: ${this.state.remoteUrl}`))
                .finally(() => {
                this.setState({
                    isLoading: false
                });
            });
        }
        else {
            try {
                const newItem = upsertModelFromJson(CatalogMemberFactory, this.props.terria, "", CommonStrata.defaults, { type: this.state.remoteDataType.value, name: url }, {}).throwIfUndefined({
                    message: `An error occurred trying to add data from URL: ${url}`
                });
                newItem.setTrait(CommonStrata.user, "url", url);
                promise = newItem.loadMetadata().then((result) => {
                    if (result.error) {
                        return Promise.reject(result.error);
                    }
                    return Promise.resolve(newItem);
                });
            }
            catch (e) {
                promise = Promise.reject(e);
            }
        }
        addUserCatalogMember(this.props.terria, promise).then((addedItem) => {
            if (addedItem) {
                this.props.onFileAddFinished([addedItem]);
                if (TimeVarying.is(addedItem)) {
                    this.props.terria.timelineStack.addToTop(addedItem);
                }
            }
            // FIXME: Setting state here might result in a react warning if the
            // component unmounts before the promise finishes
            this.setState({
                isLoading: false
            });
            this.props.resetTab();
        });
    },
    onRemoteUrlChange(event) {
        this.setState({
            remoteUrl: event.target.value
        });
    },
    renderPanels() {
        var _a, _b, _c, _d;
        const { t } = this.props;
        const dropdownTheme = {
            dropdown: Styles.dropdown,
            list: Styles.dropdownList,
            isOpen: Styles.dropdownListIsOpen,
            icon: React.createElement(Icon, { glyph: Icon.GLYPHS.opened })
        };
        const dataTypes = this.state.localDataTypes.reduce(function (result, currentDataType) {
            if (currentDataType.extensions) {
                return result.concat(currentDataType.extensions.map((extension) => "." + extension));
            }
            else {
                return result;
            }
        }, []);
        return (React.createElement("div", { className: Styles.tabPanels },
            React.createElement(If, { condition: this.props.activeTab === "local" },
                React.createElement("div", { className: Styles.tabHeading }, t("addData.localAdd")),
                React.createElement("section", { className: Styles.tabPanel },
                    React.createElement("label", { className: Styles.label },
                        React.createElement(Trans, { i18nKey: "addData.localFileType" },
                            React.createElement("strong", null, "Step 1:"),
                            " Select file type")),
                    React.createElement(Dropdown, { options: this.state.localDataTypes, selected: this.state.localDataType, selectOption: this.selectLocalOption, matchWidth: true, theme: dropdownTheme }),
                    ((_a = this.state.localDataType) === null || _a === void 0 ? void 0 : _a.description) ? parseCustomMarkdownToReactWithOptions((_b = this.state.localDataType) === null || _b === void 0 ? void 0 : _b.description)
                        : null,
                    React.createElement("label", { className: Styles.label },
                        React.createElement(Trans, { i18nKey: "addData.localFile" },
                            React.createElement("strong", null, "Step 2:"),
                            " Select file")),
                    React.createElement(FileInput, { accept: dataTypes.join(","), onChange: this.handleUploadFile }),
                    this.state.isLoading && React.createElement(Loader, null))),
            React.createElement(If, { condition: this.props.activeTab === "web" },
                React.createElement("div", { className: Styles.tabHeading }, t("addData.webAdd")),
                React.createElement("section", { className: Styles.tabPanel },
                    React.createElement("label", { className: Styles.label },
                        React.createElement(Trans, { i18nKey: "addData.webFileType" },
                            React.createElement("strong", null, "Step 1:"),
                            " Select file or web service type")),
                    React.createElement(Dropdown, { options: this.state.remoteDataTypes, selected: this.state.remoteDataType, selectOption: this.selectRemoteOption, matchWidth: true, theme: dropdownTheme }),
                    ((_c = this.state.remoteDataType) === null || _c === void 0 ? void 0 : _c.description) ? parseCustomMarkdownToReactWithOptions((_d = this.state.remoteDataType) === null || _d === void 0 ? void 0 : _d.description)
                        : null,
                    React.createElement("label", { className: Styles.label },
                        React.createElement(Trans, { i18nKey: "addData.webFile" },
                            React.createElement("strong", null, "Step 2:"),
                            " Enter the URL of the data file or web service")),
                    React.createElement("form", { className: Styles.urlInput },
                        React.createElement("input", { value: this.state.remoteUrl, onChange: this.onRemoteUrlChange, className: Styles.urlInputTextBox, type: "text", placeholder: "e.g. http://data.gov.au/geoserver/wms" }),
                        React.createElement("button", { type: "submit", onClick: this.handleUrl, className: Styles.urlInputBtn }, t("addData.urlInputBtn")),
                        this.state.isLoading && React.createElement(Loader, null))))));
    },
    render() {
        return React.createElement("div", { className: Styles.inner }, this.renderPanels());
    }
});
/**
 * @param extensions - string[]
 * @returns Comma separated string of extensions
 */
function buildExtensionsList(extensions) {
    return extensions.map((ext) => `.${ext}`).join(", ");
}
module.exports = withTranslation()(AddData);
//# sourceMappingURL=AddData.js.map