import i18next from "i18next";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactSelect from "react-select";
import ReactSelectCreatable from "react-select/creatable";
import { useTheme } from "styled-components";
import isDefined from "../../Core/isDefined";
import CommonStrata from "../../Models/Definition/CommonStrata";
export const SelectableDimensionEnum = observer(({ id, dim }) => {
    var _a, _b;
    const theme = useTheme();
    const undefinedOption = {
        value: undefined,
        label: (_a = dim.undefinedLabel) !== null && _a !== void 0 ? _a : i18next.t("workbench.dimensionsSelector.undefinedLabel")
    };
    let options = (_b = dim.options) === null || _b === void 0 ? void 0 : _b.map((option) => {
        var _a;
        return ({
            value: option.id,
            label: (_a = option.name) !== null && _a !== void 0 ? _a : option.id
        });
    });
    const selectedOption = dim.selectedId
        ? options === null || options === void 0 ? void 0 : options.find((option) => option.value === dim.selectedId) : undefinedOption;
    if (!options)
        return null;
    if (typeof dim.selectedId === "undefined" || dim.allowUndefined) {
        options = [undefinedOption, ...options];
    }
    return dim.allowCustomInput ? (React.createElement(ReactSelectCreatable, { css: `
        color: ${theme.dark};
      `, options: options, value: selectedOption, onChange: (evt) => {
            runInAction(() => { var _a; return dim.setDimensionValue(CommonStrata.user, (_a = evt === null || evt === void 0 ? void 0 : evt.value) !== null && _a !== void 0 ? _a : ""); });
        }, isClearable: dim.allowUndefined, formatOptionLabel: dim.optionRenderer, theme: (selectTheme) => ({
            ...selectTheme,
            colors: {
                ...selectTheme.colors,
                primary25: theme.greyLighter,
                primary50: theme.colorPrimary,
                primary75: theme.colorPrimary,
                primary: theme.colorPrimary
            }
        }) })) : (React.createElement(ReactSelect, { css: `
        color: ${theme.dark};
      `, options: options, value: selectedOption, onChange: (evt) => {
            runInAction(() => { var _a; return dim.setDimensionValue(CommonStrata.user, (_a = evt === null || evt === void 0 ? void 0 : evt.value) !== null && _a !== void 0 ? _a : ""); });
        }, isClearable: dim.allowUndefined, formatOptionLabel: dim.optionRenderer, theme: (selectTheme) => ({
            ...selectTheme,
            colors: {
                ...selectTheme.colors,
                primary25: theme.greyLighter,
                primary50: theme.colorPrimary,
                primary75: theme.colorPrimary,
                primary: theme.colorPrimary
            }
        }) }));
});
/** Similar to SelectableDimensionEnum, but allows multiple values to be selected */
export const SelectableDimensionEnumMulti = observer(({ id, dim }) => {
    var _a;
    const theme = useTheme();
    let options = (_a = dim.options) === null || _a === void 0 ? void 0 : _a.map((option) => {
        var _a;
        return ({
            value: option.id,
            label: (_a = option.name) !== null && _a !== void 0 ? _a : option.id
        });
    });
    if (!options)
        return null;
    const selectedOptions = options.filter((option) => { var _a; return (_a = dim.selectedIds) === null || _a === void 0 ? void 0 : _a.some((id) => option.value === id); });
    return (React.createElement(ReactSelect, { css: `
        color: ${theme.dark};
      `, options: options, value: selectedOptions, onChange: (evt) => {
            runInAction(() => {
                var _a;
                return dim.setDimensionValue(CommonStrata.user, (_a = evt === null || evt === void 0 ? void 0 : evt.map((selected) => selected.value).filter(isDefined)) !== null && _a !== void 0 ? _a : []);
            });
        }, isClearable: dim.allowUndefined, formatOptionLabel: dim.optionRenderer, theme: (selectTheme) => ({
            ...selectTheme,
            colors: {
                ...selectTheme.colors,
                primary25: theme.greyLighter,
                primary50: theme.colorPrimary,
                primary75: theme.colorPrimary,
                primary: theme.colorPrimary
            }
        }), isMulti: true }));
});
//# sourceMappingURL=Select.js.map