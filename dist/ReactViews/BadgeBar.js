import React from "react";
import { useTheme } from "styled-components";
import { TextSpan } from "../Styled/Text";
const Box = require("../Styled/Box").default;
const BadgeBar = (props) => {
    const theme = useTheme();
    return (React.createElement(Box, { paddedHorizontally: 3, justifySpaceBetween: true, whiteSpace: "nowrap", styledMinHeight: "40px", verticalCenter: true, css: `
        border-top: 1px solid ${theme.darkWithOverlay};
        border-bottom: 1px solid ${theme.darkWithOverlay};
      ` },
        React.createElement(TextSpan, { textLight: true, uppercase: true, overflowHide: true, overflowEllipsis: true },
            props.label,
            " ",
            props.badge ? `(${props.badge})` : null),
        React.createElement(Box, { styledMaxWidth: "60%", css: `
          gap: 15px;
        ` }, props.children)));
};
export default BadgeBar;
//# sourceMappingURL=BadgeBar.js.map