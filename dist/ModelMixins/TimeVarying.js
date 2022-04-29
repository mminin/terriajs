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