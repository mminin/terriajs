import React from "react";
import parseCustomHtmlToReact from "../../Custom/parseCustomHtmlToReact";
import styled from "styled-components";
import Box from "../../../Styled/Box";
import Text from "../../../Styled/Text";
const StoryContainer = styled(Box).attrs((props) => ({
    paddedVertically: props.isCollapsed ? 0 : 2,
    scroll: true
})) `
  padding-top: 0;
  max-height: ${(props) => (props.isCollapsed ? 0 : "100px")};
  @media (min-height: 700px) {
    max-height: ${(props) => (props.isCollapsed ? 0 : "200px")};
  }
  @media (min-height: 900px) {
    max-height: ${(props) => (props.isCollapsed ? 0 : "400px")};
  }

  overflow-y: auto;

  transition: max-height 0.2s, padding 0.2s;

  img {
    max-width: 100%;
  }
  * {
    max-width: 100%;
    //These are technically the same, but use both
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    // This is the dangerous one in WebKit, as it breaks things wherever
    word-break: break-all;
    // Instead use this non-standard one:
    word-break: break-word;

    // Adds a hyphen where the word breaks, if supported (No Blink)
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }
`;
const StoryBody = ({ isCollapsed, story }) => (React.createElement(React.Fragment, null, story.text && story.text !== "" ? (React.createElement(StoryContainer, { isCollapsed: isCollapsed, column: true },
    React.createElement(Text, { css: `
            display: flex;
            flex-direction: column;
            gap: 5px;
          `, medium: true }, parseCustomHtmlToReact(story.text, {
        showExternalLinkWarning: true
    })))) : null));
export default StoryBody;
//# sourceMappingURL=StoryBody.js.map