"use strict";
import React from "react";
import PropTypes from "prop-types";
import defined from "terriajs-cesium/Source/Core/defined";
import Styles from "./parameter-editors.scss";
import { selectOnMap as selectPointOnMap, getDisplayValue as getPointParameterDisplayValue } from "./PointParameterEditor";
import { selectOnMap as selectPolygonOnMap, getDisplayValue as getPolygonParameterDisplayValue } from "./PolygonParameterEditor";
import { selectOnMap as selectExistingPolygonOnMap, getDisplayValue as getExistingPolygonParameterDisplayValue } from "./SelectAPolygonParameterEditor";
import { getDisplayValue as getRegionPickerDisplayValue } from "./RegionPicker";
import createReactClass from "create-react-class";
import GeoJsonParameter from "../../Models/FunctionParameters/GeoJsonParameter";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
const GeoJsonParameterEditor = observer(createReactClass({
    displayName: "GeoJsonParameterEditor",
    propTypes: {
        previewed: PropTypes.object,
        parameter: PropTypes.object,
        viewState: PropTypes.object,
        t: PropTypes.func.isRequired
    },
    onCleanUp() {
        this.props.viewState.openAddData();
    },
    selectPointOnMap() {
        runInAction(() => {
            this.props.parameter.setValue(CommonStrata.user, undefined);
            selectPointOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter, this.props.t("analytics.selectLocation"));
            this.props.parameter.subtype = GeoJsonParameter.PointType;
        });
    },
    selectPolygonOnMap() {
        runInAction(() => {
            this.props.parameter.setValue(CommonStrata.user, undefined);
            selectPolygonOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
            this.props.parameter.subtype = GeoJsonParameter.PolygonType;
        });
    },
    selectExistingPolygonOnMap() {
        runInAction(() => {
            this.props.parameter.setValue(CommonStrata.user, undefined);
            selectExistingPolygonOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
            this.props.parameter.subtype = GeoJsonParameter.SelectAPolygonType;
        });
    },
    render() {
        const { t } = this.props;
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("strong", null, t("analytics.selectLocation"))),
            React.createElement("div", { className: "container", style: {
                    marginTop: "10px",
                    marginBottom: "10px",
                    display: "table",
                    width: "100%"
                } },
                React.createElement("button", { type: "button", onClick: this.selectPointOnMap, className: Styles.btnLocationSelector },
                    React.createElement("strong", null, t("analytics.point"))),
                React.createElement("button", { type: "button", style: { marginLeft: "2%", marginRight: "2%" }, onClick: this.selectPolygonOnMap, className: Styles.btnLocationSelector },
                    React.createElement("strong", null, t("analytics.polygon"))),
                React.createElement("button", { type: "button", onClick: this.selectExistingPolygonOnMap, className: Styles.btnLocationSelector },
                    React.createElement("strong", null, t("analytics.existingPolygon")))),
            React.createElement("input", { className: Styles.field, type: "text", readOnly: true, value: getDisplayValue(this.props.parameter.value, this.props.parameter) }),
            React.createElement(If, { condition: getDisplayValue(this.props.parameter.value, this.props.parameter) === "" },
                React.createElement("div", null, t("analytics.nothingSelected")))));
    }
}));
function getDisplayValue(value, parameter) {
    if (!defined(parameter.subtype)) {
        return "";
    }
    if (parameter.subtype === GeoJsonParameter.PointType) {
        return getPointParameterDisplayValue(value);
    }
    if (parameter.subtype === GeoJsonParameter.SelectAPolygonType) {
        return getExistingPolygonParameterDisplayValue(value);
    }
    if (parameter.subtype === GeoJsonParameter.PolygonType) {
        return getPolygonParameterDisplayValue(value);
    }
    return getRegionPickerDisplayValue(value, parameter);
}
module.exports = withTranslation()(GeoJsonParameterEditor);
//# sourceMappingURL=GeoJsonParameterEditor.js.map