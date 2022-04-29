/**
 * A generic Guide component, look at
 * `satellite-guidance.js` && `SatelliteGuide.jsx`
 * for example data / usage
 *
 * consume something like:

  <Guide
    hasIntroSlide
    // Use this as guide won't track viewstate
    isTopElement={viewState.topElement === "Guide"}
    terria={terria}
    guideKey={SATELLITE_GUIDE_KEY}
    guideData={SatelliteGuideData}
    showGuide={viewState.showSatelliteGuidance}
    setShowGuide={bool => {
      viewState.showSatelliteGuidance = bool;
      // If we're closing for any reason, set prompted to true
      if (!bool) {
        viewState.toggleFeaturePrompt("satelliteGuidance", true, true);
      }
    }}
  />

 *
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Styles from "./guide.scss";
// import createReactClass from "create-react-class";
// // import knockout from "terriajs-cesium/Source/ThirdParty/knockout";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { useTranslation } from "react-i18next";
import Button from "../../Styled/Button";
import Box from "../../Styled/Box";
import { Category, GuideAction } from "../../Core/AnalyticEvents/analyticEvents";
const GuideProgress = props => {
    // doesn't work for IE11
    // const countArray = Array.from(Array(props.maxStepCount).keys()).map(e => e++);
    const countArray = [];
    for (let i = 0; i < props.maxStepCount; i++) {
        countArray.push(i);
    }
    const currentStep = props.currentStep;
    return (React.createElement("div", { className: Styles.indicatorWrapper }, countArray.map(count => {
        return (React.createElement("div", { key: count, className: classNames(Styles.indicator, {
                [Styles.indicatorEnabled]: count < currentStep
            }) }));
    })));
};
GuideProgress.propTypes = {
    maxStepCount: PropTypes.number.isRequired,
    currentStep: PropTypes.number.isRequired
};
export const analyticsSetShowGuide = (isOpen, index, guideKey, terria, options = {
    setCalledFromInside: false
}) => {
    var _a;
    const action = options.setCalledFromInside
        ? isOpen
            ? GuideAction.openInModal
            : GuideAction.closeInModal
        : isOpen
            ? GuideAction.open
            : GuideAction.close;
    (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.guide, action, `At index: ${index}, Guide: ${guideKey}`);
};
export const GuidePure = ({ terria, guideKey, hasIntroSlide = false, guideData, setShowGuide }) => {
    // Handle index locally for now (unless we do a "open guide at X point" in the future?)
    const [currentGuideIndex, setCurrentGuideIndex] = useState(0);
    const handlePrev = () => {
        var _a;
        const newIndex = currentGuideIndex - 1;
        (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.guide, GuideAction.navigatePrev, `New index: ${newIndex}, Guide: ${guideKey}`);
        if (currentGuideIndex === 0) {
            handleSetShowGuide(false);
        }
        else {
            setCurrentGuideIndex(newIndex);
        }
    };
    const handleNext = () => {
        var _a;
        const newIndex = currentGuideIndex + 1;
        if (guideData[newIndex]) {
            (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.guide, GuideAction.navigateNext, `New index: ${newIndex}, Guide: ${guideKey}`);
            setCurrentGuideIndex(newIndex);
        }
        else {
            handleSetShowGuide(false);
        }
    };
    const { t } = useTranslation();
    const handleSetShowGuide = bool => {
        analyticsSetShowGuide(bool, currentGuideIndex, guideKey, terria, {
            setCalledFromInside: true
        });
        setShowGuide(bool);
    };
    const currentGuide = guideData[currentGuideIndex] || {};
    const hidePrev = currentGuide.hidePrev || false;
    const hideNext = currentGuide.hideNext || false;
    const prevButtonText = currentGuide.prevText || t("general.prev");
    const nextButtonText = currentGuide.nextText || t("general.next");
    const maxStepCount = hasIntroSlide ? guideData.length - 1 : guideData.length;
    const currentStepCount = hasIntroSlide
        ? currentGuideIndex
        : currentGuideIndex + 1;
    return (React.createElement(Box, { displayInlineBlock: true },
        React.createElement(Box, { fullWidth: true, styledHeight: "254px", backgroundImage: currentGuide.imageSrc }),
        React.createElement(Spacing, { bottom: 5 }),
        React.createElement(Box, { paddedHorizontally: 1, displayInlineBlock: true },
            React.createElement(Text, { textDark: true, bold: true, subHeading: true }, currentGuide.title),
            React.createElement(Spacing, { bottom: 5 }),
            React.createElement(Box, { styledMinHeight: "100px", fullWidth: true },
                React.createElement(Text, { textDark: true, medium: true }, currentGuide.body)),
            React.createElement(Spacing, { bottom: 7 }),
            React.createElement(Box, null,
                React.createElement(Box, { css: `
              margin-right: auto;
            ` },
                    React.createElement(GuideProgress, { currentStep: currentStepCount, maxStepCount: maxStepCount })),
                !hidePrev && (React.createElement(Button, { secondary: true, onClick: () => handlePrev(), styledMinWidth: "94px" }, prevButtonText)),
                React.createElement(Spacing, { right: 2 }),
                React.createElement(Button, { primary: true, onClick: () => handleNext(), styledMinWidth: "94px", css: hideNext && `visibility: hidden;` }, nextButtonText)))));
};
GuidePure.propTypes = {
    terria: PropTypes.object.isRequired,
    guideKey: PropTypes.string.isRequired,
    guideData: PropTypes.array.isRequired,
    setShowGuide: PropTypes.func.isRequired,
    guideClassName: PropTypes.string,
    hasIntroSlide: PropTypes.bool
};
export default GuidePure;
//# sourceMappingURL=Guide.js.map