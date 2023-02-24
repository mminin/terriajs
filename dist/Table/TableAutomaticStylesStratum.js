var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { uniq } from "lodash-es";
import { computed } from "mobx";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import { ShortReportTraits } from "../Traits/TraitsClasses/CatalogMemberTraits";
import TableChartStyleTraits, { TableChartLineStyleTraits } from "../Traits/TraitsClasses/Table/ChartStyleTraits";
import TableColorStyleTraits from "../Traits/TraitsClasses/Table/ColorStyleTraits";
import TablePointSizeStyleTraits from "../Traits/TraitsClasses/Table/PointSizeStyleTraits";
import TableStyleTraits from "../Traits/TraitsClasses/Table/StyleTraits";
import TableTimeStyleTraits from "../Traits/TraitsClasses/Table/TimeStyleTraits";
import TableTraits from "../Traits/TraitsClasses/Table/TableTraits";
import TableColumnType from "./TableColumnType";
const DEFAULT_ID_COLUMN = "id";
export default class TableAutomaticStylesStratum extends LoadableStratum(TableTraits) {
    constructor(catalogItem) {
        super();
        this.catalogItem = catalogItem;
    }
    duplicateLoadableStratum(newModel) {
        return new TableAutomaticStylesStratum(newModel);
    }
    get rectangle() {
        return this.catalogItem.activeTableStyle.rectangle;
    }
    get disableOpacityControl() {
        // disable opacity control for point tables - or if no mapItems
        return this.catalogItem.activeTableStyle.isPoints() ||
            this.catalogItem.mapItems.length === 0
            ? true
            : undefined;
    }
    get disableSplitter() {
        return !isDefined(this.catalogItem.activeTableStyle.regionColumn)
            ? true
            : undefined;
    }
    /**
     * Set default activeStyle to first style with a scalar color column (if none is found then find first style with enum, text and then region)
     * Ignores styles with `hidden: true`
     */
    get activeStyle() {
        if (this.catalogItem.styles && this.catalogItem.styles.length > 0) {
            // Find default active style in this order:
            // - First scalar style
            // - First enum style
            // - First text style
            // - First region style
            const types = [
                TableColumnType.scalar,
                TableColumnType.enum,
                TableColumnType.text,
                TableColumnType.region
            ];
            const firstStyleOfEachType = types.map((columnType) => { var _a; return (_a = this.catalogItem.styles
                .filter((style) => !style.hidden)
                .find((s) => {
                var _a, _b;
                return ((_b = this.catalogItem.findColumnByName((_a = s.color) === null || _a === void 0 ? void 0 : _a.colorColumn)) === null || _b === void 0 ? void 0 : _b.type) === columnType;
            })) === null || _a === void 0 ? void 0 : _a.id; });
            return filterOutUndefined(firstStyleOfEachType)[0];
        }
    }
    get defaultStyle() {
        // Use the default style to select the spatial key (lon/lat, region, none i.e. chart)
        // for all styles.
        const longitudeColumn = this.catalogItem.findFirstColumnByType(TableColumnType.longitude);
        const latitudeColumn = this.catalogItem.findFirstColumnByType(TableColumnType.latitude);
        const regionColumn = this.catalogItem.findFirstColumnByType(TableColumnType.region);
        const timeColumn = this.catalogItem.findFirstColumnByType(TableColumnType.time);
        // Set a default id column only when we also have a time column
        const idColumn = timeColumn && this.catalogItem.findColumnByName(DEFAULT_ID_COLUMN);
        if (regionColumn !== undefined ||
            (longitudeColumn !== undefined && latitudeColumn !== undefined)) {
            return createStratumInstance(TableStyleTraits, {
                longitudeColumn: longitudeColumn && latitudeColumn ? longitudeColumn.name : undefined,
                latitudeColumn: longitudeColumn && latitudeColumn ? latitudeColumn.name : undefined,
                regionColumn: regionColumn ? regionColumn.name : undefined,
                time: createStratumInstance(TableTimeStyleTraits, {
                    timeColumn: timeColumn === null || timeColumn === void 0 ? void 0 : timeColumn.name,
                    idColumns: idColumn && [idColumn.name]
                })
            });
        }
        // This dataset isn't spatial, so see if we have a valid chart style
        if (this.defaultChartStyle) {
            return this.defaultChartStyle;
        }
        // Can't do much with this dataset.
        // Just add default legend
        return createStratumInstance(TableStyleTraits, {});
    }
    get defaultChartStyle() {
        const timeColumns = this.catalogItem.tableColumns.filter((column) => column.type === TableColumnType.time);
        const scalarColumns = this.catalogItem.tableColumns.filter((column) => column.type === TableColumnType.scalar);
        const hasTime = timeColumns.length > 0;
        if (scalarColumns.length >= (hasTime ? 1 : 2)) {
            return createStratumInstance(TableStyleTraits, {
                chart: createStratumInstance(TableChartStyleTraits, {
                    xAxisColumn: hasTime ? timeColumns[0].name : scalarColumns[0].name,
                    lines: scalarColumns.slice(hasTime ? 0 : 1).map((column, i) => createStratumInstance(TableChartLineStyleTraits, {
                        yAxisColumn: column.name,
                        isSelectedInWorkbench: i === 0 // activate only the first chart line by default
                    }))
                })
            });
        }
    }
    get styles() {
        // If no styles for scalar, enum - show styles using region columns
        const showRegionStyles = this.catalogItem.tableColumns.every((column) => column.type !== TableColumnType.scalar &&
            column.type !== TableColumnType.enum);
        const columnStyles = this.catalogItem.tableColumns.map((column, i) => createStratumInstance(TableStyleTraits, {
            id: column.name,
            color: createStratumInstance(TableColorStyleTraits, {
                colorColumn: column.name
            }),
            pointSize: createStratumInstance(TablePointSizeStyleTraits, {
                pointSizeColumn: column.name
            }),
            hidden: column.type !== TableColumnType.scalar &&
                column.type !== TableColumnType.enum &&
                (column.type !== TableColumnType.region || !showRegionStyles)
        }));
        return [
            ...columnStyles,
            // Create "User Style" traits for legend
            // This style is used by `TableStylingWorkflow` if no other styles are available
            createStratumInstance(TableStyleTraits, {
                id: "User Style",
                hidden: true
            })
        ];
    }
    get disableDateTimeSelector() {
        if (this.catalogItem.mapItems.length === 0 ||
            !this.catalogItem.activeTableStyle.moreThanOneTimeInterval)
            return true;
    }
    get showDisableTimeOption() {
        // Return nothing if no row groups or if time column doesn't have at least one interval
        if (this.catalogItem.activeTableStyle.rowGroups.length === 0 ||
            !this.catalogItem.activeTableStyle.moreThanOneTimeInterval)
            return undefined;
        // Return true if at least 50% of rowGroups only have one unique time interval (i.e. they don't change over time)
        let flat = 0;
        for (let i = 0; i < this.catalogItem.activeTableStyle.rowGroups.length; i++) {
            const [rowGroupId, rowIds] = this.catalogItem.activeTableStyle.rowGroups[i];
            // Check if there is only 1 unique date in this rowGroup
            const dates = rowIds
                .map((rowId) => { var _a, _b; return (_b = (_a = this.catalogItem.activeTableStyle.timeColumn) === null || _a === void 0 ? void 0 : _a.valuesAsDates.values[rowId]) === null || _b === void 0 ? void 0 : _b.getTime(); })
                .filter(isDefined);
            if (uniq(dates).length <= 1)
                flat++;
        }
        if (flat / this.catalogItem.activeTableStyle.rowGroups.length >= 0.5)
            return true;
        return undefined;
    }
    get initialTimeSource() {
        return "start";
    }
    /** Return title of timeColumn if defined
     * This will be displayed on DateTimeSelectorSection in the workbench
     */
    get timeLabel() {
        if (this.catalogItem.activeTableStyle.timeColumn) {
            return `${this.catalogItem.activeTableStyle.timeColumn.title}: `;
        }
    }
    get shortReport() {
        return this.catalogItem.mapItems.length === 0 &&
            this.catalogItem.chartItems.length === 0 &&
            !this.catalogItem.isLoading
            ? i18next.t("models.tableData.noData")
            : undefined;
    }
    /** Show "Regions: xxx" short report for region-mapping */
    get shortReportSections() {
        const regionCol = this.catalogItem.activeTableStyle.regionColumn;
        const regionType = regionCol === null || regionCol === void 0 ? void 0 : regionCol.regionType;
        if (regionType && this.catalogItem.showingRegions) {
            return [
                createStratumInstance(ShortReportTraits, {
                    name: `**Regions:** ${regionType.description}`
                })
            ];
        }
        return [];
    }
    /** Show chart by default - if not loading and no mappable items */
    get showInChartPanel() {
        return (this.catalogItem.show &&
            !this.catalogItem.isLoading &&
            this.catalogItem.mapItems.length === 0);
    }
}
TableAutomaticStylesStratum.stratumName = "automaticTableStyles";
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "rectangle", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "disableOpacityControl", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "disableSplitter", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "activeStyle", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "defaultStyle", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "defaultChartStyle", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "styles", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "disableDateTimeSelector", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "showDisableTimeOption", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "initialTimeSource", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "timeLabel", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "shortReport", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "shortReportSections", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "showInChartPanel", null);
//# sourceMappingURL=TableAutomaticStylesStratum.js.map