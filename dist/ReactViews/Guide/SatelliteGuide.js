var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Guide from "./Guide.jsx";
import satelliteGuideData from "./satelliteGuideData.js";
import { action } from "mobx";
import { observer } from "mobx-react";
export const SATELLITE_GUIDE_KEY = "satelliteGuidance";
let SatelliteGuide = class SatelliteGuide extends React.Component {
    constructor() {
        super();
    }
    handleMakeTopElement() {
        this.props.viewState.topElement = "Guide";
    }
    setShowSatelliteGuidance(bool) {
        this.props.viewState.showSatelliteGuidance = bool;
    }
    render() {
        const { terria, viewState, t } = this.props;
        const guideData = satelliteGuideData(t);
        return (React.createElement(Guide, { terria: terria, guideKey: SATELLITE_GUIDE_KEY, guideData: guideData, setShowGuide: bool => {
                this.setShowSatelliteGuidance(bool);
                // If we're closing for any reason, set prompted to true
                if (!bool) {
                    viewState.toggleFeaturePrompt("satelliteGuidance", true, true);
                }
            } }));
    }
};
SatelliteGuide.propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired
};
__decorate([
    action.bound
], SatelliteGuide.prototype, "handleMakeTopElement", null);
__decorate([
    action.bound
], SatelliteGuide.prototype, "setShowSatelliteGuidance", null);
SatelliteGuide = __decorate([
    observer
], SatelliteGuide);
export default withTranslation()(SatelliteGuide);
//# sourceMappingURL=SatelliteGuide.js.map