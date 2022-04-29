import isDefined from "../Core/isDefined";
/** Maximum number of options for a `SelectableDimension` */
export const MAX_SELECTABLE_DIMENSION_OPTIONS = 1000;
export const DEFAULT_PLACEMENT = "default";
var SelectableDimensions;
(function (SelectableDimensions) {
    function is(model) {
        return "selectableDimensions" in model;
    }
    SelectableDimensions.is = is;
})(SelectableDimensions || (SelectableDimensions = {}));
const isCheckbox = (dim) => dim.type === "checkbox";
const isSelect = (dim) => dim.type === "select" || dim.type === undefined;
const isCorrectPlacement = (placement) => (dim) => dim.placement ? dim.placement === placement : placement === DEFAULT_PLACEMENT;
const isEnabled = (dim) => !dim.disable;
const hasValidOptions = (dim) => {
    const minLength = dim.allowUndefined ? 1 : 2; // Filter out dimensions with only 1 option (unless they have 1 option and allow undefined - which is 2 total options)
    return (isDefined(dim.options) &&
        dim.options.length >= minLength &&
        dim.options.length < MAX_SELECTABLE_DIMENSION_OPTIONS);
};
// Filter out dimensions with only 1 option (unless they have 1 option and allow undefined - which is 2 total options)
export const filterSelectableDimensions = (placement) => (selectableDimensions = []) => selectableDimensions.filter(dim => 
// Filter by placement if defined, otherwise use default placement
isCorrectPlacement(placement)(dim) &&
    isEnabled(dim) &&
    hasValidOptions(dim));
export const findSelectedValueName = (dim) => {
    var _a, _b;
    const name = (_b = (_a = dim.options) === null || _a === void 0 ? void 0 : _a.find(opt => opt.id === dim.selectedId)) === null || _b === void 0 ? void 0 : _b.name;
    if (isSelect(dim)) {
        return name;
    }
    else if (isCheckbox(dim)) {
        return dim.selectedId === "true" ? "Enabled" : "Disabled";
    }
};
export default SelectableDimensions;
//# sourceMappingURL=SelectableDimensions.js.map