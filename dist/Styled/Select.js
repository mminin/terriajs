/**
 * sample usage:
 *

<Select>
  <option>one</option>
  <option>two</option>
  <option>three</option>
</Select>

or if you need padding, box needed as select comes with zero padding
<Box paddedRatio={1}>
  <Select>
    <option>one</option>
    <option>two</option>
    <option>three</option>
  </Select>
</Box>

or with overrides on icon
<Select dropdownIconProps={{fillColor: props.theme.textLight}}>
  <option>one</option>
  <option>two</option>
  <option>three</option>
</Select>
 */
import React from "react";
import styled, { useTheme } from "styled-components";
const Box = require("./Box").default;
import { GLYPHS, StyledIcon } from "./Icon";
const StyledSelect = styled.select `
  -moz-appearance: none;
  -webkit-appearance: none;

  min-height: 34px; // use a bool prop when we figure out the smaller size
  width: 100%;

  border: none;
  border-radius: ${(p) => p.theme.radiusSmall};
  padding-left: ${(p) => p.paddingForLeftIcon || "10px"};
  padding-right: 30px; // For icon

  color: ${(p) => p.theme.textLight};
  background: ${(p) => p.theme.overlay};

  & option {
    color: ${(p) => p.theme.textBlack};
  }

  ${(props) => props.light &&
    `
    color: ${props.theme.textBlack};
    background: ${props.theme.overlayInvert};
  `}

  ${(props) => props.disabled && `opacity: 0.3;`}
`;
const ArrowPositioning = styled.div `
  ${(props) => props.theme.verticalAlign("absolute")}
  right: 10px;

  // Stops presentational icon preventing select activation via mouse
  pointer-events: none;
`;
const LeftIconPositioning = styled.div `
  ${(props) => props.theme.verticalAlign("absolute")}

  // Stops presentational icon preventing select activation via mouse
  pointer-events: none;
`;
const Select = (props) => {
    const { leftIcon, children, boxProps, dropdownIconProps, paddingForLeftIcon, ...rest } = props;
    const theme = useTheme();
    return (React.createElement(Box, Object.assign({ fullWidth: true }, boxProps),
        leftIcon && React.createElement(LeftIconPositioning, null, leftIcon()),
        React.createElement(StyledSelect, Object.assign({ leftIcon: leftIcon, paddingForLeftIcon: paddingForLeftIcon }, rest), children),
        React.createElement(ArrowPositioning, null,
            React.createElement(StyledIcon
            // light bg needs dark icon
            , Object.assign({ 
                // light bg needs dark icon
                fillColor: props.light ? theme.textBlack : theme.textLight, styledWidth: "16px", glyph: GLYPHS.arrowDown }, dropdownIconProps)))));
};
export default Select;
//# sourceMappingURL=Select.js.map