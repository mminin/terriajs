import React, { forwardRef, memo, useCallback, useState } from "react";
import { useUID } from "react-uid";
import { TextSpan } from "../Text";
import { SpacingSpan } from "./../Spacing";
import CheckboxIcon from "./Elements/CheckboxIcon";
import HiddenCheckbox from "./Elements/HiddenCheckbox";
const Checkbox = memo(forwardRef(function Checkbox(props, ref) {
    const { isChecked: isCheckedProp, isDisabled = false, defaultChecked = false, isIndeterminate = false, onChange: onChangeProps, title, name, value, children, textProps, className, ...rest } = props;
    const [isCheckedState, setIsCheckedState] = useState(isCheckedProp !== undefined ? isCheckedProp : defaultChecked);
    const onChange = useCallback((e) => {
        setIsCheckedState(e.target.checked);
        if (onChangeProps) {
            onChangeProps(e);
        }
    }, [onChangeProps]);
    // Use isChecked from the state if it is controlled
    const isChecked = isCheckedProp === undefined ? isCheckedState : isCheckedProp;
    const id = useUID();
    // Add props to children
    const childrenWithProps = React.Children.map(children, (child) => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                isDisabled,
                isChecked,
                style: { fontSize: "inherit" }
            });
        }
        return child;
    });
    return (React.createElement(TextSpan, Object.assign({ as: "label", title: title, htmlFor: `checkbox-${id}`, className: className, css: `
          display: flex;
          flex-shrink: 0;
          align-items: center;
          &:focus-within {
            //copy the global focus
            outline: 3px solid #c390f9;
          }
          ${!isDisabled &&
            `
            cursor: pointer;
            &:hover svg {
              opacity: 0.6;
            }
          `}
          ${isDisabled &&
            `
            cursor: not-allowed;
          `}
        ` }, textProps),
        React.createElement(HiddenCheckbox, { disabled: isDisabled, checked: isChecked, onChange: onChange, value: value, name: name, id: `checkbox-${id}`, ref: ref }),
        React.createElement(CheckboxIcon, { isIndeterminate: isIndeterminate, isChecked: isChecked, isDisabled: isDisabled }),
        React.createElement(SpacingSpan, { right: 1 }),
        childrenWithProps));
}));
Checkbox.displayName = "Checkbox";
export default Checkbox;
//# sourceMappingURL=Checkbox.js.map