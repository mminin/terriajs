/**
 * TourPortal.jsx
 * Framework for tour
 *
 * Not a real "portal" in the sense of a react portal, even though it
 * started out as wanting to be that. Our not-yet-invented "new modal system"
 * will probably utilise a react portal, though.
 *
 * TODO: loop through configparameters for ability to customise at runtime
 * , then add docs for customisation
 */
import { autorun } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme, withTheme } from "styled-components";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import Caret from "../Generic/Caret";
import CloseButton from "../Generic/CloseButton";
import { useWindowSize } from "../Hooks/useWindowSize";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
import { applyTranslationIfExists } from "./../../Language/languageHelpers";
import { calculateLeftPosition, calculateTopPosition, getOffsetsFromTourPoint } from "./tour-helpers.ts";
import TourExplanationBox, { TourExplanationBoxZIndex } from "./TourExplanationBox.jsx";
import TourIndicator from "./TourIndicator.jsx";
import TourOverlay from "./TourOverlay.jsx";
import TourPrefaceBox from "./TourPrefaceBox.jsx";
import TourProgressDot from "./TourProgressDot.jsx";
/**
 * Indicator bar/"dots" on progress of tour.
 * Fill in indicator dot depending on progress determined from count & max count
 */
const TourProgress = ({ max, step, setTourIndex }) => {
    const countArray = Array.from(Array(max).keys()).map((e) => e++);
    const countStep = step;
    return (React.createElement(Box, { centered: true }, countArray.map((count) => {
        return (React.createElement(TourProgressDot, { onClick: () => setTourIndex(count), key: count, active: count < countStep }));
    })));
};
TourProgress.propTypes = {
    setTourIndex: PropTypes.func.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired
};
export const TourExplanation = ({ topStyle, leftStyle, caretOffsetTop, caretOffsetLeft, indicatorOffsetTop, indicatorOffsetLeft, setTourIndex, onTourIndicatorClick, onPrevious, onNext, onSkip, currentStep, maxSteps, active, isFirstTourPoint, isLastTourPoint, children }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    if (!active) {
        // Tour explanation requires the various positioning even if only just
        // showing the "tour indicator" button, as it is offset against the caret
        // which is offset against the original box
        return (React.createElement(Box, { position: "absolute", style: {
                zIndex: TourExplanationBoxZIndex - 1,
                top: topStyle,
                left: leftStyle
            } },
            React.createElement(Box, { position: "absolute", style: {
                    top: `${caretOffsetTop}px`,
                    left: `${caretOffsetLeft}px`
                } },
                React.createElement(TourIndicator, { onClick: onTourIndicatorClick, style: {
                        top: `${indicatorOffsetTop}px`,
                        left: `${indicatorOffsetLeft}px`
                    } }))));
    }
    return (React.createElement(TourExplanationBox, { paddedRatio: 3, column: true, style: {
            top: topStyle,
            left: leftStyle
        } },
        React.createElement(CloseButton, { color: theme.darkWithOverlay, topRight: true, onClick: () => onSkip === null || onSkip === void 0 ? void 0 : onSkip() }),
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Caret, { style: {
                top: `${caretOffsetTop}px`,
                left: `${caretOffsetLeft}px`
            } }),
        React.createElement(Text, { light: true, medium: true, textDarker: true },
            React.createElement(Text, { light: true, medium: true, noFontSize: true, textDarker: true }, children),
            React.createElement(Spacing, { bottom: 3 }),
            React.createElement(Box, { centered: true, justifySpaceBetween: true },
                React.createElement(TourProgress, { setTourIndex: setTourIndex, step: currentStep, max: maxSteps }),
                React.createElement(Box, { centered: true },
                    !isFirstTourPoint && (React.createElement(React.Fragment, null,
                        React.createElement(Button, { secondary: true, shortMinHeight: true, onClick: () => onPrevious === null || onPrevious === void 0 ? void 0 : onPrevious() }, t("general.back")),
                        React.createElement(Spacing, { right: 2 }))),
                    isLastTourPoint ? (React.createElement(Button, { primary: true, shortMinHeight: true, onClick: () => onSkip === null || onSkip === void 0 ? void 0 : onSkip() }, t("tour.finish"))) : (React.createElement(Button, { primary: true, shortMinHeight: true, onClick: () => onNext === null || onNext === void 0 ? void 0 : onNext() }, t("general.next"))))))));
};
TourExplanation.propTypes = {
    children: PropTypes.node.isRequired,
    currentStep: PropTypes.number.isRequired,
    maxSteps: PropTypes.number.isRequired,
    caretOffsetTop: PropTypes.number,
    caretOffsetLeft: PropTypes.number,
    indicatorOffsetTop: PropTypes.number,
    indicatorOffsetLeft: PropTypes.number,
    setTourIndex: PropTypes.func.isRequired,
    onTourIndicatorClick: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
    topStyle: PropTypes.string,
    leftStyle: PropTypes.string,
    isFirstTourPoint: PropTypes.bool.isRequired,
    isLastTourPoint: PropTypes.bool.isRequired,
    active: PropTypes.bool
};
const TourGrouping = observer(({ tourPoints }) => {
    var _a, _b;
    const { i18n } = useTranslation();
    const viewState = useViewState();
    const currentTourPoint = tourPoints[viewState.currentTourIndex];
    const currentTourPointRef = viewState.appRefs.get(currentTourPoint === null || currentTourPoint === void 0 ? void 0 : currentTourPoint.appRefName);
    const currentRectangle = (_b = (_a = currentTourPointRef === null || currentTourPointRef === void 0 ? void 0 : currentTourPointRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (!currentRectangle) {
        console.log("Tried to show guidance portal with no rectangle available from ref");
    }
    return (React.createElement(React.Fragment, null,
        currentRectangle && (React.createElement(TourOverlay, { rectangle: currentRectangle, onCancel: () => viewState.nextTourPoint() })),
        tourPoints.map((tourPoint, index) => {
            var _a, _b;
            const tourPointRef = viewState.appRefs.get(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.appRefName);
            const currentRectangle = (_b = (_a = tourPointRef === null || tourPointRef === void 0 ? void 0 : tourPointRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(_a);
            const { offsetTop, offsetLeft, caretOffsetTop, caretOffsetLeft, indicatorOffsetTop, indicatorOffsetLeft } = getOffsetsFromTourPoint(tourPoint);
            // To match old HelpScreenWindow / HelpOverlay API
            const currentScreen = {
                rectangle: currentRectangle,
                positionTop: (tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.positionTop) || viewState.relativePosition.RECT_BOTTOM,
                positionLeft: (tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.positionLeft) || viewState.relativePosition.RECT_LEFT,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft
            };
            const positionLeft = calculateLeftPosition(currentScreen);
            const positionTop = calculateTopPosition(currentScreen);
            const currentTourIndex = viewState.currentTourIndex;
            const maxSteps = tourPoints.length;
            if (!tourPoint)
                return null;
            return (React.createElement(TourExplanation, { key: tourPoint.appRefName, active: currentTourIndex === index, currentStep: currentTourIndex + 1, maxSteps: maxSteps, setTourIndex: (idx) => viewState.setTourIndex(idx), onTourIndicatorClick: () => viewState.setTourIndex(index), onPrevious: () => viewState.previousTourPoint(), onNext: () => viewState.nextTourPoint(), onSkip: () => viewState.closeTour(), isFirstTourPoint: index === 0, isLastTourPoint: index === tourPoints.length - 1, topStyle: `${positionTop}px`, leftStyle: `${positionLeft}px`, caretOffsetTop: caretOffsetTop, caretOffsetLeft: caretOffsetLeft, indicatorOffsetTop: indicatorOffsetTop, indicatorOffsetLeft: indicatorOffsetLeft }, parseCustomMarkdownToReactWithOptions(applyTranslationIfExists(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.content, i18n), {
                injectTermsAsTooltips: true,
                tooltipTerms: viewState.terria.configParameters.helpContentTerms
            })));
        })));
});
export const TourPreface = () => {
    const { t } = useTranslation();
    const viewState = useViewState();
    const theme = useTheme();
    return (React.createElement(React.Fragment, null,
        React.createElement(TourPrefaceBox, { onClick: () => viewState.closeTour(), role: "presentation", "aria-hidden": "true", pseudoBg: true }),
        React.createElement(TourExplanationBox, { longer: true, paddedRatio: 4, column: true, style: {
                right: 25,
                bottom: 45
            } },
            React.createElement(CloseButton, { color: theme.darkWithOverlay, 
                // color={"green"}
                topRight: true, onClick: () => viewState.closeTour() }),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Text, { extraExtraLarge: true, bold: true, textDarker: true }, t("tour.preface.title")),
            React.createElement(Spacing, { bottom: 3 }),
            React.createElement(Text, { light: true, medium: true, textDarker: true }, t("tour.preface.content")),
            React.createElement(Spacing, { bottom: 4 }),
            React.createElement(Text, { medium: true },
                React.createElement(Box, null,
                    React.createElement(Button, { fullWidth: true, secondary: true, onClick: (e) => {
                            e.stopPropagation();
                            viewState.closeTour();
                        } }, t("tour.preface.close")),
                    React.createElement(Spacing, { right: 3 }),
                    React.createElement(Button, { primary: true, fullWidth: true, textProps: { noFontSize: true }, onClick: (e) => {
                            e.stopPropagation();
                            viewState.setShowTour(true);
                        } }, t("tour.preface.start")))),
            React.createElement(Spacing, { bottom: 1 }))));
};
export const TourPortalDisplayName = "TourPortal";
export const TourPortal = observer(() => {
    const viewState = useViewState();
    const showPortal = viewState.currentTourIndex !== -1;
    const showPreface = showPortal && !viewState.showTour;
    // should we bump up the debounce here? feels like 16ms is quite aggressive
    // and almost to the point of not debouncing at all, but the render logic
    // is quite cheap so it makes for a better resizing/zooming experience
    const width = useWindowSize({ debounceOverride: 16 });
    useEffect(() => autorun(() => {
        if (showPortal && viewState.topElement !== TourPortalDisplayName) {
            viewState.setTopElement(TourPortalDisplayName);
        }
    }));
    if (viewState.useSmallScreenInterface || !showPortal) {
        return null;
    }
    if (showPreface) {
        return React.createElement(TourPreface, { viewState: viewState });
    }
    return (React.createElement(TourGrouping, { key: width, viewState: viewState, tourPoints: viewState.tourPointsWithValidRefs }));
});
TourPortal.propTypes = {
    children: PropTypes.node
};
export default withTheme(TourPortal);
//# sourceMappingURL=TourPortal.js.map