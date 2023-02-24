import React from "react";
import { useTheme } from "styled-components";
import AnimatedSpinnerIcon from "../../Styled/AnimatedSpinnerIcon";
import { StyledIcon } from "../../Styled/Icon";
import StyledButton from "./StyledButton";
/**
 * A themed button to use inside {@link ActionBar}
 */
export const ActionButton = ({ className, icon, showProcessingIcon, warning, isActive, ...props }) => {
    const theme = useTheme();
    return (React.createElement(StyledButton, Object.assign({ className: className, backgroundColor: isActive ? theme.colorPrimary : theme.darkLighter, hoverBackgroundColor: warning ? "red" : theme.colorPrimary, renderIcon: showProcessingIcon
            ? () => React.createElement(AnimatedSpinnerIcon, { styledWidth: "20px", styledHeight: "20px" })
            : icon
                ? () => (React.createElement(StyledIcon, { light: true, styledWidth: "20px", styledHeight: "20px", glyph: icon }))
                : undefined }, props)));
};
//# sourceMappingURL=ActionButton.js.map