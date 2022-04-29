import React from "react";
import { useTheme } from "styled-components";
import { BoxSpan } from "../../../Styled/Box";
import Button from "../../../Styled/Button";
import { TextSpan } from "../../../Styled/Text";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
const BackButton = ({ children, onClick }) => {
    const theme = useTheme();
    return (React.createElement(Button, { css: `
        color: ${theme.textLight};
        border-color: ${theme.textLight};
        margin: 2em 0 1em 0;
      `, transparentBg: true, onClick: onClick },
        React.createElement(BoxSpan, { centered: true },
            React.createElement(StyledIcon, { css: "transform:rotate(90deg);", light: true, styledWidth: "16px", glyph: GLYPHS.arrowDown }),
            React.createElement(TextSpan, { noFontSize: true }, children))));
};
export default BackButton;
//# sourceMappingURL=BackButton.js.map