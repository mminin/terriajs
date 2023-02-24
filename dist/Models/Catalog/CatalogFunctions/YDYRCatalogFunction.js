var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import CatalogFunctionMixin from "../../../ModelMixins/CatalogFunctionMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import TableMixin from "../../../ModelMixins/TableMixin";
import TableColumnType from "../../../Table/TableColumnType";
import YDYRCatalogFunctionTraits from "../../../Traits/TraitsClasses/YDYRCatalogFunctionTraits";
import CreateModel from "../../Definition/CreateModel";
import BooleanParameter from "../../FunctionParameters/BooleanParameter";
import EnumerationParameter from "../../FunctionParameters/EnumerationParameter";
import InfoParameter from "../../FunctionParameters/InfoParameter";
import StringParameter from "../../FunctionParameters/StringParameter";
import YDYRCatalogFunctionJob from "./YDYRCatalogFunctionJob";
export const DATASETS = [
    {
        title: "ABS - 2011 Statistical Areas Level 1",
        filename: "SA1_2011_AUST",
        dataCol: "SA1_MAIN11",
        geographyName: "SA1_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Statistical Areas Level 2",
        filename: "SA2_2011_AUST",
        dataCol: "SA2_MAIN11",
        geographyName: "SA2_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Statistical Areas Level 3",
        filename: "SA3_2011_AUST",
        dataCol: "SA3_CODE11",
        geographyName: "SA3_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Statistical Areas Level 4",
        filename: "SA4_2011_AUST",
        dataCol: "SA4_CODE11",
        geographyName: "SA4_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Local Government Areas",
        filename: "LGA_2011_AUST",
        dataCol: "LGA_CODE11",
        geographyName: "LGA_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Commonwealth Electoral Divisions",
        filename: "CED_2011_AUST",
        dataCol: "CED_CODE11",
        geographyName: "CED_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 State Electoral Divisions",
        filename: "SED_2011_AUST",
        dataCol: "SED_CODE11",
        geographyName: "SED_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Remoteness Areas 2011",
        filename: "RA_2011_AUST",
        dataCol: "RA_CODE11",
        geographyName: "RA_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 State Suburbs",
        filename: "SSC_2011_AUST",
        dataCol: "SSC_CODE11",
        geographyName: "SSC_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2011 Postal Areas",
        filename: "POA_2011_AUST",
        dataCol: "POA_CODE",
        geographyName: "POA_2011",
        sideData: "BCP_2011"
    },
    {
        title: "ABS - 2016 Statistical Areas Level 1",
        filename: "SA1_2016_AUST",
        dataCol: "SA1_MAIN16",
        geographyName: "SA1_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 Statistical Areas Level 2",
        filename: "SA2_2016_AUST",
        dataCol: "SA2_MAIN16",
        geographyName: "SA2_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 Statistical Areas Level 3",
        filename: "SA3_2016_AUST",
        dataCol: "SA3_CODE16",
        geographyName: "SA3_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 Statistical Areas Level 4",
        filename: "SA4_2016_AUST",
        dataCol: "SA4_CODE16",
        geographyName: "SA4_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 Local Government Areas",
        filename: "LGA_2016_AUST",
        dataCol: "LGA_CODE16",
        geographyName: "LGA_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 Commonwealth Electoral Divisions",
        filename: "CED_2016_AUST",
        dataCol: "CED_CODE16",
        geographyName: "CED_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 State Electoral Divisions",
        filename: "SED_2016_AUST",
        dataCol: "SED_CODE16",
        geographyName: "SED_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - Remoteness Areas 2016",
        filename: "RA_2016_AUST",
        dataCol: "RA_CODE16",
        geographyName: "RA_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 State Suburbs",
        filename: "SSC_2016_AUST",
        dataCol: "SSC_CODE16",
        geographyName: "SSC_2016",
        sideData: "BCP_2016"
    },
    {
        title: "ABS - 2016 Postal Areas",
        filename: "POA_2016_AUST",
        dataCol: "POA_CODE16",
        geographyName: "POA_2016",
        sideData: "BCP_2016"
    }
];
export const SIDE_DATA = [
    { title: "Basic Community profile 2011", id: "BCP_2011" },
    { title: "Basic Community profile 2016", id: "BCP_2016" }
];
export const ALGORITHMS = [
    ["Negative Binomial", true],
    ["Population Weighted", false]
    // ["Poisson Linear", false],
    // ["Ridge Regressor", false]
];
export default class YDYRCatalogFunction extends CatalogFunctionMixin(CreateModel(YDYRCatalogFunctionTraits)) {
    constructor() {
        super(...arguments);
        this.typeName = "YourDataYourRegions";
    }
    get type() {
        return YDYRCatalogFunction.type;
    }
    async createJob(id) {
        return new YDYRCatalogFunctionJob(id, this.terria);
    }
    async forceLoadMetadata() {
        return super.forceLoadMetadata();
        // TODO: load capabilities from https://ydyr.info/api/v1/capability?format=json
        // https://github.com/TerriaJS/terriajs/issues/4943
    }
    get description() {
        var _a;
        return ((_a = super.description) !== null && _a !== void 0 ? _a : `Your Data Your Regions (YDYR) is an API for the conversion of data between different Australian geographic boundaries. See <a href="https://ydyr.info">ydyr.info</a> for more information`);
    }
    get selectedTableCatalogMember() {
        var _a;
        if (!isDefined((_a = this.inputLayers) === null || _a === void 0 ? void 0 : _a.value)) {
            return;
        }
        const layer = this.terria.workbench.items
            .filter(TableMixin.isMixedInto)
            .filter((item) => item.uniqueId === this.inputLayers.value)[0];
        return layer;
    }
    get apiUrl() {
        return new StringParameter(this, {
            id: "apiUrl",
            name: "YDYR API Endpoint",
            isRequired: true
        });
    }
    get inputLayers() {
        const possibleValues = this.terria.workbench.items
            .filter((item) => TableMixin.isMixedInto(item) && item.activeTableStyle.isRegions())
            .filter((item) => item.uniqueId)
            .map((item) => {
            return {
                id: item.uniqueId,
                name: CatalogMemberMixin.isMixedInto(item) ? item.name : undefined
            };
        });
        return new EnumerationParameter(this, {
            id: "Input Layer",
            description: `Select a layer which contains the tabular data you want to convert to another geography, It should contain at least two columns:
- A geography column containing unique codes (eg postcodes)
- A data column containing the values you want to convert (eg number of households by postcode)`,
            options: possibleValues,
            isRequired: true
        });
    }
    get inputLayersInfo() {
        let value = "";
        if (isDefined(this.inputLayers.value) && !this.inputLayers.isValid) {
            value = `The selected layer "${this.inputLayers.value} does not exist in the map". `;
        }
        if (this.inputLayers.options.length === 0) {
            value = `No supported input layers available, please add a region-mapped data layer to the map.`;
        }
        if (value !== "") {
            return new InfoParameter(this, {
                id: "inputLayersError",
                name: "Input Layer Error",
                errorMessage: true,
                value
            });
        }
    }
    get regionColumn() {
        var _a;
        if (!this.inputLayers.isValid) {
            return;
        }
        const possibleValues = ((_a = this.selectedTableCatalogMember) === null || _a === void 0 ? void 0 : _a.tableColumns.filter((col) => col.type === TableColumnType.region &&
            isDefined(DATASETS.find((d) => { var _a; return d.dataCol === ((_a = col.regionType) === null || _a === void 0 ? void 0 : _a.regionProp); }))).map((col) => {
            return { id: col.name };
        })) || [];
        return new EnumerationParameter(this, {
            id: "Region Column",
            description: "The data source field which contains unique codes for the input geography.",
            options: possibleValues,
            isRequired: true
        });
    }
    get regionColumnInfo() {
        var _a;
        if (this.inputLayers.isValid && ((_a = this.regionColumn) === null || _a === void 0 ? void 0 : _a.options.length) === 0) {
            return new InfoParameter(this, {
                id: "regionColumnError",
                name: "Region Column Error",
                errorMessage: true,
                value: `No region columns available, the selected layer "${this.inputLayers.value}" doesn't have any supported region columns.
The region mapping can be set in the Workbench.

**Supported regions:**
${DATASETS.map((d) => `\n- ${d.title}`)}`
            });
        }
    }
    get dataColumn() {
        var _a;
        if (!this.inputLayers.isValid) {
            return;
        }
        const possibleValues = ((_a = this.selectedTableCatalogMember) === null || _a === void 0 ? void 0 : _a.tableColumns.filter((col) => col.type === TableColumnType.scalar).map((col) => {
            return { id: col.name };
        })) || [];
        if (possibleValues.length === 0) {
        }
        return new EnumerationParameter(this, {
            id: "Data Column",
            description: "The data source field which contains the values for the data to be converted.",
            options: possibleValues,
            isRequired: true
        });
    }
    get dataColumnInfo() {
        var _a;
        if (this.inputLayers.isValid && ((_a = this.dataColumn) === null || _a === void 0 ? void 0 : _a.options.length) === 0) {
            return new InfoParameter(this, {
                id: "dataColumnError",
                name: "Data Column Error",
                errorMessage: true,
                value: `No data columns available, the selected layer "${this.inputLayers.value}" doesn't have any numerical columns.`
            });
        }
    }
    get availableRegions() {
        var _a;
        if (!((_a = this.regionColumn) === null || _a === void 0 ? void 0 : _a.isValid)) {
            return;
        }
        return new EnumerationParameter(this, {
            id: "Output Geography",
            description: "The output geography to be converted to.",
            options: DATASETS.map((d) => {
                return { id: d.title };
            }),
            isRequired: true
        });
    }
    get algorithmParametersInfo() {
        if (this.algorithmParameters.length > 0) {
            return new InfoParameter(this, {
                id: "algorithmsInfo",
                name: "Select Algorithms",
                value: `Predictive models used to convert data between the input and output geographies:`
            });
        }
    }
    get algorithmParameters() {
        var _a, _b, _c;
        if (!((_a = this.regionColumn) === null || _a === void 0 ? void 0 : _a.isValid) ||
            !((_b = this.dataColumn) === null || _b === void 0 ? void 0 : _b.isValid) ||
            !((_c = this.availableRegions) === null || _c === void 0 ? void 0 : _c.isValid)) {
            return [];
        }
        return ALGORITHMS.map((alg) => new BooleanParameter(this, {
            id: alg[0]
        }));
    }
    get submitWarning() {
        var _a, _b, _c;
        if (this.inputLayers.isValid && ((_a = this.regionColumn) === null || _a === void 0 ? void 0 : _a.isValid) && ((_b = this.dataColumn) === null || _b === void 0 ? void 0 : _b.isValid) && ((_c = this.availableRegions) === null || _c === void 0 ? void 0 : _c.isValid)) {
            return new InfoParameter(this, {
                id: "dataWarning",
                name: "Warning",
                errorMessage: false,
                value: `By submitting this form your tabular data will be sent to ${this.apiUrl.value} for processing.`
            });
        }
    }
    // Disabled due to lack of get capabilities from YDYR server
    // @computed get sidedataParameters(): EnumerationParameter {
    //   const possibleValues = SIDE_DATA.map(data => data.title);
    //   let value = possibleValues[0]
    //   if (isDefined(this.availableRegions.value)) {
    //   }
    //   return new EnumerationParameter({
    //     id: "Side data",
    //     possibleValues,
    //     value: possibleValues[0]
    //   });
    // }
    /**
     *  Maps the input to function parameters.
     */
    get functionParameters() {
        return filterOutUndefined([
            this.apiUrl,
            this.inputLayers,
            this.inputLayersInfo,
            this.regionColumnInfo || this.regionColumn,
            this.dataColumnInfo || this.dataColumn,
            this.availableRegions,
            this.algorithmParametersInfo,
            ...this.algorithmParameters,
            this.submitWarning
            // this.sidedataParameters
        ]);
    }
}
YDYRCatalogFunction.type = "ydyr";
__decorate([
    computed
], YDYRCatalogFunction.prototype, "description", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "selectedTableCatalogMember", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "apiUrl", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "inputLayers", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "inputLayersInfo", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "regionColumn", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "regionColumnInfo", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "dataColumn", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "dataColumnInfo", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "availableRegions", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "algorithmParametersInfo", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "algorithmParameters", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "submitWarning", null);
__decorate([
    computed
], YDYRCatalogFunction.prototype, "functionParameters", null);
//# sourceMappingURL=YDYRCatalogFunction.js.map