import React from "react";
import { useTheme } from "styled-components";
export const Spacer = () => {
    const theme = useTheme();
    return (React.createElement("span", { "aria-hidden": "true", css: { color: theme.textLight } }, "|"));
};
//# sourceMappingURL=Spacer.js.map