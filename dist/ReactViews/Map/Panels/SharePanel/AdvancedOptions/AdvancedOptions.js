import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../../../../../Styled/Box";
import { RawButton } from "../../../../../Styled/Button";
import { GLYPHS, StyledIcon } from "../../../../../Styled/Icon";
import Spacing from "../../../../../Styled/Spacing";
import { TextSpan } from "../../../../../Styled/Text";
import { StyledHr } from "../StyledHr";
import Checkbox from "../../../../../Styled/Checkbox";
import { EmbedSection } from "./EmbedSection";
export const AdvancedOptions = ({ canShortenUrl, shouldShorten, includeStoryInShare, includeStoryInShareOnChange, shouldShortenOnChange, shareUrl }) => {
    const { t } = useTranslation();
    const [advancedOptions, setAdvancedOptions] = useState(false);
    const toogleAdvancedOptions = () => {
        setAdvancedOptions((prevState) => !prevState);
    };
    return (React.createElement(Box, { column: true },
        React.createElement(RawButton, { onClick: toogleAdvancedOptions, css: `
          display: flex;
          align-items: center;
        ` },
            React.createElement(TextSpan, { fullWidth: true, medium: true, css: `
            display: flex;
          ` }, t("share.btnAdvanced")),
            advancedOptions ? (React.createElement(AdvanceOptionsIcon, { glyph: GLYPHS.opened })) : (React.createElement(AdvanceOptionsIcon, { glyph: GLYPHS.closed }))),
        advancedOptions && (React.createElement(React.Fragment, null,
            React.createElement(StyledHr, null),
            React.createElement(Box, { column: true },
                React.createElement(Checkbox, { textProps: { medium: true }, id: "includeStory", title: "Include Story in Share", isChecked: includeStoryInShare, onChange: includeStoryInShareOnChange },
                    React.createElement(TextSpan, null, t("includeStory.message"))),
                React.createElement(Spacing, { bottom: 1 }),
                React.createElement(Checkbox, { textProps: { medium: true }, id: "shortenUrl", isChecked: shouldShorten, onChange: shouldShortenOnChange, isDisabled: !canShortenUrl },
                    React.createElement(TextSpan, null, t("share.shortenUsingService"))),
                React.createElement(Spacing, { bottom: 2 }),
                React.createElement(EmbedSection, { shareUrl: shareUrl === null || shareUrl === void 0 ? void 0 : shareUrl.current }))))));
};
const AdvanceOptionsIcon = styled(StyledIcon).attrs({
    styledWidth: "10px",
    light: true
}) ``;
//# sourceMappingURL=AdvancedOptions.js.map