import React from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import createReactClass from "create-react-class";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Box, { BoxSpan } from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import { TextSpan } from "../../Styled/Text";
import Hr from "../../Styled/Hr";
import Spacing, { SpacingSpan } from "../../Styled/Spacing";
import highlightKeyword from "../ReactViewHelpers/highlightKeyword";
// Not sure how to generalise this or if it should be kept in stlyed/Button.jsx
// Initially had this as border bottom on the button, but need a HR given it's not a full width border
// // ${p => !p.isLastResult && `border-bottom: 1px solid ${p.theme.greyLighter};`}
const RawButtonAndHighlight = styled(RawButton) `
  ${p => `
  &:hover, &:focus {
    background-color: ${p.theme.greyLighter};
    ${StyledIcon} {
      fill-opacity: 1;
    }
  }`}
`;
// A Location item when doing Bing map searvh or Gazetter search
export const SearchResult = createReactClass({
    propTypes: {
        name: PropTypes.string.isRequired,
        clickAction: PropTypes.func.isRequired,
        isLastResult: PropTypes.bool,
        locationSearchText: PropTypes.string,
        icon: PropTypes.string,
        theme: PropTypes.object,
        searchResultTheme: PropTypes.string
    },
    getDefaultProps() {
        return {
            icon: false,
            searchResultTheme: "light"
        };
    },
    render() {
        const { searchResultTheme, theme, name, locationSearchText, icon
        // isLastResult
         } = this.props;
        const isDarkTheme = searchResultTheme === "dark";
        const isLightTheme = searchResultTheme === "light";
        const highlightedResultName = highlightKeyword(name, locationSearchText);
        return (React.createElement("li", null,
            React.createElement(Box, { fullWidth: true, column: true },
                React.createElement(RawButtonAndHighlight, { type: "button", onClick: this.props.clickAction, fullWidth: true },
                    React.createElement(BoxSpan, null,
                        React.createElement(SpacingSpan, { right: 2 }),
                        React.createElement(Hr, { size: 1, fullWidth: true, borderBottomColor: theme.greyLighter }),
                        React.createElement(SpacingSpan, { right: 2 })),
                    React.createElement(TextSpan, { breakWord: true, large: true, 
                        // (You need light text on a dark theme, and vice versa)
                        textLight: isDarkTheme, textDark: isLightTheme },
                        React.createElement(BoxSpan, { paddedRatio: 2, paddedVertically: 3, centered: true, justifySpaceBetween: true },
                            icon && (React.createElement(StyledIcon
                            // (You need light text on a dark theme, and vice versa)
                            , { 
                                // (You need light text on a dark theme, and vice versa)
                                fillColor: isLightTheme ? theme.textDarker : false, light: isDarkTheme, styledWidth: "16px", glyph: Icon.GLYPHS[icon] })),
                            React.createElement(Spacing, { right: 2 }),
                            React.createElement(BoxSpan, { fullWidth: true },
                                React.createElement(TextSpan, { noFontSize: true, textAlignLeft: true }, highlightedResultName)),
                            React.createElement(StyledIcon
                            // (You need light text on a dark theme, and vice versa)
                            , { 
                                // (You need light text on a dark theme, and vice versa)
                                fillColor: isLightTheme ? theme.textDarker : false, light: isDarkTheme, styledWidth: "14px", css: "fill-opacity:0;", glyph: Icon.GLYPHS.right2 })))))));
    }
});
export default withTheme(SearchResult);
//# sourceMappingURL=SearchResult.js.map