import React from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import Box from "../../../Styled/Box";
import { RawButton } from "../../../Styled/Button";
import Icon from "../../../Styled/Icon";
import { StoryIcon } from "./StoryButtons";
import Text from "../../../Styled/Text";
const FooterButton = styled(RawButton) `
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 5px;
`;
const NavigationButton = styled(RawButton) `
  display: flex;
  align-items: center;
  flex: 1;
  padding: 15px 0;
  gap: 10px;
`;
const FooterBar = ({ goPrev, goNext, jumpToStory, zoomTo, currentHumanIndex, totalStories, listStories }) => {
    const isEnd = currentHumanIndex === totalStories;
    const { t } = useTranslation();
    const theme = useTheme();
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { flex: 1 }, totalStories > 1 && (React.createElement(NavigationButton, { disabled: currentHumanIndex == 1, onClick: goPrev },
            React.createElement(StoryIcon, { displayInline: true, styledWidth: "15px", fillColor: theme.grey, glyph: Icon.GLYPHS.left }),
            React.createElement(Text, { medium: true }, t("story.prev"))))),
        React.createElement(Box, { flex: 1, centered: true },
            React.createElement(FooterButton, { onClick: listStories },
                React.createElement(StoryIcon, { displayInline: true, styledWidth: "15px", glyph: Icon.GLYPHS.menu, fillColor: theme.grey })),
            React.createElement(Box, { paddedRatio: 3 },
                React.createElement(Text, { noWrap: true },
                    currentHumanIndex,
                    " / ",
                    totalStories)),
            React.createElement(FooterButton, { onClick: zoomTo, title: t("story.locationBtn") },
                React.createElement(StoryIcon, { styledWidth: "16px", glyph: Icon.GLYPHS.location }))),
        React.createElement(Box, { flex: 1, right: true }, totalStories > 1 && (React.createElement(NavigationButton, { css: `
              justify-content: flex-end;
            `, onClick: isEnd ? () => jumpToStory(0) : goNext }, isEnd ? (React.createElement(React.Fragment, null,
            React.createElement(Text, null, t("story.restart")),
            React.createElement(StoryIcon, { displayInline: true, styledWidth: "15px", glyph: Icon.GLYPHS.revert, fillColor: theme.grey }))) : (React.createElement(React.Fragment, null,
            React.createElement(Text, { medium: true }, t("story.next")),
            React.createElement(StoryIcon, { displayInline: true, styledWidth: "15px", glyph: Icon.GLYPHS.right, fillColor: theme.grey }))))))));
};
export default FooterBar;
//# sourceMappingURL=StoryFooterBar.js.map