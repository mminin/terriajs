import React from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import createReactClass from "create-react-class";
import Icon from "../../../../Styled/Icon";
import Box from "../../../../Styled/Box";
import PropTypes from "prop-types";
import DataCatalog from "../../../DataCatalog/DataCatalog.jsx";
import DataPreview from "../../../Preview/DataPreview.jsx";
import AddData from "./AddData.jsx";
import { withTranslation, Trans } from "react-i18next";
import Styles from "./my-data-tab.scss";
// My data tab include Add data section and preview section
const MyDataTab = observer(createReactClass({
    displayName: "MyDataTab",
    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        localDataTypes: PropTypes.arrayOf(PropTypes.object),
        remoteDataTypes: PropTypes.arrayOf(PropTypes.object),
        onFileAddFinished: PropTypes.func.isRequired,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            activeTab: null
        };
    },
    hasUserAddedData() {
        return this.props.terria.catalog.userAddedDataGroup.members.length > 0;
    },
    changeTab(active) {
        this.setState({
            activeTab: active
        });
    },
    resetTab() {
        this.setState({
            activeTab: null
        });
    },
    renderTabs() {
        const { t } = this.props;
        const tabs = [
            {
                id: "local",
                caption: t("addData.localTitle")
            },
            {
                id: "web",
                caption: t("addData.webTitle")
            }
        ];
        return (React.createElement("ul", { className: Styles.tabList },
            React.createElement(For, { each: "tab", of: tabs },
                React.createElement("li", { className: Styles.tabListItem, key: tab.id },
                    React.createElement("button", { type: "button", onClick: this.changeTab.bind(null, tab.id), title: tab.caption, className: classNames(Styles.tabListBtn, {
                            [Styles.isActive]: this.state.activeTab === tab.id
                        }), css: `
                  color: ${p => p.theme.colorPrimary};
                  &:hover,
                  &:focus {
                    color: ${p => p.theme.grey};
                  }
                  svg {
                    fill: ${p => p.theme.colorPrimary};
                  }
                ` },
                        React.createElement(Icon, { glyph: Icon.GLYPHS[tab.id] }),
                        tab.caption)))));
    },
    renderPromptBox() {
        if (this.hasUserAddedData()) {
            const { t } = this.props;
            return (React.createElement("div", { className: Styles.dataTypeTab },
                React.createElement("div", { className: Styles.dndBox },
                    React.createElement(Icon, { glyph: Icon.GLYPHS.upload }),
                    t("addData.dragDrop"))));
        }
        return (React.createElement("div", { className: Styles.dataTypeTab },
            React.createElement("div", { className: Styles.dndBoxInfo },
                React.createElement(Trans, { i18nKey: "addData.infoText" },
                    React.createElement("div", null, "Drag and drop a file here to view it locally on the map"),
                    React.createElement("div", null, "(it won\u2019t be saved or uploaded to the internet)")),
                React.createElement("div", { className: Styles.tabCenter }, this.renderTabs())),
            React.createElement("div", { className: Styles.dndBox },
                React.createElement(Icon, { glyph: Icon.GLYPHS.upload }))));
    },
    render() {
        const showTwoColumn = this.hasUserAddedData() & !this.state.activeTab;
        const { t } = this.props;
        return (React.createElement(Box, { className: Styles.root },
            React.createElement("div", { className: classNames({
                    [Styles.leftCol]: showTwoColumn,
                    [Styles.oneCol]: !showTwoColumn
                }) },
                React.createElement(If, { condition: this.state.activeTab },
                    React.createElement("button", { type: "button", onClick: this.resetTab, className: Styles.btnBackToMyData, css: `
                  color: ${p => p.theme.colorPrimary};
                  &:hover,
                  &:focus {
                    border: 1px solid ${p => p.theme.colorPrimary};
                  }
                  svg {
                    fill: ${p => p.theme.colorPrimary};
                  }
                ` },
                        React.createElement(Icon, { glyph: Icon.GLYPHS.left }),
                        t("addData.back")),
                    React.createElement(AddData, { terria: this.props.terria, viewState: this.props.viewState, activeTab: this.state.activeTab, resetTab: this.resetTab, localDataTypes: this.props.localDataTypes, remoteDataTypes: this.props.remoteDataTypes, onFileAddFinished: this.props.onFileAddFinished })),
                React.createElement(If, { condition: showTwoColumn },
                    React.createElement(Box, { flexShrinkZero: true, column: true },
                        React.createElement("p", { className: Styles.explanation },
                            React.createElement(Trans, { i18nKey: "addData.note" },
                                React.createElement("strong", null, "Note: "),
                                "Data added in this way is not saved or made visible to others.")),
                        React.createElement("div", { className: Styles.tabLeft }, this.renderTabs()),
                        React.createElement("ul", { className: Styles.dataCatalog },
                            React.createElement(DataCatalog, { items: this.props.terria.catalog.userAddedDataGroup.memberModels, removable: true, viewState: this.props.viewState, terria: this.props.terria })))),
                React.createElement(If, { condition: !this.state.activeTab }, this.renderPromptBox())),
            React.createElement(If, { condition: showTwoColumn },
                React.createElement(Box, { styledWidth: "60%" },
                    React.createElement(DataPreview, { terria: this.props.terria, viewState: this.props.viewState, previewed: this.props.viewState.userDataPreviewedItem })))));
    }
}));
module.exports = withTranslation()(MyDataTab);
//# sourceMappingURL=MyDataTab.js.map