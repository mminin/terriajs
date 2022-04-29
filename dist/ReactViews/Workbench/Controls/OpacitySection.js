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
import CommonStrata from "../../../Models/Definition/CommonStrata";
import hasTraits from "../../../Models/Definition/hasTraits";
import OpacityTraits from "../../../Traits/TraitsClasses/OpacityTraits";
import Styles from "./opacity-section.scss";
let OpacitySection = class OpacitySection extends React.Component {
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
        return (React.createElement("div", { className: Styles.opacity },
            React.createElement("label", { htmlFor: "opacity" }, t("workbench.opacity", {
                opacity: Math.round(item.opacity * 100)
            })),
            React.createElement(Slider, { className: Styles.opacitySlider, min: 0, max: 100, value: (item.opacity * 100) | 0, onChange: val => this.changeOpacity(val) })));
    }
};
OpacitySection = __decorate([
    observer
], OpacitySection);
export default withTranslation()(OpacitySection);
//# sourceMappingURL=OpacitySection.js.map