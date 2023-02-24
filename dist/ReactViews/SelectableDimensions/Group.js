import React from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { filterSelectableDimensions, isGroup } from "../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../Styled/Box";
import Collapsible from "../Custom/Collapsible/Collapsible";
import SelectableDimension from "./SelectableDimension";
/**
 * Component to render a SelectableDimensionGroup or DimensionSelectorCheckboxGroup.
 */
export const SelectableDimensionGroup = ({ id, dim }) => {
    var _a, _b, _c, _d, _e;
    const childDims = filterSelectableDimensions(dim.placement)(dim.selectableDimensions);
    // Hide static groups with empty children.
    // We still show checkbox groups with empty children as they are stateful.
    if (isGroup(dim) && childDims.length === 0)
        return null;
    return (React.createElement(Collapsible, { title: dim.type === "group"
            ? (_b = (_a = dim.name) !== null && _a !== void 0 ? _a : dim.id) !== null && _b !== void 0 ? _b : "" : (_e = (_d = (_c = dim.options) === null || _c === void 0 ? void 0 : _c.find((opt) => opt.id === dim.selectedId)) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : (dim.selectedId === "true" ? "Enabled" : "Disabled"), bodyBoxProps: {
            displayInlineBlock: true,
            fullWidth: true
        }, bodyTextProps: { large: true }, isOpen: dim.type === "group" ? dim.isOpen : dim.selectedId === "true", onToggle: dim.type === "group"
            ? dim.onToggle
            : (isOpen) => dim.setDimensionValue(CommonStrata.user, isOpen ? "true" : "false"), btnStyle: dim.type === "checkbox-group" ? "checkbox" : undefined, btnRight: dim.type === "group" },
        React.createElement(Box, { displayInlineBlock: true, fullWidth: true, styledPadding: "5px 0 0 20px" }, childDims.map((nestedDim) => (React.createElement(SelectableDimension, { id: `${id}-${nestedDim.id}`, dim: nestedDim, key: `${id}-${nestedDim.id}` }))))));
};
//# sourceMappingURL=Group.js.map