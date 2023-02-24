import { runInAction } from "mobx";
import React from "react";
import CommonStrata from "../../Models/Definition/CommonStrata";
import Input from "../../Styled/Input";
export const SelectableDimensionText = ({ id, dim }) => {
    return (React.createElement(Input, { styledHeight: "34px", light: true, border: true, name: id, value: dim.value, onChange: (evt) => {
            runInAction(() => dim.setDimensionValue(CommonStrata.user, evt.target.value));
        } }));
};
//# sourceMappingURL=Text.js.map