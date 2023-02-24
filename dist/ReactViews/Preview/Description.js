import createReactClass from "create-react-class";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import defined from "terriajs-cesium/Source/Core/defined";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Collapsible from "../Custom/Collapsible/Collapsible";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import DataPreviewSections from "./DataPreviewSections";
import ExportData from "./ExportData";
import Styles from "./mappable-preview.scss";
import MetadataTable from "./MetadataTable";
import WarningBox from "./WarningBox";
/**
 * CatalogItem description.
 */
const Description = observer(createReactClass({
    displayName: "Description",
    propTypes: {
        item: PropTypes.object.isRequired,
        printView: PropTypes.bool,
        t: PropTypes.func.isRequired
    },
    render() {
        var _a, _b, _c, _d, _e, _f;
        const { t } = this.props;
        const catalogItem = this.props.item;
        // Make sure all data and metadata URLs have `url` set
        const metadataUrls = (_a = catalogItem.metadataUrls) === null || _a === void 0 ? void 0 : _a.filter((m) => m.url);
        const dataUrls = (_b = catalogItem.dataUrls) === null || _b === void 0 ? void 0 : _b.filter((m) => m.url);
        return (React.createElement("div", { className: Styles.description, css: `
            a,
            a:visited {
              color: ${(p) => p.theme.colorPrimary};
            }
          ` },
            React.createElement(If, { condition: catalogItem.isExperiencingIssues },
                React.createElement(WarningBox, null, t("preview.mayBeExperiencingIssues"))),
            React.createElement(If, { condition: catalogItem.description && catalogItem.description.length > 0 },
                React.createElement("div", null,
                    React.createElement("h4", { className: Styles.h4 }, t("description.name")),
                    parseCustomMarkdownToReact(catalogItem.description, {
                        catalogItem: catalogItem
                    }))),
            React.createElement(If, { condition: catalogItem.hasLocalData },
                React.createElement("p", null, t("description.dataLocal"))),
            React.createElement(If, { condition: !catalogItem.hasLocalData && !catalogItem.hasDescription },
                React.createElement("p", null, t("description.dataNotLocal"))),
            React.createElement(If, { condition: metadataUrls && metadataUrls.length > 0 },
                React.createElement("h4", { className: Styles.h4 }, t("description.metadataUrls")),
                React.createElement(For, { each: "metadataUrl", index: "i", of: metadataUrls },
                    React.createElement(Box, { paddedVertically: true, key: metadataUrl.url },
                        React.createElement("a", { href: metadataUrl.url, target: "_blank", rel: "noopener noreferrer", className: `${Styles.link} description-metadataUrls`, css: `
                    color: ${(p) => p.theme.colorPrimary};
                  ` },
                            React.createElement(If, { condition: metadataUrl.title },
                                React.createElement(Button, { primary: true }, metadataUrl.title)),
                            React.createElement(If, { condition: !metadataUrl.title }, metadataUrl.url))))),
            React.createElement(DataPreviewSections, { metadataItem: catalogItem }),
            React.createElement(If, { condition: catalogItem.dataCustodian && catalogItem.dataCustodian.length > 0 },
                React.createElement("div", null,
                    React.createElement("h4", { className: Styles.h4 }, t("description.dataCustodian")),
                    parseCustomMarkdownToReact(catalogItem.dataCustodian, {
                        catalogItem: catalogItem
                    }))),
            React.createElement(If, { condition: !catalogItem.hideSource },
                React.createElement(If, { condition: catalogItem.url },
                    React.createElement("h4", { className: Styles.h4 },
                        catalogItem.typeName,
                        " URL"),
                    React.createElement(Choose, null,
                        React.createElement(When, { condition: catalogItem.type === "wms" },
                            React.createElement("p", { key: "wms-description" },
                                React.createElement(Trans, { i18nKey: "description.wms" },
                                    "This is a",
                                    React.createElement("a", { href: "https://en.wikipedia.org/wiki/Web_Map_Service", target: "_blank", rel: "noopener noreferrer" }, "WMS service"),
                                    ", which generates map images on request. It can be used in GIS software with this URL:"))),
                        React.createElement(When, { condition: catalogItem.type === "wfs" },
                            React.createElement("p", { key: "wfs-description" },
                                React.createElement(Trans, { i18nKey: "description.wfs" },
                                    "This is a",
                                    React.createElement("a", { href: "https://en.wikipedia.org/wiki/Web_Feature_Service", target: "_blank", rel: "noopener noreferrer" }, "WFS service"),
                                    ", which transfers raw spatial data on request. It can be used in GIS software with this URL:")))),
                    React.createElement(Choose, null,
                        React.createElement(When, { condition: this.props.printView },
                            React.createElement("code", null, catalogItem.url)),
                        React.createElement(Otherwise, null,
                            React.createElement("input", { readOnly: true, className: Styles.field, type: "text", value: catalogItem.url, onClick: (e) => e.target.select() }))),
                    React.createElement(Choose, null,
                        React.createElement(When, { condition: catalogItem.type === "wms" ||
                                (catalogItem.type === "esri-mapServer" &&
                                    defined(catalogItem.layers)) },
                            React.createElement("p", { key: "wms-layers" },
                                t("description.layerName"),
                                (catalogItem.layers || "").split(",").length > 1
                                    ? "s"
                                    : "",
                                ": ",
                                catalogItem.layers)),
                        React.createElement(When, { condition: catalogItem.type === "wfs" },
                            React.createElement("p", { key: "wfs-typeNames" },
                                t("description.typeName"),
                                (catalogItem.typeNames || "").split(",").length > 1
                                    ? "s"
                                    : "",
                                ": ",
                                catalogItem.typeNames)))),
                React.createElement(If, { condition: dataUrls && dataUrls.length > 0 },
                    React.createElement("h4", { className: Styles.h4 }, t("description.dataUrl")),
                    React.createElement(For, { each: "dataUrl", index: "i", of: dataUrls },
                        React.createElement(Choose, null,
                            React.createElement(When, { condition: ((_c = dataUrl.type) === null || _c === void 0 ? void 0 : _c.startsWith("wfs")) || ((_d = dataUrl.type) === null || _d === void 0 ? void 0 : _d.startsWith("wcs")) },
                                ((_e = dataUrl.type) === null || _e === void 0 ? void 0 : _e.startsWith("wfs")) &&
                                    parseCustomMarkdownToReact(t("description.useLinkBelow", {
                                        link: `
                          <a
                            href="http://docs.geoserver.org/latest/en/user/services/wfs/reference.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            key="wfs"
                          >
                            Web Feature Service (WFS) documentation
                          </a>
                        `
                                    })),
                                ((_f = dataUrl.type) === null || _f === void 0 ? void 0 : _f.startsWith("wcs")) &&
                                    parseCustomMarkdownToReact(t("description.useLinkBelow", {
                                        link: `
                          <a
                            href="http://docs.geoserver.org/latest/en/user/services/wcs/reference.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            key="wms"
                          >
                            Web Coverage Service (WCS) documentation
                          </a>
                        `
                                    })))),
                        React.createElement(Box, { paddedVertically: true, key: dataUrl.url },
                            React.createElement("a", { href: dataUrl.url, target: "_blank", rel: "noopener noreferrer", className: `${Styles.link} description-dataUrls`, css: `
                      color: ${(p) => p.theme.colorPrimary};
                    ` },
                                React.createElement(If, { condition: dataUrl.title },
                                    React.createElement(Button, { primary: true }, dataUrl.title)),
                                React.createElement(If, { condition: !dataUrl.title }, dataUrl.url))))),
                React.createElement(If, { condition: !this.props.printView && defined(catalogItem.metadata) },
                    React.createElement(If, { condition: defined(catalogItem.metadata.dataSourceMetadata) &&
                            catalogItem.metadata.dataSourceMetadata.items.length > 0 },
                        React.createElement("div", { className: Styles.metadata },
                            React.createElement(Collapsible, { title: t("description.dataSourceDetails"), isInverse: true },
                                React.createElement(MetadataTable, { metadataItem: catalogItem.metadata.dataSourceMetadata })))),
                    React.createElement(If, { condition: defined(catalogItem.metadata.dataSourceMetadata) &&
                            catalogItem.metadata.dataSourceMetadata.items.length > 0 },
                        React.createElement("div", { className: Styles.metadata },
                            React.createElement(Collapsible, { title: t("description.dataServiceDetails"), isInverse: true },
                                React.createElement(MetadataTable, { metadataItem: catalogItem.metadata.serviceMetadata })))))),
            !this.props.printView ? (React.createElement(ExportData, { item: catalogItem })) : null));
    }
}));
export default withTranslation()(Description);
//# sourceMappingURL=Description.js.map