var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Box from "../Styled/Box";
import Text from "../Styled/Text";
import Spacing from "../Styled/Spacing";
// if we must use a placeholder image,
// do not bundle in the full res `wwwroot/images/bing-aerial-labels-wide.png`
// image as it's a 1.4mb png
// import bingAerialBackground from "../../wwwroot/images/bing-aerial-labels-wide-low-quality.jpg";
import styled from "styled-components";
import parseCustomMarkdownToReact from "./Custom/parseCustomMarkdownToReact";
import Button from "../Styled/Button";
import FadeIn from "./Transitions/FadeIn/FadeIn";
const TopElementBox = styled(Box) `
  z-index: 99999;
  top: 0;
  right: 0;
`;
// background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
//   url(${bingAerialBackground});
const BackgroundImage = styled(Box) `
  background: rgba(0, 0, 0, 0.75);
  // background-size: cover;
  // background-repeat: no-repeat;
  // background-position: center;
  // filter: blur(10px);
  z-index: 0;
`;
const DisclaimerButton = styled(Button).attrs({
    textProps: {
        semiBold: true
    },
    rounded: true
}) `
  width: ${props => (props.fullWidth ? "100%" : "280px")};
`;
let Disclaimer = class Disclaimer extends React.Component {
    constructor(props) {
        super(props);
    }
    confirm(confirmCallbackFn) {
        if (confirmCallbackFn) {
            confirmCallbackFn();
        }
        this.props.viewState.hideDisclaimer();
    }
    deny(denyCallbackFn) {
        if (denyCallbackFn) {
            denyCallbackFn();
        }
        // Otherwise, do nothing for now?
    }
    render() {
        const disclaimer = this.props.viewState.disclaimerSettings;
        const disclaimerTitle = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.title) || "Disclaimer";
        const disclaimerConfirm = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.confirmText) || "Ok";
        const disclaimerDeny = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.denyText) || "Cancel";
        const disclaimerMessage = (disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.message) || "Disclaimer text goes here";
        const useSmallScreenInterface = this.props.viewState
            .useSmallScreenInterface;
        const renderDenyButton = !!(disclaimer === null || disclaimer === void 0 ? void 0 : disclaimer.denyAction);
        return disclaimer ? (React.createElement(FadeIn, { isVisible: this.props.viewState.disclaimerVisible },
            React.createElement(TopElementBox, { position: "absolute", fullWidth: true, fullHeight: true, centered: true },
                React.createElement(BackgroundImage
                // // Make the image slightly larger to deal with
                // // image shrinking a tad bit when blurred
                // styledWidth={"110%"}
                // styledHeight={"110%"}
                , { 
                    // // Make the image slightly larger to deal with
                    // // image shrinking a tad bit when blurred
                    // styledWidth={"110%"}
                    // styledHeight={"110%"}
                    fullWidth: true, fullHeight: true, position: "absolute" }),
                React.createElement(Box, { displayInlineBlock: true, left: true, styledWidth: useSmallScreenInterface ? "100%" : "613px", paddedRatio: 4, css: `
              max-height: 100%;
              overflow: auto;
            ` },
                    React.createElement(Text, { styledFontSize: "18px", styledLineHeight: "24px", bold: true, textLight: true }, disclaimerTitle),
                    React.createElement(Spacing, { bottom: 4 }),
                    React.createElement(Text, { styledLineHeight: "18px", textLight: true, css: props => `
                // not sure of the ideal way to deal with this
                a {
                  font-weight: 600;
                  color: ${props.theme.colorPrimary};
                  text-decoration: none;
                }
              ` }, parseCustomMarkdownToReact(disclaimerMessage)),
                    React.createElement(Spacing, { bottom: 5 }),
                    React.createElement(Box, { fullWidth: true, centered: true, displayInlineBlock: useSmallScreenInterface },
                        renderDenyButton && (React.createElement(DisclaimerButton, { denyButton: true, onClick: () => this.deny(disclaimer.denyAction), fullWidth: useSmallScreenInterface }, disclaimerDeny)),
                        React.createElement(Choose, null,
                            React.createElement(When, { condition: useSmallScreenInterface },
                                React.createElement(Spacing, { bottom: 3 })),
                            React.createElement(Otherwise, null,
                                React.createElement(Spacing, { right: 3 }))),
                        React.createElement(DisclaimerButton, { onClick: () => this.confirm(disclaimer.confirmAction), fullWidth: useSmallScreenInterface || !renderDenyButton, primary: true }, disclaimerConfirm)))))) : null;
    }
};
Disclaimer.displayName = "Disclaimer";
Disclaimer.propTypes = {
    viewState: PropTypes.object,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
};
Disclaimer = __decorate([
    observer
], Disclaimer);
export default withTranslation()(withTheme(Disclaimer));
//# sourceMappingURL=Disclaimer.js.map