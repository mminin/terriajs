var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import { observer } from "mobx-react";
import Styles from "./parameter-editors.scss";
import { action } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
import isDefined from "../../Core/isDefined";
let EnumerationParameterEditor = class EnumerationParameterEditor extends React.Component {
    onChange(e) {
        this.props.parameter.setValue(CommonStrata.user, e.target.value);
    }
    render() {
        const value = this.props.parameter.value;
        return (React.createElement("select", { className: Styles.field, onChange: this.onChange.bind(this), value: value },
            (!isDefined(value) || !this.props.parameter.isRequired) && (React.createElement("option", { key: "__undefined__", value: "" }, "Not specified")),
            isDefined(value) &&
                !this.props.parameter.options.find((option) => option.id === value) && (React.createElement("option", { key: "__invalid__", value: value },
                "Invalid value (",
                value,
                ")")),
            this.props.parameter.options.map((v, i) => {
                var _a;
                return (React.createElement("option", { value: v.id, key: i }, (_a = v.name) !== null && _a !== void 0 ? _a : v.id));
            })));
    }
};
__decorate([
    action
], EnumerationParameterEditor.prototype, "onChange", null);
EnumerationParameterEditor = __decorate([
    observer
], EnumerationParameterEditor);
export default EnumerationParameterEditor;
//# sourceMappingURL=EnumerationParameterEditor.js.map