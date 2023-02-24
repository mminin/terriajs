"use strict";
import FileSaver from "file-saver";
import { runInAction, toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import FeatureDetection from "terriajs-cesium/Source/Core/FeatureDetection";
import isDefined from "../../../Core/isDefined";
import Result from "../../../Core/Result";
import TableMixin from "../../../ModelMixins/TableMixin";
import hasTraits from "../../../Models/Definition/hasTraits";
import Icon from "../../../Styled/Icon";
import ExportableTraits from "../../../Traits/TraitsClasses/ExportableTraits";
import Styles from "./chart-panel-download-button.scss";
/**
 * Extracts column names and row data from TableMixin item for CSV download.
 */
function synthesizeNameAndValueArrays(items) {
    return runInAction(() => {
        var _a;
        const valueArrays = [];
        const names = []; // We will add the catalog item name back into the csv column name.
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            const xColumn = item.xColumn;
            if (!xColumn || !item.showInChartPanel) {
                continue;
            }
            if (!names.length) {
                names.push(xColumn.name);
            }
            let columns = [xColumn];
            const lineTraits = (_a = item.activeTableStyle.chartTraits.lines) !== null && _a !== void 0 ? _a : [];
            // Only add yColumns if `TableChartLineStyleTraits.isSelectedInWorkbench` is true
            // i.e. the columns which are actually showing in chart
            const yColumns = lineTraits
                .filter((line) => line.isSelectedInWorkbench)
                .map((line) => item.findColumnByName(line.yAxisColumn))
                .filter(isDefined);
            if (yColumns.length > 0) {
                columns = columns.concat(yColumns);
                // Use typed array if possible so we can pass by pointer to the web worker.
                // Create a new array otherwise because if values are a knockout observable, they cannot be serialised for the web worker.
                valueArrays.push(columns.map((column) => toJS(column.values)));
                yColumns.forEach((column) => {
                    names.push(item.name + " " + column.name);
                });
            }
        }
        return { values: valueArrays, names: names };
    });
}
async function download(items) {
    if (items.length === 0)
        return;
    const loadMapResults = Result.combine(await Promise.all(items.map((model) => model.loadMapItems())), "Failed to load catalog items");
    if (loadMapResults.error) {
        loadMapResults.raiseError(items[0].terria, "Could not download chart data");
    }
    const synthesized = synthesizeNameAndValueArrays(items);
    // Could implement this using TaskProcessor, but requires webpack magic.
    const HrefWorker = require("worker-loader!./downloadHrefWorker");
    const worker = new HrefWorker();
    // console.log('names and value arrays', synthesized.names, synthesized.values);
    if (synthesized.values && synthesized.values.length > 0) {
        worker.postMessage(synthesized);
        worker.onmessage = (event) => {
            // console.log('got worker message', event.data.slice(0, 60), '...');
            const blob = new Blob([event.data], {
                type: "text/csv;charset=utf-8"
            });
            FileSaver.saveAs(blob, "chart data.csv");
        };
    }
}
export const ChartPanelDownloadButton = observer((props) => {
    {
        // For the moment we only support TableMixin items
        const tableItems = props.chartableItems.filter(TableMixin.isMixedInto);
        const isDownloadSupported = FeatureDetection.supportsTypedArrays() &&
            FeatureDetection.supportsWebWorkers();
        const isExportDisabled = props.chartableItems.some((item) => hasTraits(item, ExportableTraits, "disableExport") &&
            item.disableExport === true);
        if (!isDownloadSupported || isExportDisabled || tableItems.length === 0)
            return null;
        return (React.createElement("button", { className: Styles.btnDownload, onClick: () => download(props.chartableItems.filter(TableMixin.isMixedInto)) },
            React.createElement(Icon, { glyph: Icon.GLYPHS.download }),
            "Download"));
    }
});
//# sourceMappingURL=ChartPanelDownloadButton.js.map