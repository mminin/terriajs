"use strict";
import classNames from "classnames";
import createReactClass from "create-react-class";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import React from "react";
import Styles from "./legend.scss";
const LocationBar = observer(createReactClass({
    displayName: "LocationBar",
    propTypes: {
        terria: PropTypes.object,
        showUtmZone: PropTypes.bool,
        mouseCoords: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    getDefaultProps: function () {
        return {
            showUtmZone: true
        };
    },
    toggleUseProjection() {
        this.props.mouseCoords.toggleUseProjection();
    },
    render() {
        const { t } = this.props;
        return (React.createElement("button", { type: "button", className: classNames(Styles.locationBar, {
                [Styles.useProjection]: this.props.mouseCoords.useProjection
            }), onClick: this.toggleUseProjection, css: `
            &:hover {
              background: ${p => p.theme.colorPrimary};
            }
          ` },
            React.createElement(Choose, null,
                React.createElement(When, { condition: !this.props.mouseCoords.useProjection },
                    React.createElement("div", { className: Styles.section },
                        React.createElement("span", null, t("legend.lat")),
                        React.createElement("span", null, this.props.mouseCoords.latitude)),
                    React.createElement("div", { className: Styles.section },
                        React.createElement("span", null, t("legend.lon")),
                        React.createElement("span", null, this.props.mouseCoords.longitude))),
                React.createElement(Otherwise, null,
                    React.createElement("div", { className: Styles.sectionShort },
                        React.createElement("span", null, t("legend.zone")),
                        React.createElement("span", null, this.props.mouseCoords.utmZone)),
                    React.createElement("div", { className: Styles.section },
                        React.createElement("span", null, t("legend.e")),
                        React.createElement("span", null, this.props.mouseCoords.east)),
                    React.createElement("div", { className: Styles.section },
                        React.createElement("span", null, t("legend.n")),
                        React.createElement("span", null, this.props.mouseCoords.north)))),
            React.createElement("div", { className: Styles.sectionLong },
                React.createElement("span", null, t("legend.elev")),
                React.createElement("span", null, this.props.mouseCoords.elevation))));
    }
}));
module.exports = withTranslation()(LocationBar);
//# sourceMappingURL=LocationBar.js.map