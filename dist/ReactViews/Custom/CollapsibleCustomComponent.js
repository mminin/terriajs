import React from "react";
import Collapsible from "./Collapsible/Collapsible";
import CustomComponent from "./CustomComponent";
/**
 * A `<collapsible>` custom component, which displays a collapsible section
 * around its child components. It has the following attributes:
 *
 *   * `title` - (Required) The title of the section.
 *   * `open` - (Optional) True if the section is initially open.
 */
export default class CollapsibleCustomComponent extends CustomComponent {
    get name() {
        return "collapsible";
    }
    get attributes() {
        return ["title", "open", "rightbtn", "btnstyle"];
    }
    processNode(context, node, children) {
        var _a, _b;
        const title = node.attribs && node.attribs.title ? node.attribs.title : "Collapsible";
        const isOpen = node.attribs ? Boolean(node.attribs.open) : false;
        const btnRight = Boolean((_a = node.attribs) === null || _a === void 0 ? void 0 : _a.rightbtn);
        const btnStyle = (_b = node.attribs) === null || _b === void 0 ? void 0 : _b.btnstyle;
        return React.createElement(Collapsible, {
            key: title,
            title,
            isOpen,
            btnRight,
            btnStyle: btnStyle === "plus" ? "plus" : undefined
        }, children);
    }
}
//# sourceMappingURL=CollapsibleCustomComponent.js.map