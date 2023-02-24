import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLinkIcon } from "../Custom/ExternalLink";
import { Spacer } from "./Spacer";
export const Credit = ({ credit, lastElement }) => {
    const { t } = useTranslation();
    return (React.createElement(React.Fragment, null,
        React.createElement("a", { key: credit.url, target: "_blank", rel: "noopener noreferrer", href: credit.url },
            t(credit.text),
            " ",
            React.createElement(ExternalLinkIcon, null)),
        !lastElement ? React.createElement(Spacer, null) : null));
};
//# sourceMappingURL=Credit.js.map