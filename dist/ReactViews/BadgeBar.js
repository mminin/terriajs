import React from "react";
import { TextSpan } from "../Styled/Text";
const Box = require("../Styled/Box").default;
const BadgeBar = (props) => {
    return (React.createElement(Box, { paddedHorizontally: 3, justifySpaceBetween: true, whiteSpace: "nowrap" },
        React.createElement(Box, { verticalCenter: true, styledMaxWidth: "40%" },
            React.createElement(TextSpan, { textLight: true, uppercase: true, overflowHide: true, overflowEllipsis: true },
                props.label,
                " ",
                props.badge ? `(${props.badge})` : null)),
        React.createElement(Box, { styledMaxWidth: "60%" }, props.children)));
};
export default BadgeBar;
//# sourceMappingURL=BadgeBar.js.map