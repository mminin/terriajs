var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, observable, runInAction } from "mobx";
import { createTransformer } from "mobx-utils";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import DataSource from "terriajs-cesium/Source/DataSources/DataSource";
import getChartColorForId from "../Charts/getChartColorForId";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import { isLatLonHeight } from "../Core/LatLonHeight";
import makeRealPromise from "../Core/makeRealPromise";
import TerriaError from "../Core/TerriaError";
import ConstantColorMap from "../Map/ConstantColorMap";
import RegionProviderList from "../Map/RegionProviderList";
import CommonStrata from "../Models/Definition/CommonStrata";
import updateModelFromJson from "../Models/Definition/updateModelFromJson";
import createLongitudeLatitudeFeaturePerId from "../Table/createLongitudeLatitudeFeaturePerId";
import createLongitudeLatitudeFeaturePerRow from "../Table/createLongitudeLatitudeFeaturePerRow";
import createRegionMappedImageryProvider from "../Table/createRegionMappedImageryProvider";
import TableColumn from "../Table/TableColumn";
import TableColumnType from "../Table/TableColumnType";
import TableStyle from "../Table/TableStyle";
import CatalogMemberMixin from "./CatalogMemberMixin";
import ChartableMixin, { calculateDomain } from "./ChartableMixin";
import DiscretelyTimeVaryingMixin from "./DiscretelyTimeVaryingMixin";
import ExportableMixin from "./ExportableMixin";
function TableMixin(Base) {
    class TableMixin extends ExportableMixin(ChartableMixin(DiscretelyTimeVaryingMixin(CatalogMemberMixin(Base)))) {
        constructor(...args) {
            super(...args);
            this.createLongitudeLatitudeDataSource = createTransformer((style) => {
                if (!style.isPoints()) {
                    return undefined;
                }
                const dataSource = new CustomDataSource(this.name || "Table");
                dataSource.entities.suspendEvents();
                let features;
                if (style.isTimeVaryingPointsWithId()) {
                    features = createLongitudeLatitudeFeaturePerId(style);
                }
                else {
                    features = createLongitudeLatitudeFeaturePerRow(style);
                }
                // _catalogItem property is needed for some feature picking functions (eg FeatureInfoMixin)
                features.forEach(f => {
                    f._catalogItem = this;
                    dataSource.entities.add(f);
                });
                dataSource.show = this.show;
                dataSource.entities.resumeEvents();
                return dataSource;
            });
            this.createRegionMappedImageryProvider = createTransformer((input) => createRegionMappedImageryProvider(input.style, input.currentTime));
            this.getTableColumn = createTransformer((index) => {
                return new TableColumn(this, index);
            });
            this.getTableStyle = createTransformer((index) => {
                return new TableStyle(this, index);
            });
            this.defaultTableStyle = new TableStyle(this);
        }
        get hasTableMixin() {
            return true;
        }
        /**
         * The raw data table in column-major format, i.e. the outer array is an
         * array of columns.
         */
        get dataColumnMajor() {
            const dataColumnMajor = this._dataColumnMajor;
            if (this.removeDuplicateRows &&
                dataColumnMajor !== undefined &&
                dataColumnMajor.length >= 1) {
                // De-duplication is slow and memory expensive, so should be avoided if possible.
                const rowsToRemove = new Set();
                const seenRows = new Set();
                for (let i = 0; i < dataColumnMajor[0].length; i++) {
                    const row = dataColumnMajor.map(col => col[i]).join();
                    if (seenRows.has(row)) {
                        // Mark row for deletion
                        rowsToRemove.add(i);
                    }
                    else {
                        seenRows.add(row);
                    }
                }
                if (rowsToRemove.size > 0) {
                    return dataColumnMajor.map(col => col.filter((cell, idx) => !rowsToRemove.has(idx)));
                }
            }
            return dataColumnMajor;
        }
        set dataColumnMajor(newDataColumnMajor) {
            this._dataColumnMajor = newDataColumnMajor;
        }
        /**
         * Gets a {@link TableColumn} for each of the columns in the raw data.
         */
        get tableColumns() {
            if (this.dataColumnMajor === undefined) {
                return [];
            }
            return this.dataColumnMajor.map((_, i) => this.getTableColumn(i));
        }
        /**
         * Gets a {@link TableStyle} for each of the {@link styles}. If there
         * are no styles, returns an empty array.
         */
        get tableStyles() {
            if (this.styles === undefined) {
                return [];
            }
            return this.styles.map((_, i) => this.getTableStyle(i));
        }
        /**
         * Gets the {@link TableStyleTraits#id} of the currently-active style.
         * Note that this is a trait so there is no guarantee that a style
         * with this ID actually exists. If no active style is explicitly
         * specified, the ID of the first style with a scalar color column is used.
         * If there is no such style the id of the first style of the {@link #styles}
         * is used.
         */
        get activeStyle() {
            const value = super.activeStyle;
            if (value !== undefined) {
                return value;
            }
            else if (this.styles && this.styles.length > 0) {
                // Find and return a style with scalar color column if it exists,
                // otherwise just return the first available style id.
                const styleWithScalarColorColumn = this.styles.find(s => {
                    var _a;
                    const colName = s.color.colorColumn;
                    return (colName &&
                        ((_a = this.findColumnByName(colName)) === null || _a === void 0 ? void 0 : _a.type) === TableColumnType.scalar);
                });
                return (styleWithScalarColorColumn === null || styleWithScalarColorColumn === void 0 ? void 0 : styleWithScalarColorColumn.id) || this.styles[0].id;
            }
            return undefined;
        }
        /**
         * Gets the active {@link TableStyle}, which is the item from {@link #tableStyles}
         * with an ID that matches {@link #activeStyle}, if any.
         */
        get activeTableStyle() {
            const activeStyle = this.activeStyle;
            if (activeStyle === undefined) {
                return this.defaultTableStyle;
            }
            let ret = this.tableStyles.find(style => style.id === this.activeStyle);
            if (ret === undefined) {
                return this.defaultTableStyle;
            }
            return ret;
        }
        get xColumn() {
            return this.activeTableStyle.xAxisColumn;
        }
        get yColumns() {
            const lines = this.activeTableStyle.chartTraits.lines;
            return filterOutUndefined(lines.map(line => line.yAxisColumn === undefined
                ? undefined
                : this.findColumnByName(line.yAxisColumn)));
        }
        get _canExportData() {
            return isDefined(this.dataColumnMajor);
        }
        async _exportData() {
            if (isDefined(this.dataColumnMajor)) {
                // I am assuming all columns have the same length -> so use first column
                let csvString = this.dataColumnMajor[0]
                    .map((row, rowIndex) => this.dataColumnMajor.map(col => col[rowIndex]).join(","))
                    .join("\n");
                // Make sure we have .csv file extension
                let name = this.name || this.uniqueId || "data.csv";
                if (!/(\.csv\b)/i.test(name)) {
                    name = `${name}.csv`;
                }
                return {
                    name: (this.name || this.uniqueId),
                    file: new Blob([csvString])
                };
            }
            throw new TerriaError({
                sender: this,
                message: "No data available to download."
            });
        }
        get disableSplitter() {
            return !isDefined(this.activeTableStyle.regionColumn);
        }
        get disableZoomTo() {
            // Disable zoom if only showing imagery parts  (eg region mapping) and no rectangle is defined
            if (!this.mapItems.find(m => m instanceof DataSource || m instanceof CustomDataSource) &&
                !isDefined(this.cesiumRectangle)) {
                return true;
            }
            return super.disableZoomTo;
        }
        /**
         * Gets the items to show on the map.
         */
        get mapItems() {
            var _a, _b, _c, _d, _e;
            // Wait for activeTableStyle to be ready
            if (((_a = this.dataColumnMajor) === null || _a === void 0 ? void 0 : _a.length) === 0 ||
                !this.activeTableStyle.ready ||
                this.isLoadingMapItems)
                return [];
            const numRegions = (_e = (_d = (_c = (_b = this.activeTableStyle.regionColumn) === null || _b === void 0 ? void 0 : _b.valuesAsRegions) === null || _c === void 0 ? void 0 : _c.uniqueRegionIds) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0;
            // Estimate number of points based off number of rowGroups
            const numPoints = this.activeTableStyle.isPoints()
                ? this.activeTableStyle.rowGroups.length
                : 0;
            // If we have more points than regions OR we have points are are using a ConstantColorMap - show points instead of regions
            // (Using ConstantColorMap with regions will result in all regions being the same color - which isn't useful)
            if ((numPoints > 0 &&
                this.activeTableStyle.colorMap instanceof ConstantColorMap) ||
                numPoints > numRegions) {
                const pointsDataSource = this.createLongitudeLatitudeDataSource(this.activeTableStyle);
                // Make sure there are actually more points than regions
                if (pointsDataSource &&
                    pointsDataSource.entities.values.length > numRegions)
                    return [pointsDataSource];
            }
            if (this.regionMappedImageryParts)
                return [this.regionMappedImageryParts];
            return [];
        }
        get shortReport() {
            return this.mapItems.length === 0 &&
                this.chartItems.length === 0 &&
                !this.isLoading
                ? i18next.t("models.tableData.noData")
                : super.shortReport;
        }
        // regionMappedImageryParts and regionMappedImageryProvider are split up like this so that we aren't re-creating the imageryProvider if things like `opacity` and `show` change
        get regionMappedImageryParts() {
            if (!this.regionMappedImageryProvider)
                return;
            return {
                imageryProvider: this.regionMappedImageryProvider,
                alpha: this.opacity,
                show: this.show,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            };
        }
        get regionMappedImageryProvider() {
            return this.createRegionMappedImageryProvider({
                style: this.activeTableStyle,
                currentTime: this.currentDiscreteJulianDate
            });
        }
        /**
         * Try to resolve `regionType` to a region provider (this will also match against region provider aliases)
         */
        matchRegionType(regionType) {
            var _a;
            if (!isDefined(regionType))
                return;
            const matchingRegionProviders = (_a = this.regionProviderList) === null || _a === void 0 ? void 0 : _a.getRegionDetails([regionType], undefined, undefined);
            if (matchingRegionProviders && matchingRegionProviders.length > 0) {
                return matchingRegionProviders[0].regionProvider.regionType;
            }
        }
        /**
         * Gets the items to show on a chart.
         *
         */
        get tableChartItems() {
            const style = this.activeTableStyle;
            if (style === undefined || !style.isChart()) {
                return [];
            }
            const xColumn = style.xAxisColumn;
            const lines = style.chartTraits.lines;
            if (xColumn === undefined || lines.length === 0) {
                return [];
            }
            const xValues = xColumn.type === TableColumnType.time
                ? xColumn.valuesAsDates.values
                : xColumn.valuesAsNumbers.values;
            const xAxis = {
                scale: xColumn.type === TableColumnType.time ? "time" : "linear",
                units: xColumn.units
            };
            return filterOutUndefined(lines.map(line => {
                var _a, _b, _c;
                const yColumn = line.yAxisColumn
                    ? this.findColumnByName(line.yAxisColumn)
                    : undefined;
                if (yColumn === undefined) {
                    return undefined;
                }
                const yValues = yColumn.valuesAsNumbers.values;
                const points = [];
                for (let i = 0; i < xValues.length; ++i) {
                    const x = xValues[i];
                    const y = yValues[i];
                    if (x === null || y === null) {
                        continue;
                    }
                    points.push({ x, y });
                }
                if (points.length <= 1)
                    return;
                const colorId = `color-${this.uniqueId}-${this.name}-${yColumn.name}`;
                return {
                    item: this,
                    name: (_a = line.name) !== null && _a !== void 0 ? _a : yColumn.title,
                    categoryName: this.name,
                    key: `key${this.uniqueId}-${this.name}-${yColumn.name}`,
                    type: (_b = this.chartType) !== null && _b !== void 0 ? _b : "line",
                    glyphStyle: (_c = this.chartGlyphStyle) !== null && _c !== void 0 ? _c : "circle",
                    xAxis,
                    points,
                    domain: calculateDomain(points),
                    units: yColumn.units,
                    isSelectedInWorkbench: line.isSelectedInWorkbench,
                    showInChartPanel: this.show && line.isSelectedInWorkbench,
                    updateIsSelectedInWorkbench: (isSelected) => {
                        runInAction(() => {
                            line.setTrait(CommonStrata.user, "isSelectedInWorkbench", isSelected);
                        });
                    },
                    getColor: () => {
                        return line.color || getChartColorForId(colorId);
                    },
                    pointOnMap: isLatLonHeight(this.chartPointOnMap)
                        ? this.chartPointOnMap
                        : undefined
                };
            }));
        }
        get chartItems() {
            var _a;
            // Wait for activeTableStyle to be ready
            if (!this.activeTableStyle.ready || this.isLoadingMapItems)
                return [];
            return filterOutUndefined([
                // If time-series region mapping - show time points chart
                this.activeTableStyle.isRegions() && ((_a = this.discreteTimes) === null || _a === void 0 ? void 0 : _a.length)
                    ? this.momentChart
                    : undefined,
                ...this.tableChartItems
            ]);
        }
        get selectableDimensions() {
            return filterOutUndefined([
                this.timeDisableDimension,
                ...super.selectableDimensions,
                this.regionColumnDimensions,
                this.regionProviderDimensions,
                this.styleDimensions,
                this.outlierFilterDimension
            ]);
        }
        /**
         * Takes {@link TableStyle}s and returns a SelectableDimension which can be rendered in a Select dropdown
         */
        get styleDimensions() {
            if (this.mapItems.length === 0 && !this.enableManualRegionMapping) {
                return;
            }
            return {
                id: "activeStyle",
                name: "Display Variable",
                options: this.tableStyles
                    .filter(style => !style.hidden || this.activeStyle === style.id)
                    .map(style => {
                    return {
                        id: style.id,
                        name: style.title
                    };
                }),
                selectedId: this.activeStyle,
                allowUndefined: this.showDisableStyleOption,
                undefinedLabel: this.showDisableStyleOption
                    ? i18next.t("models.tableData.styleDisabledLabel")
                    : undefined,
                setDimensionValue: (stratumId, styleId) => {
                    this.setTrait(stratumId, "activeStyle", styleId);
                }
            };
        }
        /**
         * Creates SelectableDimension for regionProviderList - the list of all available region providers.
         * {@link TableTraits#enableManualRegionMapping} must be enabled.
         */
        get regionProviderDimensions() {
            var _a, _b, _c;
            if (!this.enableManualRegionMapping ||
                !Array.isArray((_a = this.regionProviderList) === null || _a === void 0 ? void 0 : _a.regionProviders) ||
                !isDefined(this.activeTableStyle.regionColumn)) {
                return;
            }
            return {
                id: "regionMapping",
                name: "Region Mapping",
                options: this.regionProviderList.regionProviders.map(regionProvider => {
                    return {
                        name: regionProvider.regionType,
                        id: regionProvider.regionType
                    };
                }),
                allowUndefined: true,
                selectedId: (_c = (_b = this.activeTableStyle.regionColumn) === null || _b === void 0 ? void 0 : _b.regionType) === null || _c === void 0 ? void 0 : _c.regionType,
                setDimensionValue: (stratumId, regionType) => {
                    var _a;
                    let columnTraits = (_a = this.columns) === null || _a === void 0 ? void 0 : _a.find(column => { var _a; return column.name === ((_a = this.activeTableStyle.regionColumn) === null || _a === void 0 ? void 0 : _a.name); });
                    if (!isDefined(columnTraits)) {
                        columnTraits = this.addObject(stratumId, "columns", this.activeTableStyle.regionColumn.name);
                        columnTraits.setTrait(stratumId, "name", this.activeTableStyle.regionColumn.name);
                    }
                    columnTraits.setTrait(stratumId, "regionType", regionType);
                }
            };
        }
        /**
         * Creates SelectableDimension for region column - the options contains a list of all columns.
         * {@link TableTraits#enableManualRegionMapping} must be enabled.
         */
        get regionColumnDimensions() {
            var _a, _b;
            if (!this.enableManualRegionMapping ||
                !Array.isArray((_a = this.regionProviderList) === null || _a === void 0 ? void 0 : _a.regionProviders)) {
                return;
            }
            return {
                id: "regionColumn",
                name: "Region Column",
                options: this.tableColumns.map(col => {
                    return {
                        name: col.name,
                        id: col.name
                    };
                }),
                selectedId: (_b = this.activeTableStyle.regionColumn) === null || _b === void 0 ? void 0 : _b.name,
                setDimensionValue: (stratumId, regionCol) => {
                    this.defaultStyle.setTrait(stratumId, "regionColumn", regionCol);
                }
            };
        }
        /**
         * Creates SelectableDimension for region column - the options contains a list of all columns.
         * {@link TableColorStyleTraits#zScoreFilter} must be enabled and {@link TableColorMap#zScoreFilterValues} must detect extreme (outlier) values
         */
        get outlierFilterDimension() {
            if (!this.activeTableStyle.colorTraits.zScoreFilter ||
                !this.activeTableStyle.tableColorMap.zScoreFilterValues) {
                return;
            }
            return {
                id: "outlierFilter",
                options: [
                    { id: "true", name: i18next.t("models.tableData.zFilterEnabled") },
                    { id: "false", name: i18next.t("models.tableData.zFilterDisabled") }
                ],
                selectedId: this.activeTableStyle.colorTraits.zScoreFilterEnabled
                    ? "true"
                    : "false",
                setDimensionValue: (stratumId, value) => {
                    updateModelFromJson(this, stratumId, {
                        defaultStyle: {
                            color: { zScoreFilterEnabled: value === "true" }
                        }
                    });
                },
                placement: "belowLegend",
                type: "checkbox"
            };
        }
        /**
         * Creates SelectableDimension to disable time - this will show if each rowGroup only has a single time
         */
        get timeDisableDimension() {
            // Return nothing if no active time column and if the active time column has been explicitly hidden (using this.defaultStyle.time.timeColumn = null)
            // or if time column doesn't have at least one interval
            if (this.mapItems.length === 0 || !this.showDisableTimeOption)
                return;
            return {
                id: "disableTime",
                options: [
                    {
                        id: "true",
                        name: i18next.t("models.tableData.timeDimensionEnabled")
                    },
                    {
                        id: "false",
                        name: i18next.t("models.tableData.timeDimensionDisabled")
                    }
                ],
                selectedId: this.defaultStyle.time.timeColumn === null ? "false" : "true",
                setDimensionValue: (stratumId, value) => {
                    // We have to set showDisableTimeOption to true - or this will hide when time column is disabled
                    this.setTrait(stratumId, "showDisableTimeOption", true);
                    this.defaultStyle.time.setTrait(stratumId, "timeColumn", value === "true" ? undefined : null);
                },
                type: "checkbox"
            };
        }
        get rowIds() {
            var _a, _b;
            const nRows = (((_b = (_a = this.dataColumnMajor) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.length) || 1) - 1;
            const ids = [...new Array(nRows).keys()];
            return ids;
        }
        get isSampled() {
            return this.activeTableStyle.isSampled;
        }
        get discreteTimes() {
            var _a;
            if (!this.activeTableStyle.moreThanOneTimeInterval)
                return;
            const dates = (_a = this.activeTableStyle.timeColumn) === null || _a === void 0 ? void 0 : _a.valuesAsDates.values;
            if (dates === undefined) {
                return;
            }
            const times = filterOutUndefined(dates.map(d => d ? { time: d.toISOString(), tag: undefined } : undefined)).reduce(
            // is it correct for discrete times to remove duplicates?
            // see discussion on https://github.com/TerriaJS/terriajs/pull/4577
            // duplicates will mess up the indexing problem as our `<DateTimePicker />`
            // will eliminate duplicates on the UI front, so given the datepicker
            // expects uniques, return uniques here
            (acc, time) => !acc.some(accTime => accTime.time === time.time && accTime.tag === time.tag)
                ? [...acc, time]
                : acc, []);
            return times;
        }
        get legends() {
            var _a;
            // Only return legends if we have rows in dataColumnMajor and mapItems to show
            if (((_a = this.dataColumnMajor) === null || _a === void 0 ? void 0 : _a.length) !== 0 && this.mapItems.length > 0) {
                const colorLegend = this.activeTableStyle.colorTraits.legend;
                return filterOutUndefined([colorLegend]);
            }
            else {
                return [];
            }
        }
        findFirstColumnByType(type) {
            return this.tableColumns.find(column => column.type === type);
        }
        findColumnByName(name) {
            return this.tableColumns.find(column => column.name === name);
        }
        async forceLoadMapItems() {
            var _a;
            try {
                const dataColumnMajor = await this.forceLoadTableData();
                // We need to make sure the region provider is loaded before loading
                // region mapped tables.
                await this.loadRegionProviderList();
                if (dataColumnMajor !== undefined && dataColumnMajor !== null) {
                    runInAction(() => {
                        this.dataColumnMajor = dataColumnMajor;
                    });
                }
                // Load region IDS if region mapping
                const activeRegionType = (_a = this.activeTableStyle.regionColumn) === null || _a === void 0 ? void 0 : _a.regionType;
                if (activeRegionType) {
                    await activeRegionType.loadRegionIDs();
                }
            }
            catch (e) {
                // Clear data if error occurs
                runInAction(() => {
                    this.dataColumnMajor = undefined;
                });
                throw e;
            }
        }
        async loadRegionProviderList() {
            if (isDefined(this.regionProviderList))
                return;
            const regionProviderList = await makeRealPromise(RegionProviderList.fromUrl(this.terria.configParameters.regionMappingDefinitionsUrl, this.terria.corsProxy));
            runInAction(() => (this.regionProviderList = regionProviderList));
        }
        /*
         * Appends new table data in column major format to this table.
         * It is assumed that the column order is the same for both the tables.
         */
        append(dataColumnMajor2) {
            if (this.dataColumnMajor !== undefined &&
                this.dataColumnMajor.length !== dataColumnMajor2.length) {
                throw new DeveloperError("Cannot add tables with different numbers of columns.");
            }
            const appended = this.dataColumnMajor || [];
            dataColumnMajor2.forEach((newRows, col) => {
                if (appended[col] === undefined) {
                    appended[col] = [];
                }
                appended[col].push(...newRows);
            });
            this.dataColumnMajor = appended;
        }
    }
    __decorate([
        observable
    ], TableMixin.prototype, "_dataColumnMajor", void 0);
    __decorate([
        observable
    ], TableMixin.prototype, "regionProviderList", void 0);
    __decorate([
        computed
    ], TableMixin.prototype, "dataColumnMajor", null);
    __decorate([
        computed
    ], TableMixin.prototype, "tableColumns", null);
    __decorate([
        computed
    ], TableMixin.prototype, "tableStyles", null);
    __decorate([
        computed
    ], TableMixin.prototype, "activeStyle", null);
    __decorate([
        computed
    ], TableMixin.prototype, "activeTableStyle", null);
    __decorate([
        computed
    ], TableMixin.prototype, "xColumn", null);
    __decorate([
        computed
    ], TableMixin.prototype, "yColumns", null);
    __decorate([
        computed
    ], TableMixin.prototype, "_canExportData", null);
    __decorate([
        computed
    ], TableMixin.prototype, "disableSplitter", null);
    __decorate([
        computed
    ], TableMixin.prototype, "disableZoomTo", null);
    __decorate([
        computed
    ], TableMixin.prototype, "mapItems", null);
    __decorate([
        computed
    ], TableMixin.prototype, "shortReport", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionMappedImageryParts", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionMappedImageryProvider", null);
    __decorate([
        computed
    ], TableMixin.prototype, "tableChartItems", null);
    __decorate([
        computed
    ], TableMixin.prototype, "chartItems", null);
    __decorate([
        computed
    ], TableMixin.prototype, "selectableDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "styleDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionProviderDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "regionColumnDimensions", null);
    __decorate([
        computed
    ], TableMixin.prototype, "outlierFilterDimension", null);
    __decorate([
        computed
    ], TableMixin.prototype, "timeDisableDimension", null);
    __decorate([
        computed
    ], TableMixin.prototype, "rowIds", null);
    __decorate([
        computed
    ], TableMixin.prototype, "isSampled", null);
    __decorate([
        computed
    ], TableMixin.prototype, "discreteTimes", null);
    __decorate([
        computed
    ], TableMixin.prototype, "legends", null);
    __decorate([
        action
    ], TableMixin.prototype, "append", null);
    return TableMixin;
}
(function (TableMixin) {
    function isMixedInto(model) {
        return model && model.hasTableMixin;
    }
    TableMixin.isMixedInto = isMixedInto;
})(TableMixin || (TableMixin = {}));
export default TableMixin;
//# sourceMappingURL=TableMixin.js.map