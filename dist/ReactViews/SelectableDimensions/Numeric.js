import { runInAction } from "mobx";
import React, { useState } from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import Input from "../../Styled/Input";
import { observer } from "mobx-react";
export const SelectableDimensionNumeric = observer(({ id, dim }) => {
    var _a;
    const [value, setValue] = useState((_a = dim.value) === null || _a === void 0 ? void 0 : _a.toString());
    return (React.createElement(Input, { styledHeight: "34px", light: true, border: true, type: "number", name: id, value: value, min: dim.min, max: dim.max, invalidValue: Number.isNaN(parseFloat(value !== null && value !== void 0 ? value : "")), onChange: (evt) => {
            setValue(evt.target.value);
            const number = parseFloat(evt.target.value);
            if (!Number.isNaN(number)) {
                runInAction(() => dim.setDimensionValue(CommonStrata.user, number));
            }
        } }));
});
//# sourceMappingURL=Numeric.js.map