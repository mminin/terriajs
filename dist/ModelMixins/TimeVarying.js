/** To use as precision in JulianDate.toIso8601(date, precision) - so we don't get scientific/exponent in date string (eg `2008-05-07T22:54:45.7275957614183426e-11Z`).
 * Is set to nanosecond precision
 */
export const DATE_SECONDS_PRECISION = 9;
var TimeVarying;
(function (TimeVarying) {
    function is(model) {
        return ("currentTimeAsJulianDate" in model &&
            "startTimeAsJulianDate" in model &&
            "stopTimeAsJulianDate" in model);
    }
    TimeVarying.is = is;
})(TimeVarying || (TimeVarying = {}));
export default TimeVarying;
//# sourceMappingURL=TimeVarying.js.map