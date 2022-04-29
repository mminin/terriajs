var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import Styles from "./parameter-editors.scss";
import { action } from "mobx";
import { observer } from "mobx-react";
import CommonStrata from "../../Models/Definition/CommonStrata";
let GenericParameterEditor = class GenericParameterEditor extends React.Component {
    onChange(e) {
        this.props.parameter.setValue(CommonStrata.user, e.target.value);
    }
    render() {
        const value = (this.props.parameter.value || "");
        return (React.createElement("input", { className: Styles.field, type: "text", onChange: this.onChange.bind(this), value: value }));
    }
};
__decorate([
    action
], GenericParameterEditor.prototype, "onChange", null);
GenericParameterEditor = __decorate([
    observer
], GenericParameterEditor);
export default GenericParameterEditor;
//# sourceMappingURL=GenericParameterEditor.js.map