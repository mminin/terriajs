import { runInAction } from "mobx";
import React from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { StyledIcon } from "../../Styled/Icon";
import Text from "../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import Button from "../../Styled/Button";
export const SelectableDimensionButton = ({ id, dim }) => {
    var _a;
    const icon = dim.icon;
    return (React.createElement(Button, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, true)), activeStyles: true, shortMinHeight: true, renderIcon: icon &&
            (() => (React.createElement(StyledIcon, { glyph: icon, light: true, styledWidth: "16px", styledHeight: "16px" }))), style: { backgroundColor: "transparent" } },
        React.createElement("div", { style: { display: "flex" } },
            React.createElement(Text, { textLight: true }, parseCustomMarkdownToReactWithOptions((_a = dim.value) !== null && _a !== void 0 ? _a : "", {
                inline: true
            })))));
};
//# sourceMappingURL=Button.js.map