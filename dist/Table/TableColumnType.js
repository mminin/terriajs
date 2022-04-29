var TableColumnType;
(function (TableColumnType) {
    TableColumnType[TableColumnType["longitude"] = 0] = "longitude";
    TableColumnType[TableColumnType["latitude"] = 1] = "latitude";
    TableColumnType[TableColumnType["height"] = 2] = "height";
    TableColumnType[TableColumnType["time"] = 3] = "time";
    TableColumnType[TableColumnType["scalar"] = 4] = "scalar";
    TableColumnType[TableColumnType["enum"] = 5] = "enum";
    TableColumnType[TableColumnType["region"] = 6] = "region";
    TableColumnType[TableColumnType["text"] = 7] = "text";
    TableColumnType[TableColumnType["address"] = 8] = "address";
    TableColumnType[TableColumnType["hidden"] = 9] = "hidden";
})(TableColumnType || (TableColumnType = {}));
export function stringToTableColumnType(s) {
    return TableColumnType[s];
}
export default TableColumnType;
//# sourceMappingURL=TableColumnType.js.map