import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import Box from "../../../../Styled/Box";
import styled from "styled-components";
import { useTranslationIfExists } from "../../../../Language/languageHelpers";
import { parseCustomMarkdownToReactWithOptions } from "../../../Custom/parseCustomMarkdownToReact";
const Numbers = styled(Text) `
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  background-color: ${props => props.theme.textDarker};
`;
const renderOrderedList = function (contents) {
    return (React.createElement(For, { each: "content", index: "i", of: contents },
        React.createElement(Box, { key: i, paddedVertically: true },
            React.createElement(Box, { alignItemsFlexStart: true },
                React.createElement(Numbers, { textLight: true, textAlignCenter: true, darkBg: true }, i + 1),
                React.createElement(Spacing, { right: 3 })),
            React.createElement(Text, { medium: true, textDark: true }, content))));
};
export class StyledHtmlRaw extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { viewState, injectTooltips } = this.props;
        const styledTextProps = this.props.styledTextProps || {};
        const markdownToParse = useTranslationIfExists(this.props.markdown);
        const parsed = parseCustomMarkdownToReactWithOptions(markdownToParse, {
            injectTermsAsTooltips: injectTooltips,
            tooltipTerms: viewState.terria.configParameters.helpContentTerms
        });
        const content = Array.isArray(parsed.props.children)
            ? parsed.props.children
            : [parsed.props.children];
        return (React.createElement("div", null, (content === null || content === void 0 ? void 0 : content.map) && (React.createElement(For, { each: "item", index: "i", of: content }, item && (React.createElement(Choose, null,
            React.createElement(When, { condition: /(h[0-6]|p)/i.test(item.type) },
                React.createElement(Text, Object.assign({ as: item.type, key: i, textDark: true, medium: item.type === "p" }, styledTextProps), item.props.children)),
            React.createElement(When, { condition: item.type === "ol" },
                renderOrderedList(item.props.children.map(point => point.props.children)),
                React.createElement(Spacing, { bottom: 4 })),
            React.createElement(Otherwise, null,
                React.createElement(Text, Object.assign({ key: i, textDark: true, medium: true }, styledTextProps), item))))))));
    }
}
StyledHtmlRaw.displayName = "StyledHtml";
StyledHtmlRaw.propTypes = {
    markdown: PropTypes.string.isRequired,
    viewState: PropTypes.object.isRequired,
    theme: PropTypes.object,
    styledTextProps: PropTypes.object,
    injectTooltips: PropTypes.bool,
    t: PropTypes.func.isRequired
};
StyledHtmlRaw.defaultProps = {
    injectTooltips: true
};
export default withTranslation()(withTheme(observer(StyledHtmlRaw)));
//# sourceMappingURL=StyledHtml.js.map