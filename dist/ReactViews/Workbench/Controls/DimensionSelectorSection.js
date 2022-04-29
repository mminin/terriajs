"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import { filterSelectableDimensions } from "../../../Models/SelectableDimensions";
import Box from "../../../Styled/Box";
import Checkbox from "../../../Styled/Checkbox";
import Select from "../../../Styled/Select";
import Spacing from "../../../Styled/Spacing";
import Text from "../../../Styled/Text";
let DimensionSelectorSection = class DimensionSelectorSection extends React.Component {
    setDimensionValue(dimension, value) {
        dimension.setDimensionValue(CommonStrata.user, value);
    }
    render() {
        const item = this.props.item;
        const selectableDimensions = filterSelectableDimensions(this.props.placement)(item.selectableDimensions);
        if (selectableDimensions.length === 0) {
            return null;
        }
        return (React.createElement(Box, { displayInlineBlock: true, fullWidth: true },
            React.createElement(Spacing, { bottom: 2 }),
            selectableDimensions.map((dim, i) => {
                var _a, _b, _c, _d;
                return (React.createElement(React.Fragment, { key: `${item.uniqueId}-${dim.id}-fragment` },
                    dim.name ? (React.createElement(React.Fragment, null,
                        React.createElement("label", { htmlFor: `${item.uniqueId}-${dim.id}` },
                            React.createElement(Text, { textLight: true, medium: true, as: "span" },
                                dim.name,
                                ":")),
                        React.createElement(Spacing, { bottom: 1 }))) : null,
                    dim.type === "checkbox" ? (
                    /* Checkbox Selectable Dimension */
                    React.createElement(Checkbox, { isChecked: dim.selectedId === "true", onChange: evt => this.setDimensionValue(dim, evt.target.checked ? "true" : "false") },
                        React.createElement(Text, null, (_c = (_b = (_a = dim.options) === null || _a === void 0 ? void 0 : _a.find(opt => opt.id === dim.selectedId)) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : (dim.selectedId === "true" ? "Enabled" : "Disabled")))) : (
                    /* Select (dropdown) Selectable Dimension (default) */
                    React.createElement(Select, { light: true, name: dim.id, id: `${item.uniqueId}-${dim.id}`, value: typeof dim.selectedId === "undefined"
                            ? "__undefined__"
                            : dim.selectedId, onChange: (evt) => this.setDimensionValue(dim, evt.target.value) },
                        (typeof dim.selectedId === "undefined" ||
                            dim.allowUndefined) && (React.createElement("option", { key: "__undefined__", value: "" }, (_d = dim.undefinedLabel) !== null && _d !== void 0 ? _d : i18next.t("workbench.dimensionsSelector.undefinedLabel"))),
                        dim.options.map(option => (React.createElement("option", { key: option.id, value: option.id }, option.name || option.id))))),
                    i < selectableDimensions.length - 1 && React.createElement(Spacing, { bottom: 2 })));
            })));
    }
};
__decorate([
    action
], DimensionSelectorSection.prototype, "setDimensionValue", null);
DimensionSelectorSection = __decorate([
    observer
], DimensionSelectorSection);
export default withTranslation()(DimensionSelectorSection);
//# sourceMappingURL=DimensionSelectorSection.js.map