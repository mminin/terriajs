/**
 * Prompt.tsx - don't use without guarding on useSmallScreenInterface - it won't look pretty!
 */
import React, { useState } from "react";
import { useTheme } from "styled-components";
import FadeIn from "../Transitions/FadeIn/FadeIn";
import SlideUpFadeIn from "../Transitions/SlideUpFadeIn/SlideUpFadeIn";
const TourExplanationBox = require("../Tour/TourExplanationBox").default;
const TourPrefaceBox = require("../Tour/TourPrefaceBox").default;
import CloseButton from "../Generic/CloseButton";
import Text from "../../Styled/Text";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
export const HelpPrompt = ({ title, content, dismissLabel, acceptLabel, onDismiss, onAccept, isVisible }) => {
    const theme = useTheme();
    // This is required so we can do nested animations
    const [childrenVisible, setChildrenVisible] = useState(isVisible);
    return (React.createElement(FadeIn, { isVisible: isVisible, onEnter: () => setChildrenVisible(true), transitionProps: {
            onExiting: () => setChildrenVisible(false)
        } },
        React.createElement(Box, { fullWidth: true, fullHeight: true, position: "absolute", css: `
          z-index: ${(p) => Number(p.theme.frontComponentZIndex) + 100};
        ` },
            React.createElement(TourPrefaceBox, { onClick: onDismiss, role: "presentation", "aria-hidden": "true", pseudoBg: true }),
            React.createElement(SlideUpFadeIn, { isVisible: childrenVisible },
                React.createElement(TourExplanationBox, { longer: true, paddedRatio: 4, column: true, style: {
                        right: 25,
                        bottom: 45
                    } },
                    React.createElement(CloseButton, { color: theme.darkWithOverlay, topRight: true, onClick: () => onDismiss() }),
                    React.createElement(Spacing, { bottom: 2 }),
                    React.createElement(Text, { extraExtraLarge: true, bold: true, textDarker: true }, title),
                    React.createElement(Spacing, { bottom: 3 }),
                    React.createElement(Text, { light: true, medium: true, textDarker: true }, content),
                    React.createElement(Spacing, { bottom: 4 }),
                    React.createElement(Text, { medium: true },
                        React.createElement(Box, { centered: true },
                            React.createElement(Button, { secondary: true, fullWidth: true, shortMinHeight: true, onClick: (e) => {
                                    e.stopPropagation();
                                    onDismiss();
                                } }, dismissLabel),
                            React.createElement(Spacing, { right: 3 }),
                            React.createElement(Button, { primary: true, fullWidth: true, shortMinHeight: true, textProps: { noFontSize: true }, onClick: (e) => {
                                    e.stopPropagation();
                                    onAccept();
                                } }, acceptLabel))),
                    React.createElement(Spacing, { bottom: 1 }))))));
};
export default HelpPrompt;
//# sourceMappingURL=HelpPrompt.js.map