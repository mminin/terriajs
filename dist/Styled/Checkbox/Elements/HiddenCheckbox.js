import React from "react";
export default React.forwardRef(({ isIndeterminate, ...props }, ref) => (React.createElement("input", Object.assign({ type: "checkbox", ref: ref, "aria-checked": isIndeterminate ? "mixed" : props.checked, css: {
        appearance: "none",
        clip: "rect(0 0 0 0)",
        overflow: "hidden",
        position: "absolute",
        width: 0,
        margin: 0,
        padding: 0,
        border: 0
    } }, props))));
//# sourceMappingURL=HiddenCheckbox.js.map