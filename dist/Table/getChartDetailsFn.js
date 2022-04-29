export default function getChartDetailsFn(style, rowIds) {
    return () => {
        var _a, _b, _c;
        if (!style.timeColumn || !style.colorColumn || rowIds.length < 2)
            return {};
        const chartColumns = [style.timeColumn, style.colorColumn];
        const csvData = [
            chartColumns.map(col => col.title).join(","),
            ...rowIds.map(i => chartColumns.map(col => col.valueFunctionForType(i)).join(","))
        ].join("\n");
        return {
            title: (_a = style.colorColumn) === null || _a === void 0 ? void 0 : _a.title,
            xName: (_b = style.timeColumn) === null || _b === void 0 ? void 0 : _b.title,
            yName: (_c = style.colorColumn) === null || _c === void 0 ? void 0 : _c.title,
            units: chartColumns.map(column => column.units || ""),
            csvData
        };
    };
}
//# sourceMappingURL=getChartDetailsFn.js.map