import { debounce } from "lodash-es";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ChromePicker } from "react-color";
import isDefined from "../../Core/isDefined";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { RawButton } from "../../Styled/Button";
import { TextSpan } from "../../Styled/Text";
const debounceSetColorDimensionValue = debounce(action((dim, value) => {
    // Only update value if it has changed
    dim.value !== value
        ? dim.setDimensionValue(CommonStrata.user, value)
        : null;
}), 100);
export const SelectableDimensionColor = observer(({ id, dim }) => {
    var _a;
    const [open, setIsOpen] = useState(false);
    return (React.createElement("div", null,
        dim.value ? (React.createElement("div", { css: {
                padding: "5px",
                background: "#fff",
                borderRadius: "1px",
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
                display: "inline-block",
                cursor: "pointer"
            }, onClick: () => setIsOpen(true) },
            React.createElement("div", { css: {
                    width: "36px",
                    height: "14px",
                    borderRadius: "2px",
                    background: (_a = dim.value) !== null && _a !== void 0 ? _a : "#aaa"
                } }))) : null,
        !dim.value ? (React.createElement(React.Fragment, null,
            "\u00A0",
            React.createElement(RawButton, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, "#000000")), activeStyles: true, fullHeight: true },
                React.createElement(TextSpan, { textLight: true, small: true, light: true, css: { margin: 0 } }, "Add")))) : null,
        dim.value && dim.allowUndefined ? (React.createElement(React.Fragment, null,
            "\u00A0",
            React.createElement(RawButton, { onClick: () => runInAction(() => dim.setDimensionValue(CommonStrata.user, undefined)), activeStyles: true, fullHeight: true },
                React.createElement(TextSpan, { textLight: true, small: true, light: true, css: { margin: 0 } }, "Clear")))) : null,
        open ? (React.createElement("div", { css: {
                position: "absolute",
                zIndex: 2
            } },
            React.createElement("div", { css: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    width: "340px"
                }, onClick: () => setIsOpen(false) }),
            React.createElement(ChromePicker, { css: { transform: "translate(50px, -50%);" }, color: dim.value, onChangeComplete: (evt) => {
                    const colorString = isDefined(evt.rgb.a)
                        ? `rgba(${evt.rgb.r},${evt.rgb.g},${evt.rgb.b},${evt.rgb.a})`
                        : `rgb(${evt.rgb.r},${evt.rgb.g},${evt.rgb.b})`;
                    debounceSetColorDimensionValue(dim, colorString);
                } }))) : null));
});
//# sourceMappingURL=Color.js.map