import React from "react";
import { filterSelectableDimensions } from "../../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../../Styled/Box";
import SelectableDimensionComponent from "../../SelectableDimensions/SelectableDimension";
const GeneratedControlSection = ({ item, controls, placement }) => {
    const enabledDimensions = filterSelectableDimensions(placement)(controls);
    if (enabledDimensions.length === 0) {
        return null;
    }
    return (React.createElement(Box, { displayInlineBlock: true, fullWidth: true }, enabledDimensions.map((dim, i) => (React.createElement(SelectableDimensionComponent, { key: `${item.uniqueId}-generated-control-${dim.id}-fragment`, id: `${item.uniqueId}-generated-control-${dim.id}`, dim: dim })))));
};
export default GeneratedControlSection;
//# sourceMappingURL=GeneratedControlSection.js.map