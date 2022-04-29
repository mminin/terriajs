import createReactClass from "create-react-class";
import dateFormat from "dateformat";
import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import defined from "terriajs-cesium/Source/Core/defined";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import TimelineControls from "./TimelineControls";
import CesiumTimeline from "./CesiumTimeline";
import DateTimePicker from "./DateTimePicker";
import { formatDateTime } from "./DateFormats";
import { withTranslation } from "react-i18next";
import Styles from "./timeline.scss";
import CommonStrata from "../../../Models/Definition/CommonStrata";
export const Timeline = observer(createReactClass({
    displayName: "Timeline",
    propTypes: {
        terria: PropTypes.object.isRequired,
        locale: PropTypes.object,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            isPickerOpen: false
        };
    },
    changeDateTime(time) {
        this.props.terria.timelineClock.currentTime = JulianDate.fromDate(new Date(time));
        this.props.terria.timelineStack.syncToClock(CommonStrata.user);
        this.props.terria.currentViewer.notifyRepaintRequired();
    },
    onOpenPicker() {
        this.setState({
            isPickerOpen: true
        });
    },
    onClosePicker() {
        this.setState({
            isPickerOpen: false
        });
    },
    render() {
        const terria = this.props.terria;
        const catalogItem = terria.timelineStack.top;
        if (!defined(catalogItem) ||
            !defined(catalogItem.currentTimeAsJulianDate)) {
            return null;
        }
        const { t } = this.props;
        const jsDate = JulianDate.toDate(catalogItem.currentTimeAsJulianDate);
        const timelineStack = this.props.terria.timelineStack;
        let currentTime;
        if (defined(timelineStack.top) && defined(timelineStack.top.dateFormat)) {
            currentTime = dateFormat(jsDate, this.props.terria.timelineStack.top.dateFormat);
        }
        else {
            currentTime = formatDateTime(jsDate, this.props.locale);
        }
        const discreteTimes = catalogItem.discreteTimesAsSortedJulianDates;
        const objectifiedDates = catalogItem.objectifiedDates;
        const currentDiscreteJulianDate = catalogItem.currentDiscreteJulianDate;
        return (React.createElement("div", { className: Styles.timeline },
            React.createElement("div", { className: Styles.textRow, css: `
              background: ${p => p.theme.dark};
            ` },
                React.createElement("div", { className: Styles.textCell, title: t("dateTime.timeline.textCell") },
                    React.createElement("div", { className: Styles.layerNameTruncated }, catalogItem.name),
                    currentTime)),
            React.createElement("div", { className: Styles.controlsRow },
                React.createElement(TimelineControls, { clock: terria.timelineClock, analytics: terria.analytics, currentViewer: terria.currentViewer }),
                React.createElement(If, { condition: defined(discreteTimes) &&
                        discreteTimes.length !== 0 &&
                        defined(currentDiscreteJulianDate) },
                    React.createElement(DateTimePicker, { currentDate: JulianDate.toDate(currentDiscreteJulianDate), dates: objectifiedDates, onChange: this.changeDateTime, openDirection: "up", isOpen: this.state.isPickerOpen, onOpen: this.onOpenPicker, onClose: this.onClosePicker, dateFormat: catalogItem.dateFormat })),
                React.createElement(CesiumTimeline, { terria: terria }))));
    }
}));
export default withTranslation()(Timeline);
//# sourceMappingURL=Timeline.js.map