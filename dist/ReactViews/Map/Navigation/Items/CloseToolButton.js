import React from "react";
import { withTranslation } from "react-i18next";
import Icon from "../../../../Styled/Icon";
import MapIconButton from "../../../MapIconButton/MapIconButton";
function CloseToolButton({ viewState, t }) {
    var _a, _b;
    const closeText = t("tool.closeButtonTitle", {
        toolName: (_a = viewState.currentTool) === null || _a === void 0 ? void 0 : _a.toolName
    });
    const toolIsDifference = ((_b = viewState.currentTool) === null || _b === void 0 ? void 0 : _b.toolName) === "Difference";
    return (React.createElement(MapIconButton, { css: `
        svg {
          width: 13px;
          height: 13px;
        }
      `, title: closeText, splitter: toolIsDifference, expandInPlace: true, iconElement: () => React.createElement(Icon, { glyph: Icon.GLYPHS.closeLight }), onClick: () => viewState.closeTool() }, closeText));
}
export default withTranslation()(CloseToolButton);
//# sourceMappingURL=CloseToolButton.js.map