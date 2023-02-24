"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import Slider from "rc-slider";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import hasTraits from "../../../Models/Definition/hasTraits";
import Box from "../../../Styled/Box";
import Spacing from "../../../Styled/Spacing";
import Text from "../../../Styled/Text";
import OpacityTraits from "../../../Traits/TraitsClasses/OpacityTraits";
let OpacitySection = class OpacitySection extends React.Component {
    constructor(props) {
        super(props);
        this.changeOpacity = this.changeOpacity.bind(this);
    }
    changeOpacity(value) {
        const item = this.props.item;
        if (hasTraits(item, OpacityTraits, "opacity")) {
            runInAction(() => {
                item.setTrait(CommonStrata.user, "opacity", value / 100.0);
            });
        }
    }
    render() {
        const item = this.props.item;
        const { t } = this.props;
        if (!hasTraits(item, OpacityTraits, "opacity") ||
            (hasTraits(item, OpacityTraits, "disableOpacityControl") &&
                item.disableOpacityControl)) {
            return null;
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Box, { verticalCenter: true },
                React.createElement(StyledLabel, { small: true, htmlFor: "opacity" }, t("workbench.opacity", {
                    opacity: Math.round(item.opacity * 100)
                })),
                React.createElement(Spacing, { right: 3 }),
                React.createElement(Slider, { min: 0, max: 100, value: (item.opacity * 100) | 0, onChange: this.changeOpacity }))));
    }
};
OpacitySection = __decorate([
    observer
], OpacitySection);
const StyledLabel = styled(Text).attrs({ as: "label" }) `
  white-space: nowrap;
  flex-basis: 50%;
`;
export default withTranslation()(OpacitySection);
//# sourceMappingURL=OpacitySection.js.map