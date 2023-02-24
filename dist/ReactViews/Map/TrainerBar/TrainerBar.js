import { observer } from "mobx-react";
import React from "react";
import { Translation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { PaneMode } from "../../../ReactViewModels/defaultHelpContent";
import Box from "../../../Styled/Box";
import Button, { RawButton } from "../../../Styled/Button";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
import Select from "../../../Styled/Select";
import Spacing from "../../../Styled/Spacing";
import Text, { TextSpan } from "../../../Styled/Text";
import measureElement from "../../HOCs/measureElement";
import { withViewState } from "../../StandardUserInterface/ViewStateContext";
import { applyTranslationIfExists } from "./../../../Language/languageHelpers";
const StyledHtml = require("../../Map/Panels/HelpPanel/StyledHtml").default;
const CloseButton = require("../../Generic/CloseButton").default;
const TrainerBarWrapper = styled(Box) `
  top: 0;
  left: ${(p) => (p.isMapFullScreen ? 0 : Number(p.theme.workbenchWidth))}px;
  z-index: ${(p) => Number(p.theme.frontComponentZIndex) + 100};
`;
// Help with discoverability
const BoxTrainerExpandedSteps = styled(Box) ``;
const getSelectedTrainerFromHelpContent = (viewState, helpContent) => {
    const selected = viewState.selectedTrainerItem;
    const found = helpContent.find((item) => item.itemName === selected);
    // Try and find the item that we selected, otherwise find the first trainer pane
    return (found || helpContent.find((item) => item.paneMode === PaneMode.trainer));
};
// Ripped from StyledHtml.jsx
const Numbers = styled(Text) `
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.textLight};
`;
const StepText = styled(Text).attrs({}) `
  ol,
  ul {
    padding: 0;
    margin: 0;
    // Dislike these arbitrary aligned numbers but leaving it in for now
    padding-left: 17px;
  }
  li {
    padding-left: 8px;
  }
`;
const renderStep = (step, number, viewState, options = {
    renderDescription: true,
    comfortable: false,
    footerComponent: undefined
}) => {
    var _a;
    return (React.createElement(Box, { key: number, paddedVertically: true },
        React.createElement(Box, { alignItemsFlexStart: true },
            React.createElement(Numbers, { textDarker: true, textAlignCenter: true, darkBg: true }, number),
            React.createElement(Spacing, { right: 3 })),
        React.createElement(Box, { column: true },
            React.createElement(Translation, null, (t, { i18n }) => (React.createElement(Text, { textLight: true, extraExtraLarge: true, semiBold: true }, applyTranslationIfExists(step.title, i18n)))),
            options.renderDescription && (step === null || step === void 0 ? void 0 : step.markdownDescription) && (React.createElement(React.Fragment, null,
                React.createElement(Spacing, { bottom: options.comfortable ? 2 : 1 }),
                React.createElement(StepText, { medium: true, textLightDimmed: true },
                    React.createElement(StyledHtml, { viewState: viewState, styledTextProps: { textDark: false, textLightDimmed: true }, markdown: step.markdownDescription })))), (_a = options.footerComponent) === null || _a === void 0 ? void 0 :
            _a.call(options))));
};
const renderOrderedStepList = function (steps, viewState) {
    return steps.map((step, index) => (React.createElement(React.Fragment, { key: index },
        renderStep(step, index + 1, viewState),
        index + 1 !== steps.length && React.createElement(Spacing, { bottom: 3 }))));
};
// Originally written as a SFC but measureElement only supports class components at the moment
class StepAccordionRaw extends React.Component {
    render() {
        const { viewState, selectedTrainerSteps, t, theme, selectedTrainer, isShowingAllSteps, setIsShowingAllSteps, isExpanded, setIsExpanded, heightFromMeasureElementHOC } = this.props;
        return (React.createElement(Box, { centered: !isExpanded, fullWidth: true, justifySpaceBetween: true },
            React.createElement(Box, { paddedHorizontally: 4, column: true, "aria-hidden": isExpanded, overflow: "hidden", css: `
            max-height: 64px;
            pointer-events: none;
          `, ref: (component) => {
                    if (!isExpanded)
                        this.refToMeasure = component;
                } }, renderStep(selectedTrainerSteps[viewState.currentTrainerStepIndex], viewState.currentTrainerStepIndex + 1, viewState, { renderDescription: false, comfortable: true })),
            isExpanded && (React.createElement(Box, { paddedHorizontally: 4, column: true, position: "absolute", fullWidth: true, css: `
              top: 0;
              padding-bottom: 20px;
              // This padding forces the absolutely positioned box to align with
              // the relative width in its clone
              padding-right: 60px;
            `, backgroundColor: theme.textBlack, ref: (component) => (this.refToMeasure = component) }, renderStep(selectedTrainerSteps[viewState.currentTrainerStepIndex], viewState.currentTrainerStepIndex + 1, viewState, {
                renderDescription: true,
                comfortable: true,
                footerComponent: () => (React.createElement(React.Fragment, null,
                    React.createElement(Spacing, { bottom: 3 }),
                    React.createElement(RawButton, { onClick: () => setIsShowingAllSteps(!isShowingAllSteps), title: isShowingAllSteps
                            ? t("trainer.hideAllSteps")
                            : t("trainer.showAllSteps") },
                        React.createElement(TextSpan, { medium: true, primary: true, isLink: true, textAlignLeft: true }, isShowingAllSteps
                            ? t("trainer.hideAllSteps")
                            : t("trainer.showAllSteps")))))
            }))),
            React.createElement(Box, { paddedHorizontally: 2 },
                React.createElement(RawButton, { onClick: () => setIsExpanded(!isExpanded), 
                    // onMouseOver={() => setIsPeeking(true)}
                    // onFocus={() => setIsPeeking(true)}
                    title: isExpanded
                        ? t("trainer.collapseTrainer")
                        : t("trainer.expandTrainer"), 
                    // onBlur={() => {
                    //   if (!isExpanded) setIsPeeking(false);
                    // }}
                    css: "z-index:2;" },
                    React.createElement(StyledIcon, { styledWidth: "26px", light: true, glyph: isExpanded ? GLYPHS.accordionClose : GLYPHS.accordionOpen }))),
            isShowingAllSteps && (React.createElement(BoxTrainerExpandedSteps, { column: true, position: "absolute", backgroundColor: theme.textBlack, fullWidth: true, paddedRatio: 4, overflowY: "auto", css: `
              // top: 32px;
              padding-bottom: 10px;
              top: ${heightFromMeasureElementHOC}px;
              max-height: calc(100vh - ${heightFromMeasureElementHOC}px - 20px);
            ` },
                renderOrderedStepList(selectedTrainerSteps, viewState),
                selectedTrainer.footnote ? (React.createElement(React.Fragment, null,
                    React.createElement(Spacing, { bottom: 3 }),
                    React.createElement(Text, { medium: true, textLightDimmed: true },
                        React.createElement(StyledHtml, { viewState: viewState, styledTextProps: { textDark: false, textLightDimmed: true }, markdown: selectedTrainer.footnote })))) : (React.createElement(Spacing, { bottom: 3 }))))));
    }
}
const StepAccordion = withTranslation()(withViewState(measureElement(StepAccordionRaw)));
export const TrainerBar = observer((props) => {
    const { i18n, t, theme, viewState } = props;
    const terria = viewState.terria;
    const { helpContent } = terria.configParameters;
    // All these null guards are because we are rendering based on nested
    // map-owner defined (helpContent)content which could be malformed
    if (!viewState.trainerBarVisible || !helpContent) {
        return null;
    }
    const selectedTrainer = getSelectedTrainerFromHelpContent(viewState, helpContent);
    const selectedTrainerItems = selectedTrainer === null || selectedTrainer === void 0 ? void 0 : selectedTrainer.trainerItems;
    if (!selectedTrainerItems) {
        return null;
    }
    const trainerItemIndex = viewState.currentTrainerItemIndex <= selectedTrainerItems.length
        ? viewState.currentTrainerItemIndex
        : 0;
    const selectedTrainerItem = selectedTrainerItems[trainerItemIndex];
    const selectedTrainerSteps = selectedTrainerItem === null || selectedTrainerItem === void 0 ? void 0 : selectedTrainerItem.steps;
    if (!selectedTrainerSteps) {
        return null;
    }
    const isMapFullScreen = viewState.isMapFullScreen;
    return (React.createElement(TrainerBarWrapper, { centered: true, position: "absolute", styledWidth: isMapFullScreen
            ? "100%"
            : `calc(100% - ${Number(theme.workbenchWidth)}px)`, isMapFullScreen: isMapFullScreen, onClick: () => viewState.setTopElement("TrainerBar") },
        React.createElement(Box, { fullWidth: true, fullHeight: true, centered: true, justifySpaceBetween: true, backgroundColor: theme.textBlack },
            React.createElement(Box, { css: "min-height: 64px;" },
                React.createElement(Select, { css: `
              // Overrides on normal select here as we are using a non-normal
              // nowhere-else-in-app usage of select
              width: 290px;
              @media (max-width: ${(p) => p.theme.lg}px) {
                width: 84px;
                // hack to effectively visually disable the current option
                // without minimising select click target
                color: transparent;
              }
            `, paddingForLeftIcon: "45px", leftIcon: () => (React.createElement(StyledIcon, { css: "padding-left:15px;", light: true, styledWidth: "21px", glyph: GLYPHS.oneTwoThree })), onChange: (e) => viewState.setCurrentTrainerItemIndex(Number(e.target.value)), value: viewState.currentTrainerItemIndex }, selectedTrainerItems.map((item, index) => (React.createElement("option", { key: item.title, value: index }, applyTranslationIfExists(item.title, i18n)))))),
            React.createElement(StepAccordion, { selectedTrainerSteps: selectedTrainerSteps, isShowingAllSteps: viewState.trainerBarShowingAllSteps, setIsShowingAllSteps: (bool) => viewState.setTrainerBarShowingAllSteps(bool), isExpanded: viewState.trainerBarExpanded, setIsExpanded: (bool) => viewState.setTrainerBarExpanded(bool), selectedTrainer: selectedTrainerItem, theme: theme }),
            React.createElement(Spacing, { right: 4 }),
            React.createElement(Box, null,
                React.createElement(Button, { secondary: true, shortMinHeight: true, css: `
              background: transparent;
              color: ${theme.textLight};
              border-color: ${theme.textLight};
              ${viewState.currentTrainerStepIndex === 0 &&
                        `visibility: hidden;`}
            `, onClick: () => {
                        viewState.setCurrentTrainerStepIndex(viewState.currentTrainerStepIndex - 1);
                    } }, t("general.back")),
                React.createElement(Spacing, { right: 2 }),
                React.createElement(Button, { primary: true, shortMinHeight: true, css: `
              ${viewState.currentTrainerStepIndex ===
                        selectedTrainerSteps.length - 1 && `visibility: hidden;`}
            `, onClick: () => {
                        viewState.setCurrentTrainerStepIndex(viewState.currentTrainerStepIndex + 1);
                    } }, t("general.next")),
                React.createElement(Spacing, { right: 5 }),
                React.createElement(Box, { centered: true },
                    React.createElement(CloseButton, { noAbsolute: true, 
                        // topRight
                        color: theme.textLight, onClick: () => viewState.setTrainerBarVisible(false) })),
                React.createElement(Spacing, { right: 6 })))));
});
export default withTranslation()(withViewState(withTheme(TrainerBar)));
//# sourceMappingURL=TrainerBar.js.map