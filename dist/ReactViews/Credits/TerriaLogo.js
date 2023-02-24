import React from "react";
import Box from "../../Styled/Box";
const logo = require("../../../wwwroot/images/terria-watermark.svg");
export const TerriaLogo = () => {
    return (React.createElement(Box, { as: "a", target: "_blank", rel: "noopener noreferrer", href: "https://terria.io/" },
        React.createElement("img", { css: { height: "24px" }, src: logo, title: "Built with Terria" })));
};
//# sourceMappingURL=TerriaLogo.js.map