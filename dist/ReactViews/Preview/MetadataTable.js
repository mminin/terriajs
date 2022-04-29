import React from "react";
import { isArrayLike } from "mobx";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./metadata-table.scss";
/**
 * Displays a table showing the name and values of items in a MetadataItem.
 */
const MetadataTable = createReactClass({
    displayName: "MetadataTable",
    propTypes: {
        metadataItem: PropTypes.object.isRequired // A MetadataItem instance.
    },
    render() {
        const metadataItem = this.props.metadataItem;
        const keys = Object.keys(metadataItem);
        const isArr = isArrayLike(metadataItem);
        if (keys.length === 0 && !isArr)
            return null;
        return (React.createElement("div", { className: Styles.root },
            React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement(Choose, null,
                        React.createElement(When, { condition: isArr },
                            React.createElement(If, { condition: metadataItem.length > 0 && isJoinable(metadataItem) },
                                React.createElement("tr", null,
                                    React.createElement("td", null, metadataItem.join(", "))))),
                        React.createElement(When, { condition: keys.length > 0 && !isArr },
                            React.createElement(For, { each: "key", index: "i", of: keys },
                                React.createElement("tr", { key: i },
                                    React.createElement("th", { className: Styles.name }, key),
                                    React.createElement("td", { className: Styles.value },
                                        React.createElement(Choose, null,
                                            React.createElement(When, { condition: typeof metadataItem[key] === "object" },
                                                React.createElement(MetadataTable, { metadataItem: metadataItem[key] })),
                                            React.createElement(When, { condition: isArrayLike(metadataItem[key]) },
                                                React.createElement(If, { condition: metadataItem[key].length > 0 &&
                                                        isJoinable(metadataItem[key]) }, metadataItem[key].join(", "))),
                                            React.createElement(Otherwise, null, metadataItem[key])))))))))));
    }
});
/**
 * @param  {Object}  obj
 * @return {Boolean} Returns true if the object obj is a string or a number.
 * @private
 */
function isStringOrNumber(obj) {
    return (typeof obj === "string" || obj instanceof String || !isNaN(parseFloat(obj)));
}
/**
 * @param  {Array} array
 * @return {Boolean} Returns true if the array only contains objects which can be joined.
 * @private
 */
function isJoinable(array) {
    return array.every(isStringOrNumber);
}
export default MetadataTable;
//# sourceMappingURL=MetadataTable.js.map