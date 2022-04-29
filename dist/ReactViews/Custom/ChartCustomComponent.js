import { runInAction } from "mobx";
import React from "react";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import filterOutUndefined from "../../Core/filterOutUndefined";
import { getName } from "../../ModelMixins/CatalogMemberMixin";
import SplitItemReference from "../../Models/Catalog/CatalogReferences/SplitItemReference";
import CommonStrata from "../../Models/Definition/CommonStrata";
import createStratumInstance from "../../Models/Definition/createStratumInstance";
import hasTraits from "../../Models/Definition/hasTraits";
import ChartPointOnMapTraits from "../../Traits/TraitsClasses/ChartPointOnMapTraits";
import DiscretelyTimeVaryingTraits from "../../Traits/TraitsClasses/DiscretelyTimeVaryingTraits";
import LatLonHeightTraits from "../../Traits/TraitsClasses/LatLonHeightTraits";
import ChartPreviewStyles from "./Chart/chart-preview.scss";
import ChartExpandAndDownloadButtons from "./Chart/ChartExpandAndDownloadButtons";
import Chart from "./Chart/FeatureInfoPanelChart";
import CustomComponent from "./CustomComponent";
/**
 * A chart custom component. It displays an interactive chart along with
 * "expand" and "download" buttons. The expand button adds a catalog item with
 * the data to the workbench, causing it to be displayed on the Chart Panel.
 * The chart detects if it appears in the second column of a <table> and, if so,
 * rearranges itself to span two columns.
 *
 * See {see ChartCustomComponentAttributes} for a full list of attributes.
 *
 * Provide the data in one of these four ways:
 * - [sources]:        {see ChartCustomComponentAttributes.sources}
 * - [source-names]:   {see ChartCustomComponentAttributes.sourceNames}
 * - [downloads]:      {see ChartCustomComponentAttributes.downloads}
 * - [download-names]: {see ChartCustomComponentAttributes.downloadNames}
 * Or:
 * - [src]:          {see ChartCustomComponentAttributes.src}
 * - [src-preview]:  {see ChartCustomComponentAttributes.srcPreview}
 * Or:
 * - [data]:        {see ChartCustomComponentAttributes.data}
 * Or:
 * - None of the above, but supply csv or json-formatted data as the content of the chart data, with \n for newlines.
 *                   Eg. `<chart>time,a,b\n2016-01-01,2,3\n2016-01-02,5,6</chart>`.
 *                   or  `<chart>[["x","y","z"],[1,10,3],[2,15,9],[3,8,12],[5,25,4]]</chart>`.
 */
export default class ChartCustomComponent extends CustomComponent {
    constructor() {
        super(...arguments);
        /**
         * For some catalog types, for the chart item to be shareable, it needs to be
         * constructed as a reference to the original item. This method can be
         * overriden to make a shareable chart. See SOSChartCustomComponent for an
         * implementation.
         *
         * This method is used only for constructing a chart item to show
         * in the chart panel, not for the feature info panel chart item.
         */
        this.constructShareableCatalogItem = undefined;
    }
    get attributes() {
        return [
            "src",
            "src-preview",
            "sources",
            "source-names",
            "downloads",
            "download-names",
            "preview-x-label",
            "data",
            "identifier",
            "x-column",
            "y-column",
            "y-columns",
            "column-titles",
            "column-units",
            "styling",
            "highlight-x",
            "title",
            "can-download",
            "hide-buttons"
        ];
    }
    shouldProcessNode(context, node) {
        return (this.isChart(node) ||
            this.isFirstColumnOfChartRow(node) ||
            this.isSecondColumnOfChartRow(node));
    }
    processNode(context, node, children, index) {
        if (this.isChart(node)) {
            return this.processChart(context, node, children, index);
        }
        else if (this.isFirstColumnOfChartRow(node)) {
            return this.processFirstColumn(context, node, children, index);
        }
        else if (this.isSecondColumnOfChartRow(node)) {
            return this.processSecondColumn(context, node, children, index);
        }
        throw new DeveloperError("processNode called unexpectedly.");
    }
    /**
     * Is this node the chart element itself?
     * @param node The node to test.
     */
    isChart(node) {
        return node.name === this.name;
    }
    processChart(context, node, children, index) {
        var _a;
        if (node.attribs === undefined ||
            !context.terria ||
            !context.feature ||
            !context.catalogItem) {
            return undefined;
        }
        checkAllPropertyKeys(node.attribs, this.attributes);
        const featurePosition = getFeaturePosition(context.feature);
        const attrs = this.parseNodeAttrs(node.attribs);
        const child = children[0];
        const body = typeof child === "string" ? child : undefined;
        const chartElements = [];
        this.chartItemId = (_a = this.chartItemId) !== null && _a !== void 0 ? _a : createGuid();
        if (!attrs.hideButtons) {
            // Build expand/download buttons
            const sourceItems = (attrs.downloads || attrs.sources || [""]).map((source, i) => {
                // When expanding a chart for this item and there is already an
                // expanded chart for the item, there are 2 possibilities.
                // 1. Remove it an show the new chart
                // 2. Show the new chart alongside the existing chart
                //
                // If title & source names for the two expanded charts are the same then
                // we only show the latest one, otherwise we show both.
                // To do this we make the id dependant on the parentId, title & source.
                const id = `${context.catalogItem.uniqueId}:${attrs.title}:${source}`;
                const itemOrPromise = this.constructShareableCatalogItem
                    ? this.constructShareableCatalogItem(id, context, undefined)
                    : this.constructCatalogItem(id, context, undefined);
                return Promise.resolve(itemOrPromise).then(item => {
                    var _a;
                    if (item) {
                        this.setTraitsFromParent(item, context.catalogItem);
                        this.setTraitsFromAttrs(item, attrs, i);
                        body && ((_a = this.setTraitsFromBody) === null || _a === void 0 ? void 0 : _a.call(this, item, body));
                        if (featurePosition &&
                            hasTraits(item, ChartPointOnMapTraits, "chartPointOnMap")) {
                            item.setTrait(CommonStrata.user, "chartPointOnMap", createStratumInstance(LatLonHeightTraits, featurePosition));
                        }
                    }
                    return item;
                });
            });
            chartElements.push(React.createElement(ChartExpandAndDownloadButtons, {
                key: "button",
                terria: context.terria,
                sourceItems: sourceItems,
                sourceNames: attrs.sourceNames,
                canDownload: attrs.canDownload === true,
                downloads: attrs.downloads,
                downloadNames: attrs.downloadNames,
                raiseToTitle: !!getInsertedTitle(node)
            }));
        }
        // Build chart item to show in the info panel
        const chartItem = this.constructCatalogItem(this.chartItemId, context, undefined);
        if (chartItem) {
            runInAction(() => {
                var _a;
                this.setTraitsFromParent(chartItem, context.catalogItem);
                this.setTraitsFromAttrs(chartItem, attrs, 0);
                body && ((_a = this.setTraitsFromBody) === null || _a === void 0 ? void 0 : _a.call(this, chartItem, body));
            });
            chartElements.push(React.createElement(Chart, {
                key: "chart",
                terria: context.terria,
                item: chartItem,
                xAxisLabel: attrs.previewXLabel,
                height: 110
                // styling: attrs.styling,
                // highlightX: attrs.highlightX,
                // transitionDuration: 300
            }));
        }
        return React.createElement("div", {
            key: "chart-wrapper",
            className: ChartPreviewStyles.previewChartWrapper
        }, chartElements);
    }
    setTraitsFromParent(chartItem, parentItem) {
        if (hasTraits(chartItem, DiscretelyTimeVaryingTraits, "chartDisclaimer") &&
            hasTraits(parentItem, DiscretelyTimeVaryingTraits, "chartDisclaimer") &&
            parentItem.chartDisclaimer !== undefined) {
            chartItem.setTrait(CommonStrata.user, "chartDisclaimer", parentItem.chartDisclaimer);
        }
    }
    /**
     * Is this node the first column of a two-column table where the second
     * column contains a `<chart>`?
     * @param node The node to test
     */
    isFirstColumnOfChartRow(node) {
        return (node.name === "td" &&
            node.children !== undefined &&
            node.children.length === 1 &&
            node.parent !== undefined &&
            node.parent.name === "tr" &&
            node.parent.children !== undefined &&
            node.parent.children.length === 2 &&
            node === node.parent.children[0] &&
            node.parent.children[1].name === "td" &&
            node.parent.children[1].children !== undefined &&
            node.parent.children[1].children.length === 1 &&
            node.parent.children[1].children[0].name === "chart");
    }
    processFirstColumn(context, node, children, index) {
        // Do not return a node.
        return undefined;
    }
    /**
     * Is this node the second column of a two-column table where the second
     * column contains a `<chart>`?
     * @param node The node to test
     */
    isSecondColumnOfChartRow(node) {
        return (node.name === "td" &&
            node.children !== undefined &&
            node.children.length === 1 &&
            node.children[0].name === "chart" &&
            node.parent !== undefined &&
            node.parent.name === "tr" &&
            node.parent.children !== undefined &&
            node.parent.children.length === 2);
    }
    processSecondColumn(context, node, children, index) {
        const title = node.parent.children[0].children[0].data;
        const revisedChildren = [
            React.createElement("div", {
                key: "title",
                className: ChartPreviewStyles.chartTitleFromTable
            }, title)
        ].concat(children);
        return React.createElement("td", { key: "chart", colSpan: 2, className: ChartPreviewStyles.chartTd }, node.data, revisedChildren);
    }
    /**
     * Parse node attrs to an easier to process structure.
     */
    parseNodeAttrs(nodeAttrs) {
        let sources = splitStringIfDefined(nodeAttrs.sources);
        if (sources === undefined && nodeAttrs.src !== undefined) {
            // [src-preview, src], or [src] if src-preview is not defined.
            sources = [nodeAttrs.src];
            const srcPreview = nodeAttrs["src-preview"];
            if (srcPreview !== undefined) {
                sources.unshift(srcPreview);
            }
        }
        const sourceNames = splitStringIfDefined(nodeAttrs["source-names"]);
        const downloads = splitStringIfDefined(nodeAttrs.downloads) || sources;
        const downloadNames = splitStringIfDefined(nodeAttrs["download-names"]) || sourceNames;
        const columnTitles = filterOutUndefined((nodeAttrs["column-titles"] || "").split(",").map(s => {
            const [a, b] = rsplit2(s, ":");
            if (a && b) {
                return { name: a, title: b };
            }
            else {
                const title = a;
                return title;
            }
        }));
        const columnUnits = filterOutUndefined((nodeAttrs["column-units"] || "").split(",").map(s => {
            const [a, b] = rsplit2(s, ":");
            if (a && b) {
                return { name: a, units: b };
            }
            else {
                const units = a;
                return units;
            }
        }));
        const yColumns = splitStringIfDefined(nodeAttrs["y-columns"] || nodeAttrs["y-column"]);
        return {
            title: nodeAttrs["title"],
            identifier: nodeAttrs["identifier"],
            hideButtons: nodeAttrs["hide-buttons"] === "true",
            sources,
            sourceNames,
            canDownload: !(nodeAttrs["can-download"] === "false"),
            downloads,
            downloadNames,
            styling: nodeAttrs["styling"] || "feature-info",
            highlightX: nodeAttrs["highlight-x"],
            columnTitles,
            columnUnits,
            xColumn: nodeAttrs["x-column"],
            previewXLabel: nodeAttrs["preview-x-label"],
            yColumns
        };
    }
    /**
     * A helper method to create a shareable reference to an item.
     */
    async createItemReference(sourceItem) {
        const terria = sourceItem.terria;
        const ref = new SplitItemReference(createGuid(), terria);
        ref.setTrait(CommonStrata.user, "splitSourceItemId", sourceItem.uniqueId);
        (await ref.loadReference()).raiseError(terria, `Failed to create SplitItemReference for ${getName(sourceItem)}`);
        if (ref.target) {
            terria.addModel(ref);
            return ref.target;
        }
    }
}
function checkAllPropertyKeys(object, allowedKeys) {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (allowedKeys.indexOf(key) === -1) {
                console.log("Unknown attribute " + key);
            }
        }
    }
}
export function splitStringIfDefined(s) {
    return s !== undefined ? s.split(",") : undefined;
}
/*
 * Split string `s` from last using `sep` into 2 pieces.
 */
function rsplit2(s, sep) {
    const pieces = s.split(sep);
    if (pieces.length === 1) {
        return pieces;
    }
    else {
        const head = pieces.slice(0, pieces.length - 1).join(sep);
        const last = pieces[pieces.length - 1];
        return [head, last];
    }
}
function getInsertedTitle(node) {
    // Check if there is a title in the position 'Title' relative to node <chart>:
    // <tr><td>Title</td><td><chart></chart></tr>
    if (node.parent !== undefined &&
        node.parent.name === "td" &&
        node.parent.parent !== undefined &&
        node.parent.parent.name === "tr" &&
        node.parent.parent.children !== undefined &&
        node.parent.parent.children[0] !== undefined &&
        node.parent.parent.children[0].children !== undefined &&
        node.parent.parent.children[0].children[0] !== undefined) {
        return node.parent.parent.children[0].children[0].data;
    }
}
function getFeaturePosition(feature) {
    var _a;
    const cartesian = (_a = feature === null || feature === void 0 ? void 0 : feature.position) === null || _a === void 0 ? void 0 : _a.getValue(JulianDate.now());
    if (cartesian) {
        const carto = Ellipsoid.WGS84.cartesianToCartographic(cartesian);
        return {
            longitude: CesiumMath.toDegrees(carto.longitude),
            latitude: CesiumMath.toDegrees(carto.latitude)
        };
    }
}
//# sourceMappingURL=ChartCustomComponent.js.map