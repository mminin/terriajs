import React from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "./../../../Styled/Checkbox/Checkbox";
import { useTheme } from "styled-components";
import Spacing from "../../../Styled/Spacing";
import { TextSpan } from "../../../Styled/Text";
const DisplayAsPercentSection = (props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const togglePercentage = () => {
        props.item.displayPercent = !props.item.displayPercent;
    };
    if (!props.item.canDisplayPercent) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Checkbox, { id: "workbenchDisplayPercent", isChecked: props.item.displayPercent, onChange: togglePercentage },
            React.createElement(TextSpan, null, t("workbench.displayPercent")))));
};
DisplayAsPercentSection.displayName = "DisplayAsPercentSection";
export default DisplayAsPercentSection;
//# sourceMappingURL=DisplayAsPercentSection.js.map