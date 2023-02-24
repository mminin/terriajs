import { default as React } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
const Icon = require("../../Styled/Icon").default;
const { StyledIcon } = require("../../Styled/Icon");
export const ExternalLinkWithWarning = (props) => {
    const viewState = useViewState();
    const { t } = useTranslation();
    const onClick = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        viewState.terria.notificationState.addNotificationToQueue({
            title: t("core.unverifiedExternalLink.title"),
            message: t("core.unverifiedExternalLink.message", {
                url: props.attributes.href
            }),
            confirmText: t("core.unverifiedExternalLink.confirmText"),
            denyText: t("core.unverifiedExternalLink.denyText"),
            confirmAction: () => { var _a; return (_a = window.open(props.attributes.href, "_blank")) === null || _a === void 0 ? void 0 : _a.focus(); }
        });
    };
    if (!props.attributes.href) {
        return React.createElement("a", Object.assign({}, props.attributes), props.children);
    }
    return (React.createElement("a", Object.assign({}, props.attributes, { onClick: onClick }), props.children));
};
export const ExternalLinkIcon = styled(StyledIcon).attrs({
    glyph: Icon.GLYPHS.externalLink,
    styledWidth: "10px",
    styledHeight: "10px",
    displayInline: true
}) `
  margin-left: 5px;
  fill: currentColor;
`;
//# sourceMappingURL=ExternalLink.js.map