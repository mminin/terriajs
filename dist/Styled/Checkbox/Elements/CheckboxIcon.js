import React from "react";
import styled from "styled-components";
import { GLYPHS, StyledIcon } from "../../Icon";
const StyledCheckboxIcon = styled(StyledIcon).attrs({
    styledWidth: "1em"
}) `
  top: 0.125em;
  align-self: flex-start;
  position: relative;
  fill: currentColor;
  ${(props) => !props.disabled &&
    `
    &:hover {
      opacity: 0.6;
    }
  `}
`;
const CheckboxIcon = (props) => {
    if (props.isDisabled) {
        return (React.createElement(StyledCheckboxIcon, { glyph: props.isChecked ? GLYPHS.checkboxOn : GLYPHS.checkboxOff, disabled: true, css: `
          cursor: not-allowed;
          opacity: 0.3;
        ` }));
    }
    else if (props.isIndeterminate) {
        return React.createElement(StyledCheckboxIcon, { glyph: GLYPHS.checkboxIndeterminate });
    }
    else {
        return (React.createElement(StyledCheckboxIcon, { glyph: props.isChecked ? GLYPHS.checkboxOn : GLYPHS.checkboxOff }));
    }
};
export default CheckboxIcon;
//# sourceMappingURL=CheckboxIcon.js.map