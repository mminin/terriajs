import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./data-preview.scss";
/**
 * URL section of the preview.
 */
const DataPreviewUrl = createReactClass({
    displayName: "DataPreviewUrl",
    propTypes: {
        metadataItem: PropTypes.object.isRequired
    },
    selectUrl(e) {
        e.target.select();
    },
    render() {
        return (React.createElement("div", null,
            React.createElement("h4", { className: Styles.h4 },
                this.props.metadataItem.typeName,
                " URL"),
            React.createElement(If, { condition: this.props.metadataItem.type === "wms" },
                React.createElement("p", null,
                    React.createElement(Trans, { i18nKey: "description.wms" },
                        "This is a",
                        React.createElement("a", { href: "https://en.wikipedia.org/wiki/Web_Map_Service", target: "_blank", rel: "noopener noreferrer" }, "WMS service"),
                        ", which generates map images on request. It can be used in GIS software with this URL:"))),
            React.createElement(If, { condition: this.props.metadataItem.type === "wfs" },
                React.createElement("p", null,
                    React.createElement(Trans, { i18nKey: "description.wfs" },
                        "This is a",
                        React.createElement("a", { href: "https://en.wikipedia.org/wiki/Web_Feature_Service", target: "_blank", rel: "noopener noreferrer" }, "WFS service"),
                        ", which transfers raw spatial data on request. It can be used in GIS software with this URL:"))),
            React.createElement("input", { readOnly: true, className: Styles.field, type: "text", value: this.props.metadataItem.url, onClick: this.selectUrl }),
            React.createElement(If, { condition: this.props.metadataItem.type === "wms" ||
                    (this.props.metadataItem.type === "esri-mapServer" &&
                        this.props.metadataItem.layers) },
                React.createElement("p", null,
                    "Layer name",
                    this.props.metadataItem.layers.split(",").length > 1
                        ? "s"
                        : "",
                    ": ",
                    this.props.metadataItem.layers)),
            React.createElement(If, { condition: this.props.metadataItem.type === "wfs" },
                React.createElement("p", null,
                    "Type name",
                    this.props.metadataItem.typeNames.split(",").length > 1 ? "s" : "",
                    ": ",
                    this.props.metadataItem.typeNames))));
    }
});
export default DataPreviewUrl;
//# sourceMappingURL=DataPreviewUrl.js.map