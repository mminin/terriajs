"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import MenuPanel from "../StandardUserInterface/customizable/MenuPanel.jsx";
import Styles from "./help-panel.scss";
import DropdownStyles from "../Map/Panels/panel.scss";
import helpIcon from "../../../wwwroot/images/icons/help.svg";
import { withTranslation } from "react-i18next";
import { action } from "mobx";
import { observer } from "mobx-react";
let HelpMenuPanelBasic = class HelpMenuPanelBasic extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpen: false
        };
    }
    setShowHelpMenu(bool) {
        this.props.viewState.showHelpMenu = bool;
    }
    render() {
        const dropdownTheme = {
            btn: Styles.btnShare,
            outer: Styles.sharePanel,
            inner: Styles.dropdownInner,
            icon: helpIcon
        };
        const isOpen = this.props.viewState.showHelpMenu;
        const { t } = this.props;
        return (React.createElement(MenuPanel, { theme: dropdownTheme, btnText: t("helpMenu.btnText"), viewState: this.props.viewState, isOpen: isOpen, onDismissed: () => {
                this.setShowHelpMenu(false);
            }, btnTitle: t("helpMenu.btnTitle"), onOpenChanged: this.setShowHelpMenu, 
            // forceClosed={this.props.viewState.showSatelliteGuidance}
            smallScreen: this.props.viewState.useSmallScreenInterface },
            React.createElement(If, { condition: isOpen },
                React.createElement("div", { className: classNames(Styles.viewer, DropdownStyles.section) },
                    React.createElement("label", { className: DropdownStyles.heading }, t("helpMenu.helpMenuHeader")),
                    React.createElement("ul", { className: Styles.viewerSelector },
                        React.createElement("li", { className: Styles.listItem },
                            React.createElement("button", { onClick: action(() => {
                                    this.setShowHelpMenu(false);
                                    this.props.viewState.showWelcomeMessage = true;
                                    this.props.viewState.topElement = "WelcomeMessage";
                                }), className: Styles.btnViewer }, t("helpMenu.helpMenuOpenWelcome"))),
                        React.createElement("li", { className: Styles.listItem },
                            React.createElement("button", { onClick: action(() => {
                                    this.setShowHelpMenu(false);
                                    this.props.viewState.showSatelliteGuidance = true;
                                    this.props.viewState.topElement = "Guide";
                                }), className: Styles.btnViewer }, t("helpMenu.helpMenuSatelliteGuideTitle"))),
                        React.createElement("li", { className: Styles.listItem },
                            React.createElement("a", { target: "_blank", href: "./help/help.html", className: Styles.btnViewer }, t("helpMenu.helpMenuMoreHelpTitle"))))))));
    }
};
HelpMenuPanelBasic.propTypes = {
    viewState: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};
__decorate([
    action.bound
], HelpMenuPanelBasic.prototype, "setShowHelpMenu", null);
HelpMenuPanelBasic = __decorate([
    observer
], HelpMenuPanelBasic);
export default withTranslation()(HelpMenuPanelBasic);
//# sourceMappingURL=HelpMenuPanelBasic.js.map