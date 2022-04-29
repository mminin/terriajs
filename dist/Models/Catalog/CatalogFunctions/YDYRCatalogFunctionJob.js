var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, runInAction } from "mobx";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import loadWithXhr from "../../../Core/loadWithXhr";
import CatalogFunctionJobMixin from "../../../ModelMixins/CatalogFunctionJobMixin";
import TableMixin from "../../../ModelMixins/TableMixin";
import YDYRCatalogFunctionJobTraits from "../../../Traits/TraitsClasses/YDYRCatalogFunctionJobTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import CsvCatalogItem from "../CatalogItems/CsvCatalogItem";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import { ALGORITHMS, DATASETS } from "./YDYRCatalogFunction";
export default class YDYRCatalogFunctionJob extends CatalogFunctionJobMixin(CreateModel(YDYRCatalogFunctionJobTraits)) {
    constructor() {
        super(...arguments);
        this.typeName = "YourDataYourRegions Job";
    }
    get type() {
        return YDYRCatalogFunctionJob.type;
    }
    async _invoke() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!isDefined(this.parameters)) {
            throw "Parameters have not been set";
        }
        if (!isDefined(this.parameters["apiUrl"])) {
            throw "The apiUrl parameter must be defined.";
        }
        if (!isDefined(this.parameters["Input Layer"])) {
            throw "The input layer must be defined";
        }
        const tableCatalogItem = this.terria.workbench.items
            .filter(TableMixin.isMixedInto)
            .filter(item => item.uniqueId === this.parameters["Input Layer"])[0];
        if (!isDefined(tableCatalogItem)) {
            throw `Layer ${this.parameters["Input Layer"]} is not a valid layer in the workbench`;
        }
        if (!isDefined(this.parameters["Region Column"]) ||
            !isDefined(this.parameters["Data Column"]) ||
            !isDefined(this.parameters["Output Geography"])) {
            throw `The region column, data column and output geography must be defined`;
        }
        const regionColumnName = this.parameters["Region Column"];
        const dataColumnName = this.parameters["Data Column"];
        const outputGeographyName = this.parameters["Output Geography"];
        const regionColumn = tableCatalogItem === null || tableCatalogItem === void 0 ? void 0 : tableCatalogItem.findColumnByName(regionColumnName);
        const dataColumn = tableCatalogItem === null || tableCatalogItem === void 0 ? void 0 : tableCatalogItem.findColumnByName(dataColumnName);
        this.setTrait(CommonStrata.user, "name", `YDYR ${tableCatalogItem.name}: ${dataColumnName}`);
        const jobDetails = this.addObject(CommonStrata.user, "shortReportSections", "Job Details");
        jobDetails === null || jobDetails === void 0 ? void 0 : jobDetails.setTrait(CommonStrata.user, "content", `${dataColumnName}: "${(_a = DATASETS.find(d => { var _a; return d.geographyName === ((_a = regionColumn === null || regionColumn === void 0 ? void 0 : regionColumn.regionType) === null || _a === void 0 ? void 0 : _a.regionType); })) === null || _a === void 0 ? void 0 : _a.title}" to "${outputGeographyName}"`);
        const data = {
            ids: regionColumn === null || regionColumn === void 0 ? void 0 : regionColumn.values,
            values: dataColumn === null || dataColumn === void 0 ? void 0 : dataColumn.valuesAsNumbers.values
        };
        if (!((_b = data.ids) === null || _b === void 0 ? void 0 : _b.length) || !((_c = data.values) === null || _c === void 0 ? void 0 : _c.length)) {
            throw `The column selected has no valid data values`;
        }
        // Remove rows with null values
        const invalidRows = filterOutUndefined(data.values.map((val, idx) => (val === null ? idx : undefined)));
        data.ids = data.ids.filter((id, idx) => !invalidRows.includes(idx));
        data.values = data.values.filter((value, idx) => !invalidRows.includes(idx));
        const params = {
            data,
            data_column: dataColumnName,
            geom_column: regionColumnName,
            side_data: (_d = DATASETS.find(d => d.title === outputGeographyName)) === null || _d === void 0 ? void 0 : _d.sideData,
            dst_geom: (_e = DATASETS.find(d => d.title === outputGeographyName)) === null || _e === void 0 ? void 0 : _e.geographyName,
            src_geom: (_g = (_f = tableCatalogItem === null || tableCatalogItem === void 0 ? void 0 : tableCatalogItem.activeTableStyle.regionColumn) === null || _f === void 0 ? void 0 : _f.regionType) === null || _g === void 0 ? void 0 : _g.regionType,
            averaged_counts: false,
            algorithms: ALGORITHMS.filter(alg => this.parameters[alg[0]]).map(alg => alg[0])
        };
        const jobId = await loadWithXhr({
            url: proxyCatalogItemUrl(this, `${this.parameters["apiUrl"]}disaggregate.json`),
            method: "POST",
            data: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json"
            },
            responseType: "json"
        });
        if (typeof jobId !== "string") {
            // TODO: improve error messaging
            // This is from previous YDYR web-app
            //   switch(createJobReponse.status) {
            //     case 202:
            //       createJobReponse.response
            //       break
            //     case 500:
            //       break
            //     default:
            //       break
            //   }
            //   if(r.status === 202) {
            //     // then the request was accepted
            //     r.json().then(j => poller(j));
            // } else if(r.status === 500) {
            //     // server error
            //     r.json().then(e => error({
            //         title: (e && e.title) || 'Server Error',
            //         detail: 'Job failed to submit' +
            //             ((e && e.detail) ? (': ' + e.detail) : '')}));
            // } else {
            //     const subber = s => {
            //         if(s.includes('is not valid under any of the given schemas')) {
            //             return 'invalid JSON data';
            //         }
            //         return s.length < 100 ? s : (s.substring(0, 100) + '...');
            //     }
            //     r.json()
            //       .then(e => error({
            //         title: (e && e.title) || 'Server Error',
            //         detail: 'Unexpected status (' + r.status.toString() + ') ' +
            //             'when submitting job' +
            //                 ((e && e.detail) ? (': ' + subber(e.detail)) : '')}))
            //       .catch(e => error({
            //         title: (e && e.title) || 'Error parsing JSON response',
            //         detail: `Received ${r.status} response code and failed to parse response as JSON`
            //       }));
            // }
            throw `The YDYR server didn't provide a valid job id.`;
        }
        this.setTrait(CommonStrata.user, "jobId", jobId);
        return false;
    }
    async pollForResults() {
        if (!isDefined(this.jobId)) {
            console.log("NO JOB ID");
            return true;
        }
        if (!isDefined(this.parameters["apiUrl"])) {
            console.log("apiUrl parameter is not defined");
            return true;
        }
        const status = await loadJson(proxyCatalogItemUrl(this, `${this.parameters["apiUrl"]}status/${this.jobId}`), {
            "Cache-Control": "no-cache"
        });
        if (typeof status !== "string") {
            runInAction(() => this.setTrait(CommonStrata.user, "logs", [
                ...this.logs,
                JSON.stringify(status)
            ]));
            this.setTrait(CommonStrata.user, "resultId", status.key);
            return true;
        }
        else {
            runInAction(() => this.setTrait(CommonStrata.user, "logs", [...this.logs, status]));
            return false;
        }
    }
    async downloadResults() {
        var _a;
        if (!isDefined(this.resultId)) {
            return [];
        }
        if (!isDefined(this.parameters["apiUrl"])) {
            console.log("apiUrl parameter is not defined");
            return [];
        }
        const csvResult = new CsvCatalogItem(`${this.uniqueId}-result`, this.terria, undefined);
        let regionColumnSplit = (_a = DATASETS.find(d => { var _a; return d.title === ((_a = this.parameters) === null || _a === void 0 ? void 0 : _a["Output Geography"]); })) === null || _a === void 0 ? void 0 : _a.geographyName.split("_");
        let regionColumn = "";
        if (isDefined(regionColumnSplit) && regionColumnSplit.length === 2) {
            regionColumn = `${regionColumnSplit[0]}_code_${regionColumnSplit[1]}`;
        }
        runInAction(() => {
            csvResult.setTrait(CommonStrata.user, "name", `${this.name} Results`);
            csvResult.setTrait(CommonStrata.user, "url", proxyCatalogItemUrl(this, `${this.parameters["apiUrl"]}download/${this.resultId}?format=csv`));
            csvResult.setTrait(CommonStrata.user, "enableManualRegionMapping", true);
        });
        return [csvResult];
    }
}
YDYRCatalogFunctionJob.type = "ydyr-job";
__decorate([
    action
], YDYRCatalogFunctionJob.prototype, "_invoke", null);
//# sourceMappingURL=YDYRCatalogFunctionJob.js.map