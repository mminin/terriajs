"use strict";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import Box from "../../../Styled/Box";
import { RawButton } from "../../../Styled/Button";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
import { SpacingSpan } from "../../../Styled/Spacing";
import Text, { TextSpan } from "../../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../parseCustomMarkdownToReact";
export const CollapseIcon = (props) => {
    var _a;
    let glyph = GLYPHS.opened;
    let glyphWidth = 8;
    let glyphRotation = 0;
    let glyphOpacity = 1;
    if (props.btnStyle === "plus") {
        glyph = props.isOpen ? GLYPHS.minus : GLYPHS.plus;
        glyphOpacity = props.isOpen ? 1 : 0.4;
    }
    else if (props.btnStyle === "checkbox") {
        glyph = props.isOpen ? GLYPHS.checkboxOn : GLYPHS.checkboxOff;
        glyphWidth = 13;
    }
    else {
        glyphRotation = props.isOpen ? 0 : -90;
        glyphOpacity = props.isOpen ? 1 : 0.4;
    }
    return (React.createElement(StyledIcon, { displayInline: true, styledWidth: `${glyphWidth}px`, light: (_a = props.light) !== null && _a !== void 0 ? _a : true, glyph: glyph, opacity: glyphOpacity, rotation: glyphRotation }));
};
const Collapsible = observer((props) => {
    var _a, _b;
    const [isOpen, setIsOpen] = useState();
    useEffect(() => setIsOpen(props.isOpen), [props.isOpen]);
    const toggleOpen = () => {
        const newIsOpen = !isOpen;
        // Only update isOpen state if onToggle doesn't consume the event
        if (!props.onToggle || !props.onToggle(newIsOpen))
            setIsOpen(newIsOpen);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(RawButton, { fullWidth: true, onClick: toggleOpen, css: `
          text-align: left;
          display: flex;
          align-items: center;
        `, "aria-expanded": isOpen, "aria-controls": `${props.title}`, activeStyles: true },
            !props.btnRight && React.createElement(CollapseIcon, Object.assign({}, props, { isOpen: isOpen })),
            !props.btnRight && React.createElement(SpacingSpan, { right: 1 }),
            React.createElement(TextSpan, Object.assign({ textLight: (_a = props.light) !== null && _a !== void 0 ? _a : true, bold: true, medium: true }, props.titleTextProps), parseCustomMarkdownToReactWithOptions(props.title, {
                inline: true
            })),
            props.btnRight && React.createElement(SpacingSpan, { right: 1 }),
            props.btnRight && React.createElement(CollapseIcon, Object.assign({}, props, { isOpen: isOpen }))),
        isOpen ? (React.createElement(Box, Object.assign({}, props.bodyBoxProps),
            React.createElement(Text, Object.assign({ textLight: (_b = props.light) !== null && _b !== void 0 ? _b : true, small: true, id: `${props.title}` }, props.bodyTextProps), props.children))) : null));
});
export default Collapsible;
//# sourceMappingURL=Collapsible.js.map