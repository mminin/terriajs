var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import { networkRequestError } from "../../../Core/TerriaError";
import { MetadataUrlTraits, ShortReportTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import { FeatureInfoTemplateTraits } from "../../../Traits/TraitsClasses/FeatureInfoTraits";
import LegendTraits from "../../../Traits/TraitsClasses/LegendTraits";
import SdmxCatalogItemTraits from "../../../Traits/TraitsClasses/SdmxCatalogItemTraits";
import { ModelOverrideTraits } from "../../../Traits/TraitsClasses/SdmxCommonTraits";
import TableChartStyleTraits, { TableChartLineStyleTraits } from "../../../Traits/TraitsClasses/Table/ChartStyleTraits";
import TableColorStyleTraits from "../../../Traits/TraitsClasses/Table/ColorStyleTraits";
import TableColumnTraits, { ColumnTransformationTraits } from "../../../Traits/TraitsClasses/Table/ColumnTraits";
import TableStyleTraits from "../../../Traits/TraitsClasses/Table/StyleTraits";
import TableTimeStyleTraits from "../../../Traits/TraitsClasses/Table/TimeStyleTraits";
import createCombinedModel from "../../Definition/createCombinedModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import { filterEnums } from "../../SelectableDimensions/SelectableDimensions";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import { loadSdmxJsonStructure, parseSdmxUrn } from "./SdmxJsonServerStratum";
export class SdmxJsonDataflowStratum extends LoadableStratum(SdmxCatalogItemTraits) {
    constructor(catalogItem, sdmxJsonDataflow) {
        super();
        this.catalogItem = catalogItem;
        this.sdmxJsonDataflow = sdmxJsonDataflow;
    }
    duplicateLoadableStratum(model) {
        return new SdmxJsonDataflowStratum(model, this.sdmxJsonDataflow);
    }
    /**
     * Load SDMX-JSON dataflow - will also load references (dataStructure, codelists, conceptSchemes, contentConstraints)
     */
    static async load(catalogItem) {
        // Load dataflow (+ all related references)
        let dataflowStructure = await loadSdmxJsonStructure(proxyCatalogItemUrl(catalogItem, `${catalogItem.baseUrl}/dataflow/${catalogItem.agencyId}/${catalogItem.dataflowId}?references=all`), false);
        // Check response
        if (!isDefined(dataflowStructure.data)) {
            throw networkRequestError({
                title: i18next.t("models.sdmxJsonDataflowStratum.loadDataErrorTitle"),
                message: i18next.t("models.sdmxJsonDataflowStratum.loadDataErrorMessage.invalidResponse")
            });
        }
        if (!Array.isArray(dataflowStructure.data.dataflows) ||
            dataflowStructure.data.dataflows.length === 0) {
            throw networkRequestError({
                title: i18next.t("models.sdmxJsonDataflowStratum.loadDataErrorTitle"),
                message: i18next.t("models.sdmxJsonDataflowStratum.loadDataErrorMessage.noDataflow", this)
            });
        }
        if (!Array.isArray(dataflowStructure.data.dataStructures) ||
            dataflowStructure.data.dataStructures.length === 0) {
            throw networkRequestError({
                title: i18next.t("models.sdmxJsonDataflowStratum.loadDataErrorTitle"),
                message: i18next.t("models.sdmxJsonDataflowStratum.loadDataErrorMessage.noDatastructure", this)
            });
        }
        return new SdmxJsonDataflowStratum(catalogItem, {
            dataflow: dataflowStructure.data.dataflows[0],
            dataStructure: dataflowStructure.data.dataStructures[0],
            codelists: dataflowStructure.data.codelists,
            conceptSchemes: dataflowStructure.data.conceptSchemes,
            contentConstraints: dataflowStructure.data.contentConstraints
        });
    }
    get description() {
        return this.sdmxJsonDataflow.dataflow.description;
    }
    /** Transform dataflow annotations with type "EXT_RESOURCE"
     * These can be of format:
     * - ${title}|${url}|${imageUrl}
     * - EG "Metadata|http://purl.org/spc/digilib/doc/7thdz|https://sdd.spc.int/themes/custom/sdd/images/icons/metadata.png"
     */
    get metadataUrls() {
        var _a, _b, _c;
        return filterOutUndefined((_c = (_b = (_a = this.sdmxJsonDataflow) === null || _a === void 0 ? void 0 : _a.dataflow.annotations) === null || _b === void 0 ? void 0 : _b.filter((a) => a.type === "EXT_RESOURCE" && a.text).map((annotation) => {
            var _a, _b;
            let text = (_b = (_a = annotation.texts) === null || _a === void 0 ? void 0 : _a[i18next.language]) !== null && _b !== void 0 ? _b : annotation.text;
            const title = text.includes("|") ? text.split("|")[0] : undefined;
            const url = text.includes("|") ? text.split("|")[1] : text;
            return createStratumInstance(MetadataUrlTraits, { title, url });
        })) !== null && _c !== void 0 ? _c : []);
    }
    get sdmxAttributes() {
        var _a, _b, _c;
        return ((_c = (_b = (_a = this.sdmxJsonDataflow.dataStructure.dataStructureComponents) === null || _a === void 0 ? void 0 : _a.attributeList) === null || _b === void 0 ? void 0 : _b.attributes) !== null && _c !== void 0 ? _c : []);
    }
    get sdmxDimensions() {
        var _a, _b, _c;
        return ((_c = (_b = (_a = this.sdmxJsonDataflow.dataStructure.dataStructureComponents) === null || _a === void 0 ? void 0 : _a.dimensionList) === null || _b === void 0 ? void 0 : _b.dimensions) !== null && _c !== void 0 ? _c : []);
    }
    get sdmxTimeDimensions() {
        var _a, _b;
        return ((_b = (_a = this.sdmxJsonDataflow.dataStructure.dataStructureComponents) === null || _a === void 0 ? void 0 : _a.dimensionList.timeDimensions) !== null && _b !== void 0 ? _b : []);
    }
    get sdmxPrimaryMeasure() {
        var _a;
        return (_a = this.sdmxJsonDataflow.dataStructure.dataStructureComponents) === null || _a === void 0 ? void 0 : _a.measureList.primaryMeasure;
    }
    /**
     * If we get a dataflow with a single value (and not region-mapped), show the exact value in a short report
     */
    get shortReportSections() {
        if (this.catalogItem.mapItems.length !== 0 || this.catalogItem.isLoading)
            return;
        const primaryCol = this.catalogItem.tableColumns.find((col) => { var _a; return col.name === ((_a = this.primaryMeasureColumn) === null || _a === void 0 ? void 0 : _a.name); });
        if ((primaryCol === null || primaryCol === void 0 ? void 0 : primaryCol.valuesAsNumbers.values.length) === 1 &&
            typeof (primaryCol === null || primaryCol === void 0 ? void 0 : primaryCol.valuesAsNumbers.values[0]) === "number") {
            return [
                createStratumInstance(ShortReportTraits, {
                    name: this.chartTitle,
                    content: primaryCol === null || primaryCol === void 0 ? void 0 : primaryCol.valuesAsNumbers.values[0].toLocaleString(undefined, primaryCol.traits.format)
                })
            ];
        }
    }
    // ------------- START SDMX TRAITS STRATUM -------------
    /** Merge codelist and concept model overrides (codelist takes priority) */
    getMergedModelOverride(dim) {
        const conceptOverride = this.catalogItem.modelOverrides.find((concept) => concept.id === dim.conceptIdentity);
        const codelistOverride = this.catalogItem.modelOverrides.find((codelist) => { var _a; return codelist.id === ((_a = dim.localRepresentation) === null || _a === void 0 ? void 0 : _a.enumeration); });
        let modelOverride = conceptOverride;
        if (!modelOverride) {
            modelOverride = codelistOverride;
            // If there is a codelist and concept override, merge them
        }
        else if (codelistOverride) {
            modelOverride = createCombinedModel(codelistOverride, modelOverride);
        }
        return modelOverride;
    }
    /**
     * This maps SDMX-JSON dataflow structure to `SdmxDimensionTraits` (which gets turned into `SelectableDimensions`) - it uses:
     * - Data structure's dimensions (filtered to only include "enumerated" dimensions)
     * - Content constraints to find dimension options
     * - Codelists to add human readable labels to dimension options
     *
     * It will also apply ModelOverrides - which are used to override dimension values based on concept/codelist ID.
     * - @see ModelOverrideTraits
     */
    get dimensions() {
        var _a;
        // Constraint contains allowed dimension values for a given dataflow
        // Get 'actual' constraints (rather than 'allowed' constraints)
        const constraints = (_a = this.sdmxJsonDataflow.contentConstraints) === null || _a === void 0 ? void 0 : _a.filter((c) => c.type === "Actual");
        return (this.sdmxDimensions
            // Filter normal enum dimensions
            .filter((dim) => {
            var _a;
            return dim.id &&
                dim.type === "Dimension" && ((_a = dim.localRepresentation) === null || _a === void 0 ? void 0 : _a.enumeration);
        })
            .map((dim) => {
            var _a, _b, _c, _d, _e;
            const modelOverride = this.getMergedModelOverride(dim);
            // Concept maps dimension's ID to a human-readable name
            const concept = this.getConceptByUrn(dim.conceptIdentity);
            // Codelist maps dimension enum values to human-readable labels
            const codelist = this.getCodelistByUrn((_a = dim.localRepresentation) === null || _a === void 0 ? void 0 : _a.enumeration);
            // Get allowed options from constraints.cubeRegions (there may be multiple - take union of all values)
            const allowedOptionIds = Array.isArray(constraints)
                ? constraints.reduce((keys, constraint) => {
                    var _a;
                    (_a = constraint.cubeRegions) === null || _a === void 0 ? void 0 : _a.forEach((cubeRegion) => { var _a, _b; return (_b = (_a = cubeRegion.keyValues) === null || _a === void 0 ? void 0 : _a.filter((kv) => kv.id === dim.id)) === null || _b === void 0 ? void 0 : _b.forEach((regionKey) => { var _a; return (_a = regionKey.values) === null || _a === void 0 ? void 0 : _a.forEach((value) => keys.add(value)); }); });
                    return keys;
                }, new Set())
                : new Set();
            let options = [];
            // Get codes by merging allowedOptionIds with codelist
            let filteredCodesList = (_c = (allowedOptionIds.size > 0
                ? (_b = codelist === null || codelist === void 0 ? void 0 : codelist.codes) === null || _b === void 0 ? void 0 : _b.filter((code) => allowedOptionIds.has(code.id)) : // If no allowedOptions were found -> return all codes
             codelist === null || codelist === void 0 ? void 0 : codelist.codes)) !== null && _c !== void 0 ? _c : [];
            // Create options object
            // If modelOverride `options` has been defined -> use it
            // Other wise use filteredCodesList
            const overrideOptions = modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.options;
            options =
                isDefined(overrideOptions) && overrideOptions.length > 0
                    ? overrideOptions.map((option) => {
                        return {
                            id: option.id,
                            name: option.name,
                            value: undefined
                        };
                    })
                    : filteredCodesList.map((code) => {
                        return { id: code.id, name: code.name, value: undefined };
                    });
            // Use first option as default if no other default is provided
            let selectedId = (modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.allowUndefined) ? undefined
                : (_d = options[0]) === null || _d === void 0 ? void 0 : _d.id;
            // Override selectedId if it a valid option
            const selectedIdOverride = modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.selectedId;
            if (isDefined(selectedIdOverride) &&
                options.find((option) => option.id === selectedIdOverride)) {
                selectedId = selectedIdOverride;
            }
            return {
                id: dim.id,
                name: (_e = modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.name) !== null && _e !== void 0 ? _e : concept === null || concept === void 0 ? void 0 : concept.name,
                options: options,
                position: dim.position,
                disable: modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.disable,
                allowUndefined: modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.allowUndefined,
                selectedId: selectedId
            };
        })
            .filter(isDefined));
    }
    /**
     * Adds SDMX Common concepts as model overrides:
     * - `UNIT_MEASURE` (see `this.unitMeasure`)
     * - `UNIT_MULT` (see `this.primaryMeasureColumn`)
     * - `FREQ` (see `this.unitMeasure`)
     */
    get modelOverrides() {
        return filterOutUndefined(
        // Map through all dimensions and attributes to find ones which use common concepts
        [...this.sdmxDimensions, ...this.sdmxAttributes].map((dimAttr) => {
            var _a, _b, _c;
            const conceptUrn = parseSdmxUrn(dimAttr.conceptIdentity);
            // Add UNIT_MEASURE common concept override for unit-measure
            if (((_a = conceptUrn === null || conceptUrn === void 0 ? void 0 : conceptUrn.descendantIds) === null || _a === void 0 ? void 0 : _a[0]) === "UNIT_MEASURE") {
                return createStratumInstance(ModelOverrideTraits, {
                    id: dimAttr.conceptIdentity,
                    type: "unit-measure"
                });
                // Add UNIT_MULT common concept override for unit-multiplier
            }
            else if (((_b = conceptUrn === null || conceptUrn === void 0 ? void 0 : conceptUrn.descendantIds) === null || _b === void 0 ? void 0 : _b[0]) === "UNIT_MULT") {
                return createStratumInstance(ModelOverrideTraits, {
                    id: dimAttr.conceptIdentity,
                    type: "unit-multiplier"
                });
                // Add FREQUENCY common concept override for frequency
            }
            else if (((_c = conceptUrn === null || conceptUrn === void 0 ? void 0 : conceptUrn.descendantIds) === null || _c === void 0 ? void 0 : _c[0]) === "FREQ") {
                return createStratumInstance(ModelOverrideTraits, {
                    id: dimAttr.conceptIdentity,
                    type: "frequency"
                });
            }
        }));
    }
    /**
     * Get unitMeasure string using modelOverrides.
     * - Search for columns linked to dimensions/attributes which have modelOverrides of type "unit-measure"
     * - We will only use a column if it has a single unique value - as this unitMeasure it used effectively as "units" for the dataset
     * - Also search for dimensions which have modelOverrides of type "frequency".
     * - These will be used to add the frequency to the end of the unitMeasure string
     * For example: "Value (Yearly)" or "AUD (Quarterly)"
     *
     */
    get unitMeasure() {
        var _a, _b, _c;
        // Find tableColumns which have corresponding modelOverride with type `unit-measure`
        // We will only use columns if they have a single unique value
        const unitMeasure = filterOutUndefined((_a = this.catalogItem.modelOverrides) === null || _a === void 0 ? void 0 : _a.filter((override) => override.type === "unit-measure" && override.id).map((override) => {
            var _a, _b, _c, _d, _e;
            // Find dimension/attribute id with concept or codelist override
            let dimOrAttr = (_a = this.getAttributionWithConceptOrCodelist(override.id)) !== null && _a !== void 0 ? _a : this.getDimensionWithConceptOrCodelist(override.id);
            const column = this.catalogItem.findColumnByName(dimOrAttr === null || dimOrAttr === void 0 ? void 0 : dimOrAttr.id);
            if ((column === null || column === void 0 ? void 0 : column.uniqueValues.values.length) === 1) {
                // If this column has a codelist, use it to format the value
                const codelist = this.getCodelistByUrn((_b = dimOrAttr === null || dimOrAttr === void 0 ? void 0 : dimOrAttr.localRepresentation) === null || _b === void 0 ? void 0 : _b.enumeration);
                const value = column === null || column === void 0 ? void 0 : column.uniqueValues.values[0];
                return (_e = (_d = (_c = codelist === null || codelist === void 0 ? void 0 : codelist.codes) === null || _c === void 0 ? void 0 : _c.find((c) => c.id === value)) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : value;
            }
        })).join(", ");
        // Find frequency from dimensions with modelOverrides of type "frequency".
        const frequencyDim = this.getDimensionsWithOverrideType("frequency").find((dim) => isDefined(dim.selectedId));
        // Try to get option label if it exists
        let frequency = (_c = (_b = frequencyDim === null || frequencyDim === void 0 ? void 0 : frequencyDim.options.find((o) => o.id === frequencyDim.selectedId)) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : frequencyDim === null || frequencyDim === void 0 ? void 0 : frequencyDim.id;
        return `${unitMeasure ||
            i18next.t("models.sdmxJsonDataflowStratum.defaultUnitMeasure")}${frequency ? ` (${frequency})` : ""}`;
    }
    // ------------- START TABLE TRAITS STRATUM -------------
    /**
     * Add TableColumnTraits for primary measure column - this column contains observational values to be visualised on chart or map:
     * - `name` to dimension id
     * - `title` to concept name
     * - `transformation` if unit multiplier attribute has been found (which will apply `x*(10^unitMultiplier)` to all observation values)
     */
    get primaryMeasureColumn() {
        var _a, _b, _c;
        if (!this.sdmxPrimaryMeasure)
            return;
        const primaryMeasureConcept = this.getConceptByUrn((_a = this.sdmxPrimaryMeasure) === null || _a === void 0 ? void 0 : _a.conceptIdentity);
        // Find unit multiplier columns by searching for attributes/dimensions which have modelOverrides of type "unit-multiplier".
        // Use the first column found
        const unitMultiplier = filterOutUndefined((_b = this.catalogItem.modelOverrides) === null || _b === void 0 ? void 0 : _b.filter((override) => override.type === "unit-multiplier" && override.id).map((override) => {
            var _a;
            // Find dimension/attribute id with concept or codelist
            let dimOrAttr = (_a = this.getAttributionWithConceptOrCodelist(override.id)) !== null && _a !== void 0 ? _a : this.getDimensionWithConceptOrCodelist(override.id);
            return dimOrAttr === null || dimOrAttr === void 0 ? void 0 : dimOrAttr.id;
        }))[0];
        return createStratumInstance(TableColumnTraits, {
            name: (_c = this.sdmxPrimaryMeasure) === null || _c === void 0 ? void 0 : _c.id,
            title: primaryMeasureConcept === null || primaryMeasureConcept === void 0 ? void 0 : primaryMeasureConcept.name,
            type: "scalar",
            // If a unitMultiplier was found, we add `x*(10^unitMultiplier)` transformation
            transformation: unitMultiplier
                ? createStratumInstance(ColumnTransformationTraits, {
                    expression: `x*(10^${unitMultiplier})`,
                    dependencies: [unitMultiplier]
                })
                : undefined
        });
    }
    /**
     * Add TableColumnTraits for dimensions
     * The main purpose of this is to try to find the region type for columns.
     * It also adds:
     * - `name` as dimension id
     * - `title` as concept name (more human-readable than dimension id)
     * - `type` to `region` if a valid region-type is found, or `hidden` if the dimension is disabled
     */
    get dimensionColumns() {
        var _a;
        // Get columns for all dimensions (excluding time dimensions)
        return ((_a = this.sdmxDimensions
            .filter((dim) => isDefined(dim.id))
            .map((dim) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            // Hide dimension columns if they are disabled
            if ((_b = (_a = this.dimensions) === null || _a === void 0 ? void 0 : _a.find((d) => d.id === dim.id)) === null || _b === void 0 ? void 0 : _b.disable) {
                return createStratumInstance(TableColumnTraits, {
                    name: dim.id,
                    type: "hidden"
                });
            }
            // Get concept for the current dimension
            const concept = this.getConceptByUrn(dim.conceptIdentity);
            // Get codelist for current dimension
            const codelist = this.getCodelistByUrn((_c = dim.localRepresentation) === null || _c === void 0 ? void 0 : _c.enumeration);
            const modelOverride = this.getMergedModelOverride(dim);
            // Try to find region type
            let regionType;
            // Are any regionTypes present in modelOverride
            regionType = (_d = this.catalogItem.matchRegionProvider(modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.regionType)) === null || _d === void 0 ? void 0 : _d.regionType;
            // Next try fetching region type from another dimension (only if this modelOverride type 'region')
            // It will look through dimensions which have modelOverrides of type `region-type` and have a selectedId, if one is found - it will be used as the regionType of this column
            // Note this will override previous regionType
            if ((modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.type) === "region") {
                // Use selectedId of first dimension with one
                regionType = (_g = (_f = this.catalogItem.matchRegionProvider((_e = this.getDimensionsWithOverrideType("region-type").find((d) => isDefined(d.selectedId))) === null || _e === void 0 ? void 0 : _e.selectedId)) === null || _f === void 0 ? void 0 : _f.regionType) !== null && _g !== void 0 ? _g : regionType;
            }
            // Try to find valid region type from:
            // - dimension ID
            // - codelist name
            // - codelist ID
            // - concept name?
            // - concept id (the string, not the full URN)
            if (!isDefined(regionType))
                regionType = (_q = (_o = (_l = (_j = (_h = this.catalogItem.matchRegionProvider(dim.id)) === null || _h === void 0 ? void 0 : _h.regionType) !== null && _j !== void 0 ? _j : (_k = this.catalogItem.matchRegionProvider(codelist === null || codelist === void 0 ? void 0 : codelist.name)) === null || _k === void 0 ? void 0 : _k.regionType) !== null && _l !== void 0 ? _l : (_m = this.catalogItem.matchRegionProvider(codelist === null || codelist === void 0 ? void 0 : codelist.id)) === null || _m === void 0 ? void 0 : _m.regionType) !== null && _o !== void 0 ? _o : (_p = this.catalogItem.matchRegionProvider(concept === null || concept === void 0 ? void 0 : concept.name)) === null || _p === void 0 ? void 0 : _p.regionType) !== null && _q !== void 0 ? _q : (_r = this.catalogItem.matchRegionProvider(concept === null || concept === void 0 ? void 0 : concept.id)) === null || _r === void 0 ? void 0 : _r.regionType;
            // Apply regionTypeReplacements (which can replace regionType with a different regionType - using [{find:string, replace:string}] pattern)
            if ((modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.type) === "region") {
                const replacement = (_t = (_s = modelOverride === null || modelOverride === void 0 ? void 0 : modelOverride.regionTypeReplacements) === null || _s === void 0 ? void 0 : _s.find((r) => r.find === regionType)) === null || _t === void 0 ? void 0 : _t.replace;
                if (isDefined(replacement)) {
                    regionType = replacement;
                }
            }
            return createStratumInstance(TableColumnTraits, {
                name: dim.id,
                title: concept === null || concept === void 0 ? void 0 : concept.name,
                // We set columnType to hidden for all columns except for region columns - as we are never interested in visualising them
                // For "time" columns see `get timeColumns()`
                // For primary measure ("scalar") column - see `get primaryMeasureColumn()`
                type: isDefined(regionType) ? "region" : "hidden",
                regionType
            });
        })) !== null && _a !== void 0 ? _a : []);
    }
    /**
     * Add traits for time columns:
     * - `name` to dimension id
     * - `type = time`
     * - `title` to concept name (if it exists)
     */
    get timeColumns() {
        var _a;
        return ((_a = this.sdmxTimeDimensions.map((dim) => {
            var _a;
            const concept = this.getConceptByUrn(dim.conceptIdentity);
            return createStratumInstance(TableColumnTraits, {
                name: dim.id,
                title: (_a = concept === null || concept === void 0 ? void 0 : concept.name) !== null && _a !== void 0 ? _a : dim.id,
                type: "time"
            });
        })) !== null && _a !== void 0 ? _a : []);
    }
    /**
     * Add traits for attribute columns - all attribute columns are hidden, they are used to describe the primary measure (in feature info, unit measure, unit multiplier...):
     * - `name` to attribute id
     * - `type = hidden`
     */
    get attributeColumns() {
        var _a;
        return ((_a = this.sdmxAttributes.map((attr) => {
            return createStratumInstance(TableColumnTraits, {
                name: attr.id,
                type: "hidden"
            });
        })) !== null && _a !== void 0 ? _a : []);
    }
    /**
     * Munge all columns together
     */
    get columns() {
        return filterOutUndefined([
            this.primaryMeasureColumn,
            ...this.dimensionColumns,
            ...this.timeColumns,
            ...this.attributeColumns
        ]);
    }
    /** Get region TableColumn by searching catalogItem.tableColumns for region dimension
     * NOTE: this is searching through catalogItem.tableColumns to find the completely resolved regionColumn
     * This can only be used in computed/fns outside of ColumnTraits - or you will get infinite recursion
     */
    get resolvedRegionColumn() {
        return this.catalogItem.tableColumns.find((tableCol) => {
            var _a;
            return tableCol.name === ((_a = this.dimensionColumns.find((dimCol) => dimCol.type === "region")) === null || _a === void 0 ? void 0 : _a.name);
        });
    }
    /** If we only have a single region (or no regions)
     * We want to:
     * - disable the region column so we get a chart instead - see `get styles()`
     * - get region name for chart title (if single region) - see `get chartTitle()`
     **/
    get disableRegion() {
        var _a, _b, _c;
        return (!this.catalogItem.isLoading && ((_a = this.resolvedRegionColumn) === null || _a === void 0 ? void 0 : _a.ready) &&
            ((_c = (_b = this.resolvedRegionColumn) === null || _b === void 0 ? void 0 : _b.valuesAsRegions.uniqueRegionIds.length) !== null && _c !== void 0 ? _c : 0) <= 1);
    }
    /** Get nice title to use for chart
     * If we have a region column with a single region, it will append the region name to the title
     */
    get chartTitle() {
        var _a, _b, _c, _d, _e, _f;
        if (this.disableRegion) {
            const regionValues = (_a = this.resolvedRegionColumn) === null || _a === void 0 ? void 0 : _a.uniqueValues.values;
            if (regionValues && regionValues.length === 1) {
                // Get region dimension ID
                const regionDimensionId = (_b = this.getDimensionsWithOverrideType("region")[0]) === null || _b === void 0 ? void 0 : _b.id;
                // Lookup in sdmxDimensions to get codelist (this is needed because region dimensions which have more options than MAX_SELECTABLE_DIMENSION_OPTIONS will not return any dimension.options)
                const regionDimension = this.sdmxDimensions.find((dim) => dim.id === regionDimensionId);
                if (regionDimension) {
                    // Try to get human readable region name from codelist
                    const codelist = this.getCodelistByUrn((_c = regionDimension.localRepresentation) === null || _c === void 0 ? void 0 : _c.enumeration);
                    const regionName = (_f = (_e = (_d = codelist === null || codelist === void 0 ? void 0 : codelist.codes) === null || _d === void 0 ? void 0 : _d.find((c) => c.id === regionValues[0])) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : regionValues[0];
                    return `${regionName} - ${this.unitMeasure}`;
                }
            }
        }
        return this.unitMeasure;
    }
    /**
     * Set TableStyleTraits for primary measure column:
     * - Legend title is set to `unitMeasure` to add context - eg "AUD (Quarterly)"
     * - Chart traits are set if this dataflow is time-series with no region-mapping:
     *   - `xAxisColumn` to time column name
     *   - `lines.name` set to `unitMeasure`
     *   - `lines.yAxisColumn` set to primary measure column
     * - `regionColumn` set to region dimension name (if one exists)
     */
    get styles() {
        var _a;
        if (this.primaryMeasureColumn) {
            return [
                createStratumInstance(TableStyleTraits, {
                    id: this.primaryMeasureColumn.name,
                    color: createStratumInstance(TableColorStyleTraits, {
                        legend: createStratumInstance(LegendTraits, {
                            title: this.unitMeasure
                        }),
                        /** Enable z-score filtering (see TableColorStyleTraits.zScoreFilter) */
                        zScoreFilter: 4
                    }),
                    time: createStratumInstance(TableTimeStyleTraits, {
                        timeColumn: this.timeColumns[0].name,
                        spreadStartTime: true,
                        spreadFinishTime: true
                    }),
                    // Add chart if there is a time column but no region column
                    chart: this.timeColumns.length > 0 &&
                        (this.disableRegion || !this.resolvedRegionColumn)
                        ? createStratumInstance(TableChartStyleTraits, {
                            xAxisColumn: this.timeColumns[0].name,
                            lines: [
                                createStratumInstance(TableChartLineStyleTraits, {
                                    name: this.chartTitle,
                                    yAxisColumn: this.primaryMeasureColumn.name
                                })
                            ]
                        })
                        : undefined,
                    regionColumn: this.disableRegion
                        ? null
                        : (_a = this.resolvedRegionColumn) === null || _a === void 0 ? void 0 : _a.name
                })
            ];
        }
        return [];
    }
    /**
     * Set active table style to primary measure column
     */
    get activeStyle() {
        var _a;
        return (_a = this.primaryMeasureColumn) === null || _a === void 0 ? void 0 : _a.name;
    }
    /**
     * Set default time to last time of dataset
     */
    get initialTimeSource() {
        return "stop";
    }
    /**
     * Formats feature info table to add:
     * - Current time (if time-series)
     * - Selected region (if region-mapped)
     * - All dimension values
     * - Formatted primary measure (the actual value)
     * - Time-series chart
     */
    get featureInfoTemplate() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const regionType = (_a = this.resolvedRegionColumn) === null || _a === void 0 ? void 0 : _a.regionType;
        if (!regionType)
            return;
        let template = '<table class="cesium-infoBox-defaultTable">';
        // Function to format row with title and value
        const row = (title, value) => `<tr><td style="vertical-align: middle">${title}</td><td>${value}</td></tr>`;
        // Get time dimension values
        template += (_b = this.timeColumns) === null || _b === void 0 ? void 0 : _b.map((col) => { var _a; return row((_a = col.title) !== null && _a !== void 0 ? _a : "Time", `{{${col.name}}}`); }).join(", ");
        // Get region dimension values
        template += row(regionType === null || regionType === void 0 ? void 0 : regionType.description, `{{${regionType === null || regionType === void 0 ? void 0 : regionType.nameProp}}}`);
        // Get other dimension values
        template += (_c = filterEnums(this.catalogItem.sdmxSelectableDimensions)) === null || _c === void 0 ? void 0 : _c.filter((d) => (d.name || d.id) && !d.disable && d.selectedId).map((d) => {
            var _a, _b;
            const selectedOption = (_a = d.options) === null || _a === void 0 ? void 0 : _a.find((o) => o.id === d.selectedId);
            return row((d.name || d.id), (_b = selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.name) !== null && _b !== void 0 ? _b : d.selectedId);
        }).join("");
        const primaryMeasureName = (_h = (_f = (_d = this.unitMeasure) !== null && _d !== void 0 ? _d : (_e = this.primaryMeasureColumn) === null || _e === void 0 ? void 0 : _e.title) !== null && _f !== void 0 ? _f : (_g = this.primaryMeasureColumn) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : "Value";
        template +=
            row("", "") +
                row(primaryMeasureName, `{{#terria.formatNumber}}{useGrouping: true}{{${(_j = this.primaryMeasureColumn) === null || _j === void 0 ? void 0 : _j.name}}}{{/terria.formatNumber}}`);
        // Add timeSeries chart if more than one time observation
        if (this.catalogItem.discreteTimes &&
            this.catalogItem.discreteTimes.length > 1) {
            const chartName = `${this.catalogItem.name}: {{${regionType.nameProp}}}`;
            template += `</table>{{#terria.timeSeries.data}}<chart title="${chartName}" x-column="{{terria.timeSeries.xName}}" y-column="${this.unitMeasure}" >{{terria.timeSeries.data}}</chart>{{/terria.timeSeries.data}}`;
        }
        return createStratumInstance(FeatureInfoTemplateTraits, { template });
    }
    // ------------- START SDMX STRUCTURE HELPER FUNCTIONS -------------
    getConceptScheme(id) {
        var _a;
        if (!isDefined(id))
            return;
        return (_a = this.sdmxJsonDataflow.conceptSchemes) === null || _a === void 0 ? void 0 : _a.find((c) => c.id === id);
    }
    getConceptByUrn(urn) {
        var _a, _b;
        if (!urn)
            return;
        const conceptUrn = parseSdmxUrn(urn);
        const conceptSchemeId = conceptUrn === null || conceptUrn === void 0 ? void 0 : conceptUrn.resourceId;
        const conceptId = (_a = conceptUrn === null || conceptUrn === void 0 ? void 0 : conceptUrn.descendantIds) === null || _a === void 0 ? void 0 : _a[0];
        if (!isDefined(conceptId))
            return;
        let resolvedConceptScheme = typeof conceptSchemeId === "string"
            ? this.getConceptScheme(conceptSchemeId)
            : conceptSchemeId;
        return (_b = resolvedConceptScheme === null || resolvedConceptScheme === void 0 ? void 0 : resolvedConceptScheme.concepts) === null || _b === void 0 ? void 0 : _b.find((d) => d.id === conceptId);
    }
    getCodelistByUrn(urn) {
        var _a;
        if (!urn)
            return;
        const codelistUrn = parseSdmxUrn(urn);
        const id = codelistUrn === null || codelistUrn === void 0 ? void 0 : codelistUrn.resourceId;
        if (!isDefined(id))
            return;
        return (_a = this.sdmxJsonDataflow.codelists) === null || _a === void 0 ? void 0 : _a.find((c) => c.id === id);
    }
    /**
     * Find modelOverrides with type 'region-type' to try to extract regionType from another dimension
     * For example, ABS have a regionType dimension which may have values (SA1, SA2, ...), which could be used to determine regionType
     */
    getDimensionsWithOverrideType(type) {
        var _a;
        return filterOutUndefined((_a = this.catalogItem.modelOverrides) === null || _a === void 0 ? void 0 : _a.filter((override) => override.type === type && override.id).map((override) => {
            var _a;
            // Find dimension id with concept or codelist
            return (_a = this.catalogItem.dimensions) === null || _a === void 0 ? void 0 : _a.find((d) => { var _a; return d.id === ((_a = this.getDimensionWithConceptOrCodelist(override.id)) === null || _a === void 0 ? void 0 : _a.id); });
        }));
    }
    getDimensionWithConceptOrCodelist(id) {
        return this.sdmxDimensions.find((dim) => {
            var _a;
            return dim.conceptIdentity === id ||
                ((_a = dim.localRepresentation) === null || _a === void 0 ? void 0 : _a.enumeration) === id;
        });
    }
    getAttributionWithConceptOrCodelist(id) {
        return this.sdmxAttributes.find((attr) => {
            var _a;
            return attr.conceptIdentity === id ||
                ((_a = attr.localRepresentation) === null || _a === void 0 ? void 0 : _a.enumeration) === id;
        });
    }
}
SdmxJsonDataflowStratum.stratumName = "sdmxJsonDataflow";
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "description", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "metadataUrls", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "shortReportSections", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "dimensions", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "modelOverrides", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "unitMeasure", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "primaryMeasureColumn", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "dimensionColumns", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "timeColumns", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "attributeColumns", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "columns", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "resolvedRegionColumn", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "disableRegion", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "chartTitle", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "styles", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "activeStyle", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "initialTimeSource", null);
__decorate([
    computed
], SdmxJsonDataflowStratum.prototype, "featureInfoTemplate", null);
StratumOrder.addLoadStratum(SdmxJsonDataflowStratum.stratumName);
//# sourceMappingURL=SdmxJsonDataflowStratum.js.map