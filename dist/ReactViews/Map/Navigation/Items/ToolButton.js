import { observer } from "mobx-react";
import React from "react";
import Box from "../../../../Styled/Box";
import Icon from "../../../../Styled/Icon";
import MapIconButton from "../../../MapIconButton/MapIconButton";
const ToolButton = observer((props) => {
    const { controller } = props;
    return (React.createElement(Box, { displayInlineBlock: true },
        React.createElement(MapIconButton, { primary: controller.active, expandInPlace: true, title: controller.title, onClick: () => controller.handleClick(), iconElement: () => React.createElement(Icon, { glyph: controller.glyph }), closeIconElement: () => React.createElement(Icon, { glyph: Icon.GLYPHS.closeTool }) }, controller.title)));
});
export default ToolButton;
//# sourceMappingURL=ToolButton.js.map