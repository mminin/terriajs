import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import Box, { BoxSpan } from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { GLYPHS, StyledIcon } from "../../Styled/Icon";
export const Frame = observer((props) => {
    const theme = useTheme();
    const [t] = useTranslation();
    const [showChildren, setShowChildren] = useState(true);
    const { viewState } = props;
    return (React.createElement(Wrapper, { isMapFullScreen: viewState.isMapFullScreen },
        React.createElement(Toggle, { paddedVertically: true, paddedHorizontally: 2, centered: true, justifySpaceBetween: true, backgroundColor: theme.toolPrimaryColor },
            React.createElement(Title, { title: props.title, icon: GLYPHS.search }),
            React.createElement(Box, { centered: true, css: "margin-right:-5px;" },
                React.createElement(ToolCloseButton, { viewState: viewState, t: t }),
                React.createElement(Spacing, { right: 4 }),
                React.createElement(RawButton, { onClick: () => setShowChildren(!showChildren) },
                    React.createElement(BoxSpan, { paddedRatio: 1, centered: true },
                        React.createElement(StyledIcon, { styledWidth: "12px", light: true, glyph: showChildren ? GLYPHS.opened : GLYPHS.closed }))))),
        showChildren && props.children));
});
export const Main = styled(Text) `
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow-y: auto;
  ${({ theme }) => theme.borderRadiusBottom(theme.radius40Button)}
  background-color: ${(p) => p.theme.darkWithOverlay};
  min-height: 350px;
`;
const Wrapper = styled(Box).attrs({
    column: true,
    position: "absolute",
    styledWidth: "340px"
    // charcoalGreyBg: true
}) `
  top: 70px;
  left: 0px;
  min-height: 220px;
  // background: ${(p) => p.theme.dark};
  margin-left: ${(props) => props.isMapFullScreen ? 16 : parseInt(props.theme.workbenchWidth) + 40}px;
  transition: margin-left 0.25s;
`;
const Toggle = styled(Box) `
  ${({ theme }) => theme.borderRadiusTop(theme.radius40Button)}
`;
const ToolCloseButton = (props) => {
    return (React.createElement(RawButton, { onClick: () => props.viewState.closeTool() },
        React.createElement(Text, { textLight: true, small: true, semiBold: true, uppercase: true }, props.t("tool.exitBtnTitle"))));
};
const Title = (props) => {
    return (React.createElement(Box, { centered: true },
        React.createElement(Box, null, props.icon && (React.createElement(StyledIcon, { styledWidth: "20px", light: true, glyph: props.icon }))),
        React.createElement(Spacing, { right: 1 }),
        React.createElement(TitleText, { textLight: true, semiBold: true, 
            // font-size is non standard with what we have so far in terria,
            // lineheight as well to hit nonstandard paddings
            styledFontSize: "17px", styledLineHeight: "30px", overflowEllipsis: true, overflowHide: true, noWrap: true }, props.title)));
};
const TitleText = styled(Text) `
  flex-grow: 2;
  max-width: 220px;
`;
//# sourceMappingURL=ToolModal.js.map