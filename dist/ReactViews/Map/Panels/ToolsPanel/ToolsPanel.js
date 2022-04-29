"use strict";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import ObserverModelMixin from "../../../ObserveModelMixin";
import MenuPanel from "../../../StandardUserInterface/customizable/MenuPanel";
import CountDatasets from "./CountDatasets";
import { withTranslation } from "react-i18next";
import Styles from "./tools-panel.scss";
import DropdownStyles from "../panel.scss";
const ToolsPanel = createReactClass({
    displayName: "ToolsPanel",
    mixins: [ObserverModelMixin],
    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            isOpen: false,
            resultsMessage: ""
        };
    },
    onOpenChanged(open) {
        this.setState({
            isOpen: open
        });
    },
    updateResults(results) {
        this.setState({
            resultsMessage: results
        });
    },
    render() {
        const dropdownTheme = {
            btn: Styles.btnShare,
            outer: Styles.ToolsPanel,
            inner: Styles.dropdownInner,
            icon: "settings"
        };
        const { t } = this.props;
        return (React.createElement(MenuPanel, { theme: dropdownTheme, btnText: t("toolsPanel.btnText"), viewState: this.props.viewState, btnTitle: t("toolsPanel.btnTitle"), onOpenChanged: this.onOpenChanged, isOpen: this.state.isOpen, smallScreen: this.props.viewState.useSmallScreenInterface },
            React.createElement(If, { condition: this.state.isOpen },
                React.createElement("div", { className: DropdownStyles.section },
                    React.createElement("div", { className: Styles.this },
                        React.createElement(CountDatasets, { terria: this.props.terria, viewState: this.props.viewState, updateResults: this.updateResults })))),
            React.createElement("div", { className: Styles.results },
                React.createElement("div", { dangerouslySetInnerHTML: { __html: this.state.resultsMessage } }))));
    }
});
export default withTranslation()(ToolsPanel);
//# sourceMappingURL=ToolsPanel.js.map