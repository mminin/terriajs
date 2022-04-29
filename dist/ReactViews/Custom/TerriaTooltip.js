import React from "react";
import { TooltipWithButtonLauncher } from "../Generic/TooltipWrapper";
import CustomComponent from "./CustomComponent";
/**
 * A `<terriatooltip>` custom component, taking a title and content
 * around its child components. It has the following attributes:
 *
 *   * `title` - (Required) The text to use as the "tooltip launcher"
 */
export default class TerriaTooltipCustomComponent extends CustomComponent {
    get name() {
        return "terriatooltip";
    }
    get attributes() {
        return ["title"];
    }
    processNode(context, node, children) {
        return React.createElement(TooltipWithButtonLauncher, {
            dismissOnLeave: true,
            launcherComponent: () => { var _a; return (_a = node.attribs) === null || _a === void 0 ? void 0 : _a.title; },
            children: () => children
        });
    }
}
//# sourceMappingURL=TerriaTooltip.js.map