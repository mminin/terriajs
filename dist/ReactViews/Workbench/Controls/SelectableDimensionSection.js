var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import isDefined from "../../../Core/isDefined";
import SelectableDimensions, { filterSelectableDimensions } from "../../../Models/SelectableDimensions/SelectableDimensions";
import Box from "../../../Styled/Box";
import SelectableDimension from "../../SelectableDimensions/SelectableDimension";
let SelectableDimensionSection = class SelectableDimensionSection extends React.Component {
    render() {
        const item = this.props.item;
        if (!SelectableDimensions.is(item)) {
            return null;
        }
        const selectableDimensions = filterSelectableDimensions(this.props.placement)(item.selectableDimensions);
        if (!isDefined(selectableDimensions) || selectableDimensions.length === 0) {
            return null;
        }
        return (React.createElement(Box, { displayInlineBlock: true, fullWidth: true }, selectableDimensions.map((dim, i) => (React.createElement(SelectableDimension, { key: `${item.uniqueId}-${dim.id}-fragment`, id: `${item.uniqueId}-${dim.id}`, dim: dim })))));
    }
};
SelectableDimensionSection = __decorate([
    observer
], SelectableDimensionSection);
export default withTranslation()(SelectableDimensionSection);
//# sourceMappingURL=SelectableDimensionSection.js.map