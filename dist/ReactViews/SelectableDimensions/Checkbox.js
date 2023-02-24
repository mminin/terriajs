import { runInAction } from "mobx";
import React from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import Checkbox from "../../Styled/Checkbox";
import Text from "../../Styled/Text";
export const SelectableDimensionCheckbox = ({ id, dim }) => {
    var _a, _b, _c;
    return (React.createElement(Checkbox, { name: id, isChecked: dim.selectedId === "true", onChange: (evt) => runInAction(() => dim.setDimensionValue(CommonStrata.user, evt.target.checked ? "true" : "false")) },
        React.createElement(Text, null, (_c = (_b = (_a = dim.options) === null || _a === void 0 ? void 0 : _a.find((opt) => opt.id === dim.selectedId)) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : (dim.selectedId === "true" ? "Enabled" : "Disabled"))));
};
//# sourceMappingURL=Checkbox.js.map