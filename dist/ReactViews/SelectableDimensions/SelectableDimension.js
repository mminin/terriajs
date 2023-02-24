import React from "react";
import { isButton, isCheckbox, isCheckboxGroup, isColor, isEnum, isGroup, isNumeric, isText, isMultiEnum } from "../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import { SelectableDimensionButton } from "./Button";
import { SelectableDimensionCheckbox } from "./Checkbox";
import { SelectableDimensionColor } from "./Color";
import { SelectableDimensionGroup } from "./Group";
import { SelectableDimensionNumeric } from "./Numeric";
import { SelectableDimensionEnum, SelectableDimensionEnumMulti as SelectableDimensionMultiEnum } from "./Select";
import { SelectableDimensionText } from "./Text";
const SelectableDimension = ({ id, dim }) => {
    return (React.createElement(Box, { displayInlineBlock: true, fullWidth: true, styledPadding: "5px 0" },
        dim.name && dim.type !== "group" ? (React.createElement(React.Fragment, null,
            React.createElement("label", { htmlFor: id },
                React.createElement(Text, { textLight: true, medium: true, as: "span" },
                    parseCustomMarkdownToReactWithOptions(dim.name, {
                        inline: true
                    }),
                    ":")),
            React.createElement(Spacing, { bottom: 1 }))) : null,
        isCheckbox(dim) && React.createElement(SelectableDimensionCheckbox, { id: id, dim: dim }),
        isEnum(dim) && React.createElement(SelectableDimensionEnum, { id: id, dim: dim }),
        isMultiEnum(dim) && React.createElement(SelectableDimensionMultiEnum, { id: id, dim: dim }),
        (isGroup(dim) || isCheckboxGroup(dim)) && (React.createElement(SelectableDimensionGroup, { id: id, dim: dim })),
        isNumeric(dim) && React.createElement(SelectableDimensionNumeric, { id: id, dim: dim }),
        isText(dim) && React.createElement(SelectableDimensionText, { id: id, dim: dim }),
        isButton(dim) && React.createElement(SelectableDimensionButton, { id: id, dim: dim }),
        isColor(dim) && React.createElement(SelectableDimensionColor, { id: id, dim: dim })));
};
export default SelectableDimension;
//# sourceMappingURL=SelectableDimension.js.map