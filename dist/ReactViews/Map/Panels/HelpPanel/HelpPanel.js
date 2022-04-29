var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { runInAction } from "mobx";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Icon, { StyledIcon } from "../../../../Styled/Icon";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import Box from "../../../../Styled/Box";
import parseCustomMarkdownToReact from "../../../Custom/parseCustomMarkdownToReact";
import HelpPanelItem from "./HelpPanelItem";
import Button, { RawButton } from "../../../../Styled/Button";
import { Category, HelpAction } from "../../../../Core/AnalyticEvents/analyticEvents";
export const HELP_PANEL_ID = "help";
let HelpPanel = class HelpPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnimatingOpen: true
        };
    }
    componentDidMount() {
        // The animation timing is controlled in the CSS so the timeout can be 0 here.
        setTimeout(() => this.setState({ isAnimatingOpen: false }), 0);
    }
    render() {
        const { t } = this.props;
        const helpItems = this.props.terria.configParameters.helpContent;
        const isExpanded = this.props.viewState.helpPanelExpanded;
        const isAnimatingOpen = this.state.isAnimatingOpen;
        return (React.createElement(Box, { displayInlineBlock: true, backgroundColor: this.props.theme.textLight, styledWidth: "320px", fullHeight: true, onClick: () => this.props.viewState.setTopElement("HelpPanel"), css: `
          position: fixed;
          z-index: ${this.props.viewState.topElement === "HelpPanel"
                ? 99999
                : 110};
          transition: right 0.25s;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          right: ${isAnimatingOpen ? -320 : isExpanded ? 490 : 0}px;
        ` },
            React.createElement(Box, { position: "absolute", paddedRatio: 3, topRight: true },
                React.createElement(RawButton, { onClick: () => this.props.viewState.hideHelpPanel() },
                    React.createElement(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textDark, opacity: "0.5", glyph: Icon.GLYPHS.closeLight }))),
            React.createElement(Box, { centered: true, paddedHorizontally: 5, paddedVertically: 17, displayInlineBlock: true, css: `
            direction: ltr;
            min-width: 295px;
            padding-bottom: 0px;
          ` },
                React.createElement(Text, { extraBold: true, heading: true, textDark: true }, t("helpPanel.menuPaneTitle")),
                React.createElement(Spacing, { bottom: 4 }),
                React.createElement(Text, { medium: true, textDark: true, highlightLinks: true }, parseCustomMarkdownToReact(t("helpPanel.menuPaneBody", {
                    supportEmail: this.props.terria.supportEmail
                }))),
                React.createElement(Spacing, { bottom: 5 }),
                React.createElement(Box, { centered: true },
                    React.createElement(Button, { primary: true, rounded: true, styledMinWidth: "240px", onClick: () => {
                            var _a;
                            (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.help, HelpAction.takeTour);
                            runInAction(() => {
                                this.props.viewState.hideHelpPanel();
                                this.props.viewState.setTourIndex(0);
                            });
                        }, renderIcon: () => (React.createElement(StyledIcon, { light: true, styledWidth: "18px", glyph: Icon.GLYPHS.tour })), textProps: {
                            large: true
                        }, css: `
                ${p => p.theme.addTerriaPrimaryBtnStyles(p)}
              ` }, t("helpPanel.takeTour")))),
            React.createElement(Spacing, { bottom: 10 }),
            React.createElement(Box, { centered: true, displayInlineBlock: true, fullWidth: true, styledPadding: "0 26px" }, helpItems && (React.createElement(For, { each: "item", index: "i", of: helpItems },
                React.createElement(HelpPanelItem, { key: i, terria: this.props.terria, viewState: this.props.viewState, content: item }))))));
    }
};
HelpPanel.displayName = "HelpPanel";
HelpPanel.propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
};
HelpPanel = __decorate([
    observer
], HelpPanel);
export default withTranslation()(withTheme(HelpPanel));
//# sourceMappingURL=HelpPanel.js.map