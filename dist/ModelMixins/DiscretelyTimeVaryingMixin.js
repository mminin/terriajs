var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, runInAction } from "mobx";
import binarySearch from "terriajs-cesium/Source/Core/binarySearch";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import getChartColorForId from "../Charts/getChartColorForId";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import TerriaError from "../Core/TerriaError";
import ChartableMixin, { calculateDomain } from "../ModelMixins/ChartableMixin";
import CommonStrata from "../Models/Definition/CommonStrata";
import { DATE_SECONDS_PRECISION } from "./TimeVarying";
function DiscretelyTimeVaryingMixin(Base) {
    class DiscretelyTimeVaryingMixin extends ChartableMixin(Base) {
        get hasDiscreteTimes() {
            return true;
        }
        get currentTime() {
            const time = super.currentTime;
            if (time === undefined || time === null) {
                if (this.initialTimeSource === "now") {
                    return JulianDate.toIso8601(JulianDate.now(), DATE_SECONDS_PRECISION);
                }
                else if (this.initialTimeSource === "start") {
                    return this.startTime;
                }
                else if (this.initialTimeSource === "stop") {
                    return this.stopTime;
                }
                else if (this.initialTimeSource === "none") {
                    return undefined;
                }
                else {
                    throw new TerriaError({
                        sender: this,
                        title: "Invalid initialTime value",
                        message: "The `initialTime` property has an invalid value: `" +
                            this.initialTimeSource +
                            "`."
                    });
                }
            }
            return time;
        }
        get currentTimeAsJulianDate() {
            return toJulianDate(this.currentTime);
        }
        get startTimeAsJulianDate() {
            return toJulianDate(this.startTime);
        }
        get stopTimeAsJulianDate() {
            return toJulianDate(this.stopTime);
        }
        get objectifiedDates() {
            if (!isDefined(this.discreteTimesAsSortedJulianDates)) {
                return { index: [], dates: [] };
            }
            const jsDates = this.discreteTimesAsSortedJulianDates.map((julianDate) => JulianDate.toDate(julianDate.time));
            return objectifyDates(jsDates);
        }
        get discreteTimesAsSortedJulianDates() {
            const discreteTimes = this.discreteTimes;
            if (discreteTimes === undefined) {
                return undefined;
            }
            const asJulian = [];
            for (let i = 0; i < discreteTimes.length; i++) {
                const dt = discreteTimes[i];
                try {
                    if (dt.time !== undefined) {
                        const time = JulianDate.fromIso8601(dt.time);
                        asJulian.push({
                            time,
                            tag: dt.tag !== undefined ? dt.tag : dt.time
                        });
                    }
                }
                catch { }
            }
            asJulian.sort((a, b) => JulianDate.compare(a.time, b.time));
            return asJulian;
        }
        getDiscreteTimeIndex(time) {
            const discreteTimes = this.discreteTimesAsSortedJulianDates;
            if (discreteTimes === undefined || discreteTimes.length === 0) {
                return undefined;
            }
            // Where does `time` fit in our sequence of discrete times?
            const exactIndex = binarySearch(discreteTimes, time, (candidate, currentTime) => JulianDate.compare(candidate.time, currentTime));
            // We have this exact time in our discrete times
            if (exactIndex >= 0) {
                return exactIndex;
            }
            // This is where `time` could be inserted into the discrete times list so that they're all in sorted order
            const nextIndex = ~exactIndex;
            if (nextIndex === 0 || this.fromContinuous === "next") {
                // Before the first, or we want the next time no matter which is closest
                return nextIndex;
            }
            else if (nextIndex === discreteTimes.length ||
                this.fromContinuous === "previous") {
                // After the last, or we want the previous time no matter which is closest
                return nextIndex - 1;
            }
            else {
                // Get the closest discrete time
                const previousTime = discreteTimes[nextIndex - 1].time;
                const nextTime = discreteTimes[nextIndex].time;
                const timeFromPrevious = JulianDate.secondsDifference(time, previousTime);
                const timeToNext = JulianDate.secondsDifference(nextTime, time);
                if (timeToNext > timeFromPrevious) {
                    return nextIndex - 1;
                }
                else {
                    return nextIndex;
                }
            }
        }
        get currentDiscreteTimeIndex() {
            return (this.currentTimeAsJulianDate &&
                this.getDiscreteTimeIndex(this.currentTimeAsJulianDate));
        }
        get nextDiscreteTimeIndex() {
            const index = this.currentDiscreteTimeIndex;
            if (index === undefined ||
                index === this.discreteTimesAsSortedJulianDates.length - 1) {
                return undefined;
            }
            return index + 1;
        }
        get previousDiscreteTimeIndex() {
            const index = this.currentDiscreteTimeIndex;
            if (index === undefined || index === 0) {
                return undefined;
            }
            return index - 1;
        }
        get currentDiscreteJulianDate() {
            const index = this.currentDiscreteTimeIndex;
            return index === undefined
                ? undefined
                : this.discreteTimesAsSortedJulianDates[index].time;
        }
        get currentDiscreteTimeTag() {
            const index = this.currentDiscreteTimeIndex;
            return index === undefined
                ? undefined
                : this.discreteTimesAsSortedJulianDates[index].tag;
        }
        get previousDiscreteTimeTag() {
            const index = this.previousDiscreteTimeIndex;
            return index === undefined
                ? undefined
                : this.discreteTimesAsSortedJulianDates[index].tag;
        }
        get nextDiscreteTimeTag() {
            const index = this.nextDiscreteTimeIndex;
            return index === undefined
                ? undefined
                : this.discreteTimesAsSortedJulianDates[index].tag;
        }
        get isPreviousDiscreteTimeAvailable() {
            return this.previousDiscreteTimeIndex !== undefined;
        }
        get isNextDiscreteTimeAvailable() {
            return this.nextDiscreteTimeIndex !== undefined;
        }
        get startTime() {
            const time = super.startTime;
            if (time === undefined &&
                this.discreteTimesAsSortedJulianDates &&
                this.discreteTimesAsSortedJulianDates.length > 0) {
                return JulianDate.toIso8601(this.discreteTimesAsSortedJulianDates[0].time, DATE_SECONDS_PRECISION);
            }
            return time;
        }
        get stopTime() {
            const time = super.stopTime;
            if (time === undefined &&
                this.discreteTimesAsSortedJulianDates &&
                this.discreteTimesAsSortedJulianDates.length > 0) {
                return JulianDate.toIso8601(this.discreteTimesAsSortedJulianDates[this.discreteTimesAsSortedJulianDates.length - 1].time, DATE_SECONDS_PRECISION);
            }
            return time;
        }
        /**
         * Try to calculate a multiplier which results in a new time step every {this.multiplierDefaultDeltaStep} seconds. For example, if {this.multiplierDefaultDeltaStep = 5} it would set the `multiplier` so that a new time step (of this dataset) would appear every five seconds (on average) if the timeline is playing.
         */
        get multiplier() {
            if (super.multiplier)
                return super.multiplier;
            if (!isDefined(this.startTimeAsJulianDate) ||
                !isDefined(this.stopTimeAsJulianDate) ||
                !isDefined(this.multiplierDefaultDeltaStep) ||
                !isDefined(this.discreteTimesAsSortedJulianDates))
                return;
            const dSeconds = (this.stopTimeAsJulianDate.dayNumber -
                this.startTimeAsJulianDate.dayNumber) *
                24 *
                60 *
                60 +
                this.stopTimeAsJulianDate.secondsOfDay -
                this.startTimeAsJulianDate.secondsOfDay;
            const meanDSeconds = dSeconds / this.discreteTimesAsSortedJulianDates.length;
            return meanDSeconds / this.multiplierDefaultDeltaStep;
        }
        moveToPreviousDiscreteTime(stratumId) {
            const index = this.previousDiscreteTimeIndex;
            if (index === undefined) {
                return;
            }
            this.setTrait(stratumId, "currentTime", JulianDate.toIso8601(this.discreteTimesAsSortedJulianDates[index].time, DATE_SECONDS_PRECISION));
        }
        moveToNextDiscreteTime(stratumId) {
            const index = this.nextDiscreteTimeIndex;
            if (index === undefined) {
                return;
            }
            this.setTrait(stratumId, "currentTime", JulianDate.toIso8601(this.discreteTimesAsSortedJulianDates[index].time, DATE_SECONDS_PRECISION));
        }
        get momentChart() {
            if (!this.showInChartPanel || !this.discreteTimesAsSortedJulianDates)
                return;
            const points = this.discreteTimesAsSortedJulianDates.map((dt) => ({
                x: JulianDate.toDate(dt.time),
                y: 0.5,
                isSelected: this.currentDiscreteJulianDate &&
                    this.currentDiscreteJulianDate.equals(dt.time)
            }));
            const colorId = `color-${this.name}`;
            return {
                item: this,
                name: this.name || "",
                categoryName: this.name,
                key: `key${this.uniqueId}-${this.name}`,
                type: this.chartType || "momentLines",
                glyphStyle: this.chartGlyphStyle,
                xAxis: { scale: "time" },
                points,
                domain: { ...calculateDomain(points), y: [0, 1] },
                showInChartPanel: this.show && this.showInChartPanel,
                isSelectedInWorkbench: this.showInChartPanel,
                updateIsSelectedInWorkbench: (isSelected) => {
                    runInAction(() => {
                        this.setTrait(CommonStrata.user, "showInChartPanel", isSelected);
                    });
                },
                getColor: () => {
                    return this.chartColor
                        ? this.chartColor
                        : getChartColorForId(colorId);
                },
                onClick: (point) => {
                    runInAction(() => {
                        this.setTrait(CommonStrata.user, "currentTime", point.x.toISOString());
                    });
                }
            };
        }
        get chartItems() {
            return filterOutUndefined([this.momentChart]);
        }
    }
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "currentTime", null);
    __decorate([
        computed({ equals: JulianDate.equals })
    ], DiscretelyTimeVaryingMixin.prototype, "currentTimeAsJulianDate", null);
    __decorate([
        computed({ equals: JulianDate.equals })
    ], DiscretelyTimeVaryingMixin.prototype, "startTimeAsJulianDate", null);
    __decorate([
        computed({ equals: JulianDate.equals })
    ], DiscretelyTimeVaryingMixin.prototype, "stopTimeAsJulianDate", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "objectifiedDates", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "discreteTimesAsSortedJulianDates", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "currentDiscreteTimeIndex", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "nextDiscreteTimeIndex", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "previousDiscreteTimeIndex", null);
    __decorate([
        computed({ equals: JulianDate.equals })
    ], DiscretelyTimeVaryingMixin.prototype, "currentDiscreteJulianDate", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "currentDiscreteTimeTag", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "previousDiscreteTimeTag", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "nextDiscreteTimeTag", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "isPreviousDiscreteTimeAvailable", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "isNextDiscreteTimeAvailable", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "startTime", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "stopTime", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "multiplier", null);
    __decorate([
        action
    ], DiscretelyTimeVaryingMixin.prototype, "moveToPreviousDiscreteTime", null);
    __decorate([
        action
    ], DiscretelyTimeVaryingMixin.prototype, "moveToNextDiscreteTime", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "momentChart", null);
    __decorate([
        computed
    ], DiscretelyTimeVaryingMixin.prototype, "chartItems", null);
    return DiscretelyTimeVaryingMixin;
}
(function (DiscretelyTimeVaryingMixin) {
    function isMixedInto(model) {
        return model && model.hasDiscreteTimes;
    }
    DiscretelyTimeVaryingMixin.isMixedInto = isMixedInto;
})(DiscretelyTimeVaryingMixin || (DiscretelyTimeVaryingMixin = {}));
export default DiscretelyTimeVaryingMixin;
function toJulianDate(time) {
    if (time === undefined || time === null) {
        return undefined;
    }
    // JS's data parser produces some bizarre dates from bad strings without complaint, so we need to do some basic validation
    if (time.includes("NaN")) {
        return undefined;
    }
    const julianDate = JulianDate.fromIso8601(time);
    // Don't return an invalid JulianDate
    if (julianDate.secondsOfDay === NaN || julianDate.dayNumber === NaN)
        return undefined;
    return julianDate;
}
/**
 * Process an array of dates into layered objects of years, months and days.
 * @param  {Date[]} An array of dates.
 * @return {Object} Returns an object whose keys are years, whose values are objects whose keys are months (0=Jan),
 *   whose values are objects whose keys are days, whose values are arrays of all the datetimes on that day.
 */
function objectifyDates(dates) {
    let result = { index: [], dates };
    for (let i = 0; i < dates.length; i++) {
        let date = dates[i];
        let year = date.getFullYear();
        let century = Math.floor(year / 100);
        let month = date.getMonth();
        let day = date.getDate();
        let hour = date.getHours();
        // ObjectifiedDates
        if (!result[century]) {
            result[century] = { index: [], dates: [] };
            result.index.push(century);
        }
        result[century].dates.push(date);
        // ObjectifiedYears
        if (!result[century][year]) {
            result[century][year] = { index: [], dates: [] };
            result[century].index.push(year);
        }
        result[century][year].dates.push(date);
        // ObjectifiedMonths
        if (!result[century][year][month]) {
            result[century][year][month] = { index: [], dates: [] };
            result[century][year].index.push(month);
        }
        result[century][year][month].dates.push(date);
        // ObjectifiedDays
        if (!result[century][year][month][day]) {
            result[century][year][month][day] = { index: [], dates: [] };
            result[century][year][month].index.push(day);
        }
        result[century][year][month][day].dates.push(date);
        // ObjectifiedHours
        if (!result[century][year][month][day][hour]) {
            result[century][year][month][day][hour] = [];
            result[century][year][month][day].index.push(hour);
        }
        result[century][year][month][day][hour].push(date);
    }
    return result;
}
//# sourceMappingURL=DiscretelyTimeVaryingMixin.js.map