import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../../../../../Styled/Box";
import { TextSpan } from "../../../../../Styled/Text";
import Input from "../../../../../Styled/Input";
export const EmbedSection = ({ shareUrl }) => {
    const { t } = useTranslation();
    const iframeCode = (shareUrl === null || shareUrl === void 0 ? void 0 : shareUrl.url) && shareUrl.url.length > 0
        ? `<iframe style="width: 720px; height: 600px; border: none;" src="${shareUrl.url}" allowFullScreen mozAllowFullScreen webkitAllowFullScreen></iframe>`
        : "";
    return (React.createElement(Box, { column: true },
        React.createElement(TextSpan, { medium: true }, t("share.embedTitle")),
        React.createElement(Explanation, null, t("share.embedDescription")),
        React.createElement(Input, { large: true, dark: true, type: "text", readOnly: true, placeholder: t("share.shortLinkShortening"), value: !(shareUrl === null || shareUrl === void 0 ? void 0 : shareUrl.shorteningInProgress) ? iframeCode : "", onClick: (e) => e.currentTarget.select() })));
};
const Explanation = styled(TextSpan) `
  opacity: 0.8;
`;
//# sourceMappingURL=EmbedSection.js.map