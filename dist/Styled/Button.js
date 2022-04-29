import React from "react";
import styled from "styled-components";
import { BoxSpan } from "./Box";
import { TextSpan } from "./Text";
const Icon = styled.span `
  margin-right: 8px;
`;
const StyledButton = styled.button `
  pointer-events: auto;
  cursor: pointer;
  min-height: 40px;
  ${props => props.shortMinHeight && `min-height: 34px;`}
  // min-width: 75px;
  padding: 0 16px;

  border: 1px solid #e4e5e7;
  border-radius: 4px;

  ${props => props.fullWidth && `width: 100%;`}
  ${props => props.fullHeight && `height: 100%;`}
  ${props => props.styledWidth && `width: ${props.styledWidth};`}
  ${props => props.styledMinWidth && `min-width: ${props.styledMinWidth};`}

  ${props => props.marginLeft && `margin-left: ${4 * props.marginLeft}px;`}
  ${props => props.marginRight && `margin-right: ${4 * props.marginRight}px;`}

  &:hover,
  &:focus {
    opacity: 0.9;
  }

  ${props => props.primaryHover &&
    `
    &:hover,
    &:focus {
      color: ${props.theme.textLight};
      background-color: ${props.theme.colorPrimary};
    }
  `}

  ${props => props.primary &&
    `
    color: #fff;
    background-color: ${props.theme.colorPrimary};
    border: none;
    border-radius:20px;
  `}
  ${props => props.rounded && ` border-radius: 32px; `}
  ${props => props.roundLeft && `border-radius: 32px 0 0 32px;`}
  ${props => props.roundRight && `border-radius: 0 32px 32px 0;`}

  ${props => props.secondary &&
    `
    // background-color: #4d5766;
    background-color: ${props.theme.textLight};
    color: ${props.theme.darkWithOverlay};
    border-radius: 20px;
    border: 2px solid ${props.theme.darkWithOverlay};
  `}
  ${props => props.denyButton &&
    `
    border: 2px solid ${props.theme.grey};
    color: ${props.theme.grey};
    background-color: transparent;
  `}
  ${props => props.warning &&
    `
    background-color: red;
  `}

  ${props => props.splitter &&
    `
    background-color: ${props.theme.colorSecondary};
    color: ${props.theme.textLight};
  `}

  ${props => props.transparentBg && `background: transparent;`}
  ${props => props.disabled &&
    `
    // normalize.css has some silly overrides so this specificity is needed here to re-override
    &[disabled] {
      cursor: not-allowed;
      opacity: 0.3;
      background: ${props.theme.grey};
    }
  `}
`;
/**
 * Use for things you need as clickable things & not necessary the design
 * language styled button
 */
export const RawButton = styled.button `
  margin: 0;
  padding: 0;
  border: 0;
  background-color: transparent;

  ${props => props.activeStyles &&
    `
    &:hover,
    &:focus {
      opacity: 0.9;
    }
  `}
  ${props => props.disabled &&
    `
    &[disabled] {
      cursor: not-allowed;
    }
  `}

  ${props => props.fullWidth && `width: 100%;`}
  ${props => props.fullHeight && `height: 100%;`}
  ${props => props.styledWidth && `width: ${props.styledWidth};`}
`;
// Icon and props-children-mandatory-text-wrapping is a mess here so it's all very WIP
export const Button = (props, ref) => {
    const { primary, secondary, warning, iconProps, textProps, buttonRef, ...rest } = props;
    return (React.createElement(StyledButton, Object.assign({ ref: buttonRef, primary: primary, secondary: secondary, warning: warning }, rest),
        React.createElement(BoxSpan, { centered: true },
            props.renderIcon && typeof props.renderIcon === "function" && (React.createElement(Icon, Object.assign({ css: iconProps && iconProps.css }, iconProps), props.renderIcon())),
            props.children && (React.createElement(TextSpan, Object.assign({ white: primary || secondary || warning, medium: secondary }, textProps), props.children)))));
};
const ButtonWithRef = (props, ref) => React.createElement(Button, Object.assign({}, props, { buttonRef: ref }));
export default React.forwardRef(ButtonWithRef);
//# sourceMappingURL=Button.js.map