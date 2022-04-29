import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import { sortable } from "react-anything-sortable";
import classNames from "classnames";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Ul from "../../Styled/List";
import Text from "../../Styled/Text";
import Spacing from "../../Styled/Spacing";
import parseCustomHtmlToReact from "../Custom/parseCustomHtmlToReact";
import Icon, { StyledIcon } from "../../Styled/Icon";
const findTextContent = (content) => {
    if (typeof content === "string") {
        return content;
    }
    if (content[0] && content[0].props && content[0].props.children) {
        return findTextContent(content[0].props.children);
    }
    if (!content.props || !content.props.children) {
        return "";
    }
    if (typeof content.props.children === "string") {
        return content.props.children;
    }
    return findTextContent(content.props.children);
};
const StoryControl = styled(Box).attrs({
    centered: true,
    left: true,
    justifySpaceBetween: true
}) ``;
const StoryMenuButton = styled(RawButton) `
  color: ${props => props.theme.textDarker};
  background-color: ${props => props.theme.textLight};

  ${StyledIcon} {
    width: 35px;
  }

  svg {
    fill: ${props => props.theme.textDarker};
    width: 18px;
    height: 18px;
  }

  border-radius: 0;

  width: 114px;
  // ensure we support long strings
  min-height: 32px;
  display: block;

  &:hover,
  &:focus {
    color: ${props => props.theme.textLight};
    background-color: ${props => props.theme.colorPrimary};

    svg {
      fill: ${props => props.theme.textLight};
      stroke: ${props => props.theme.textLight};
    }
  }
`;
const hideList = (props) => props.closeMenu();
const getTruncatedContent = (text) => {
    const content = parseCustomHtmlToReact(text);
    const except = findTextContent(content);
    return except.slice(0, 100);
};
const toggleMenu = (props) => event => {
    event.stopPropagation();
    props.openMenu();
};
const viewStory = (props) => event => {
    event.stopPropagation();
    props.viewStory();
    hideList(props);
};
const deleteStory = (props) => event => {
    event.stopPropagation();
    props.deleteStory();
    hideList(props);
};
const editStory = (props) => event => {
    event.stopPropagation();
    props.editStory();
    hideList(props);
};
const recaptureStory = (props) => event => {
    event.stopPropagation();
    props.recaptureStory();
    hideList(props);
};
const calculateOffset = (props) => (storyRef) => {
    var _a, _b, _c;
    const offsetTop = ((_a = storyRef.current) === null || _a === void 0 ? void 0 : _a.offsetTop) || 0;
    const scrollTop = props.parentRef.current.scrollTop || 0;
    const heightParent = ((_c = (_b = storyRef.current) === null || _b === void 0 ? void 0 : _b.offsetParent) === null || _c === void 0 ? void 0 : _c.offsetHeight) || 0;
    const offsetTopScroll = offsetTop - scrollTop + 25;
    if (offsetTopScroll + 125 > heightParent) {
        return `bottom ${offsetTopScroll + 125 - heightParent + 45}px;`;
    }
    return `top: ${offsetTopScroll}px;`;
};
const renderMenu = (props) => {
    const { t } = props;
    return (React.createElement(Ul, null,
        React.createElement("li", null,
            React.createElement(StoryMenuButton, { onClick: viewStory(props), title: t("story.viewStory") },
                React.createElement(StoryControl, null,
                    React.createElement(StyledIcon, { glyph: Icon.GLYPHS.viewStory }),
                    React.createElement("span", null, t("story.view"))))),
        React.createElement("li", null,
            React.createElement(StoryMenuButton, { onClick: editStory(props), title: t("story.editStory") },
                React.createElement(StoryControl, null,
                    React.createElement(StyledIcon, { glyph: Icon.GLYPHS.editStory }),
                    React.createElement("span", null, t("story.edit"))))),
        React.createElement("li", null,
            React.createElement(StoryMenuButton, { onClick: recaptureStory(props), title: t("story.recaptureStory") },
                React.createElement(StoryControl, null,
                    React.createElement(StyledIcon, { glyph: Icon.GLYPHS.story }),
                    React.createElement("span", null, t("story.recapture"))))),
        React.createElement("li", null,
            React.createElement(StoryMenuButton, { onClick: deleteStory(props), title: t("story.deleteStory") },
                React.createElement(StoryControl, null,
                    React.createElement(StyledIcon, { glyph: Icon.GLYPHS.cancel }),
                    React.createElement("span", null, t("story.delete")))))));
};
const Story = (props) => {
    const story = props.story;
    const bodyText = getTruncatedContent(story.text);
    const theme = useTheme();
    const { t } = useTranslation();
    const storyRef = useRef(null);
    const closeHandler = () => {
        hideList(props);
    };
    useEffect(() => {
        window.addEventListener("click", closeHandler);
        return () => window.removeEventListener("click", closeHandler);
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { ref: storyRef, column: true, backgroundColor: theme.darkWithOverlay, rounded: true, css: `
          cursor: move;
          float: none !important;
        `, position: "static", style: props.style, className: classNames(props.className), onMouseDown: props.onMouseDown, onTouchStart: props.onTouchStart },
            React.createElement(Box, { fullWidth: true, position: "static", justifySpaceBetween: true, padded: true, verticalCenter: true, styledHeight: "40px", backgroundColor: theme.darkWithOverlay, rounded: true, css: `
            padding-left: 15px;
            padding-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          ` },
                React.createElement(Text, { textLight: true, medium: true }, story.title && story.title.length > 0
                    ? story.title
                    : t("story.untitledScene")),
                React.createElement(Box, null,
                    props.recaptureStorySuccessful && (React.createElement(RawButton, null,
                        React.createElement(StyledIcon, { styledWidth: "20px", light: true, glyph: Icon.GLYPHS.recapture, css: `
                    padding-right: 10px;
                  ` }))),
                    React.createElement(MenuButton, { theme: theme, onClick: toggleMenu(props) },
                        React.createElement(StyledIcon, { styledWidth: "20px", light: true, glyph: Icon.GLYPHS.menuDotted }))),
                props.menuOpen && (React.createElement(Box, { css: `
                position: absolute;
                z-index: 100;
                right: 20px;

                ${calculateOffset(props)(storyRef)}
                padding: 0;
                margin: 0;

                ul {
                  list-style: none;
                }
              ` }, renderMenu({ ...props, t })))),
            bodyText.length > 0 && (React.createElement(Box, { paddedRatio: 2, paddedHorizontally: 3 },
                React.createElement(Text, { textLight: true, medium: true }, bodyText)))),
        React.createElement(Spacing, { bottom: 1 })));
};
const MenuButton = styled(RawButton) `
  padding: 0 10px 0 10px;
  min-height: 40px;
  border-radius: ${props => props.theme.radiusLarge};
  background: transparent;

  &:hover,
  &:focus {
    opacity: 0.9;
    background-color: ${props => props.theme.dark};
  }
`;
export default sortable(Story);
//# sourceMappingURL=Story.js.map