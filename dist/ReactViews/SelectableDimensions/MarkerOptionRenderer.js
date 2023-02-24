import React from "react";
import { getMakiIcon } from "../../Map/Icons/Maki/MakiIcons";
export const MarkerOptionRenderer = (option) => {
    var _a;
    return (React.createElement("div", null,
        React.createElement("img", { width: "20px", height: "20px", style: { marginBottom: -5 }, src: (_a = getMakiIcon(option.value, "#000", 1, "#fff", 24, 24)) !== null && _a !== void 0 ? _a : option.value }),
        " ",
        option.value));
};
//# sourceMappingURL=MarkerOptionRenderer.js.map