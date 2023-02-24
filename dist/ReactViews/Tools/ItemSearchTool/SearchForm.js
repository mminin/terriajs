import isEmpty from "lodash-es/isEmpty";
import React, { useEffect, useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import ReactSelect from "react-select";
import styled from "styled-components";
import ErrorComponent from "./ErrorComponent";
import Loading from "./Loading";
import Text from "../../../Styled/Text";
import Box from "../../../Styled/Box";
import Button from "../../../Styled/Button";
const SearchForm = (props) => {
    const { parameters, itemSearchProvider } = props;
    const [t] = useTranslation();
    const [state, setState] = useState({ is: "initial" });
    const [query, setQuery] = useState(props.query);
    useEffect(function setValuesFromProps() {
        setQuery(props.query);
    }, [props.query]);
    const setParameterValue = (id, type) => (value) => {
        var _a;
        const newQuery = {
            ...query,
            [id]: { type, value }
        };
        // Delete the value so that we don't trigger search for it
        if (newQuery[id].value === undefined)
            delete newQuery[id];
        setQuery(newQuery);
        if (value !== undefined)
            (_a = props.onValueChange) === null || _a === void 0 ? void 0 : _a.call(props, id, value);
    };
    function search() {
        const parameterValues = new Map(Object.entries(query).map(([id, { value }]) => [id, value]));
        setState({ is: "searching" });
        itemSearchProvider
            .search(parameterValues)
            .then((results) => {
            setState({ is: "results", results });
            props.onResults(query, results);
        })
            .catch((error) => {
            console.warn(error);
            setState({ is: "error", error });
        });
    }
    const onSubmit = (e) => {
        try {
            search();
        }
        finally {
            e.preventDefault();
        }
    };
    const clearForm = () => setQuery({});
    const disabled = state.is === "searching";
    return (React.createElement(Form, { onSubmit: onSubmit },
        React.createElement(Box, { centered: true },
            state.is === "searching" && (React.createElement(Loading, null, t("itemSearchTool.searching"))),
            state.is === "error" && (React.createElement(ErrorComponent, null, t("itemSearchTool.searchError")))),
        React.createElement(FieldSet, { disabled: disabled },
            parameters.map((p) => {
                var _a;
                return (React.createElement(Field, { key: p.id },
                    React.createElement(Parameter, { parameter: p, onChange: setParameterValue(p.id, p.type), value: (_a = query[p.id]) === null || _a === void 0 ? void 0 : _a.value, disabled: disabled, t: t })));
            }),
            React.createElement(SearchButton, { primary: true, type: "submit", disabled: disabled }, t("itemSearchTool.searchBtnText")),
            React.createElement(Button, { secondary: true, type: "reset", onClick: clearForm, disabled: disabled }, t("itemSearchTool.resetBtnText")))));
};
const Parameter = (props) => {
    const { parameter } = props;
    switch (parameter.type) {
        case "numeric":
            return React.createElement(NumericParameter, Object.assign({}, props, { parameter: parameter }));
        case "enum":
            return React.createElement(EnumParameter, Object.assign({}, props, { parameter: parameter }));
        case "text":
            return React.createElement(TextParameter, Object.assign({}, props, { parameter: parameter }));
    }
};
export const NumericParameter = (props) => {
    var _a, _b;
    const { parameter, value, t } = props;
    const { min, max } = parameter.range;
    const onChange = (tag) => (e) => {
        const parsed = parseFloat(e.target.value);
        const newValue = { ...props.value };
        if (isNaN(parsed))
            delete newValue[tag];
        else
            newValue[tag] = parsed;
        props.onChange(isEmpty(newValue) ? undefined : newValue);
    };
    return (React.createElement(Box, { column: true },
        React.createElement(ParameterName, null, parameter.name),
        React.createElement(Box, { css: `
          justify-content: space-between;
        ` },
            React.createElement(HalfWidthLabel, null,
                React.createElement(Box, { column: true },
                    React.createElement(Text, { small: true }, t("itemSearchTool.numericParameter.minimum")),
                    React.createElement(Input, { type: "number", name: `${parameter.id}-min`, value: (_a = value === null || value === void 0 ? void 0 : value.start) !== null && _a !== void 0 ? _a : "", min: min, max: max, step: "any", placeholder: min.toString(), onChange: onChange("start") }))),
            React.createElement(HalfWidthLabel, null,
                React.createElement(Box, { column: true },
                    React.createElement(Text, { small: true }, t("itemSearchTool.numericParameter.maximum")),
                    React.createElement(Input, { type: "number", name: `${parameter.id}-max`, value: (_b = value === null || value === void 0 ? void 0 : value.end) !== null && _b !== void 0 ? _b : "", min: min, max: max, step: "any", placeholder: max.toString(), onChange: onChange("end") }))))));
};
const EnumParameter = (props) => {
    const { parameter, disabled } = props;
    const options = parameter.values.map(({ id }) => ({
        value: id,
        label: id || "<empty>"
    }));
    const value = options.filter((o) => { var _a; return (_a = props.value) === null || _a === void 0 ? void 0 : _a.includes(o.value); });
    const onChange = (selectedOptions) => {
        const values = selectedOptions === null || selectedOptions === void 0 ? void 0 : selectedOptions.map(({ value }) => value);
        props.onChange((values === null || values === void 0 ? void 0 : values.length) === 0 ? undefined : values);
    };
    return (React.createElement(Box, { column: true },
        React.createElement(Label, null,
            React.createElement(ParameterName, null, parameter.name),
            React.createElement(Select, { name: parameter.id, options: options, isMulti: true, value: value, menuPosition: "fixed", onChange: onChange, isDisabled: disabled }))));
};
const TextParameter = (props) => {
    const { parameter, value, onChange } = props;
    return (React.createElement(Box, { column: true },
        React.createElement(Label, null,
            React.createElement(ParameterName, null, parameter.name),
            React.createElement(Input, { type: "text", name: parameter.id, value: value || "", onChange: (e) => onChange(e.target.value ? e.target.value : undefined) }))));
};
const Form = styled.form `
  width: 100%;
`;
export const FieldSet = styled.fieldset `
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
`;
export const SearchButton = styled(Button) `
  margin: 10px 10px 0 0;
`;
const Field = styled(Box).attrs({
    column: true,
    paddedVertically: true
}) ``;
const ParameterName = styled(Text).attrs({
    semiBold: true
}) ``;
const Label = styled.label ``;
const HalfWidthLabel = styled(Label) `
  width: 45%;
  &:first-child {
    margin-right: 1em;
  }
`;
const Input = styled.input `
  color: ${(p) => p.theme.dark};
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  font-size: 1.1em;
`;
const Select = styled(ReactSelect).attrs({
    classNamePrefix: "ReactSelect"
}) `
  color: ${(p) => p.theme.dark};
  width: 100%;
  & .ReactSelect__control {
    border-radius: 0;
  }
`;
export default withTranslation()(SearchForm);
//# sourceMappingURL=SearchForm.js.map