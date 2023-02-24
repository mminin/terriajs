var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { flatten } from "lodash-es";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import loadWithXhr from "../../../Core/loadWithXhr";
import loadXML from "../../../Core/loadXML";
import runLater from "../../../Core/runLater";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import xml2json from "../../../ThirdParty/xml2json";
import CswCatalogGroupTraits from "../../../Traits/TraitsClasses/CswCatalogGroupTraits";
import ArcGisMapServerCatalogItem from "../Esri/ArcGisMapServerCatalogItem";
import CatalogGroup from "../CatalogGroup";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import CsvCatalogItem from "../CatalogItems/CsvCatalogItem";
import GeoJsonCatalogItem from "../CatalogItems/GeoJsonCatalogItem";
import KmlCatalogItem from "../CatalogItems/KmlCatalogItem";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
import WebMapServiceCatalogItem from "./WebMapServiceCatalogItem";
const defaultGetRecordsTemplate = require("../Ows/CswGetRecordsTemplate.xml");
function toArray(val) {
    if (!isDefined(val))
        return undefined;
    return Array.isArray(val) ? val : [val];
}
class CswStratum extends LoadableStratum(CswCatalogGroupTraits) {
    constructor(catalogGroup, metadataGroups, records) {
        super();
        this.catalogGroup = catalogGroup;
        this.metadataGroups = metadataGroups;
        this.records = records;
    }
    static async load(catalogGroup) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (catalogGroup.url === undefined) {
            throw new TerriaError({
                title: i18next.t("models.csw.missingUrlTitle"),
                message: i18next.t("models.csw.missingUrlMessage")
            });
        }
        const metadataGroups = [];
        /**
         * If domainSpecification properties are set (and we aren't flattening the catalog) - we will try to create MetadataGroups * from a GetDomain response (using the specified domainPropertyName).
         *
         * An example GetDomain response (see wwwroot\test\csw\Example1GetDomain.xml):
         * ...
         * <csw:Value>Multiple Use | Fisheries Effort</csw:Value>
         * <csw:Value>Multiple Use | Pollution</csw:Value>
         * <csw:Value>Multiple Use | Sea Surface Temperature</csw:Value>
         * <csw:Value>Multiple Use | Seismic Surveys</csw:Value>
         * <csw:Value>Multiple Use | Shipping</csw:Value>
         * ...
         *
         * These strings are used to generate MetadataGroups with:
         * - Hierarchy separator used to split strings into pieces (domainSpecification.hierarchySeparator = " | ")
         * - Query property name used to match values to Records (domainSpecification.queryPropertyName = "subject"). That is to say, we will search through Record["subject"] to add Records to sepcific MetadataGroups
         */
        if (!catalogGroup.flatten &&
            catalogGroup.domainSpecification.domainPropertyName &&
            catalogGroup.domainSpecification.hierarchySeparator &&
            catalogGroup.domainSpecification.queryPropertyName) {
            const getDomainUrl = new URI(proxyCatalogItemUrl(catalogGroup, catalogGroup.url)).query({
                service: "CSW",
                version: "2.0.2",
                request: "GetDomain",
                propertyname: catalogGroup.domainSpecification.domainPropertyName
            });
            let domainResponse;
            try {
                const xml = await loadXML(getDomainUrl.toString());
                if (!xml ||
                    !xml.documentElement ||
                    xml.documentElement.localName !== "GetDomainResponse") {
                    throw `Invalid XML response`;
                }
                domainResponse = xml2json(xml);
            }
            catch (error) {
                console.log(error);
                throw networkRequestError({
                    sender: catalogGroup,
                    title: i18next.t("models.csw.notUseableTitle"),
                    message: i18next.t("models.csw.notUseableMessage")
                });
            }
            if (!domainResponse) {
                throw networkRequestError({
                    sender: catalogGroup,
                    title: i18next.t("models.csw.errorLoadingTitle"),
                    message: i18next.t("models.csw.checkCORSDomain")
                });
            }
            // Get flat listOfValues
            const listOfValues = flatten((_a = toArray(domainResponse.DomainValues)) === null || _a === void 0 ? void 0 : _a.map((d) => { var _a; return toArray((_a = d === null || d === void 0 ? void 0 : d.ListOfValues) === null || _a === void 0 ? void 0 : _a.Value); })).filter((v) => typeof v === "string");
            // Create metadataGroups from listOfValues
            listOfValues.forEach((value) => {
                const keys = value.split(catalogGroup.domainSpecification.hierarchySeparator);
                // recursively find the group that the last key in keys should belong to and add that key
                addMetadataGroups(keys, 0, metadataGroups, catalogGroup.domainSpecification.hierarchySeparator, catalogGroup.domainSpecification.queryPropertyName);
            });
        }
        // Get Records
        let paging = true;
        let startPosition = 1;
        const records = [];
        // We have to paginate through Records
        while (paging) {
            // Replace {startPosition}
            const postData = ((_b = catalogGroup.getRecordsTemplate) !== null && _b !== void 0 ? _b : defaultGetRecordsTemplate).replace("{startPosition}", startPosition);
            const xml = await loadWithXhr({
                url: proxyCatalogItemUrl(catalogGroup, new URI(catalogGroup.url).query("").toString(), "1d"),
                responseType: "document",
                method: "POST",
                overrideMimeType: "text/xml",
                data: postData,
                headers: {
                    "Content-Type": "application/xml"
                }
            });
            if (!isDefined(xml)) {
                throw networkRequestError({
                    sender: catalogGroup,
                    title: i18next.t("models.csw.errorLoadingRecordsTitle"),
                    message: i18next.t("models.csw.errorLoadingRecordsMessage")
                });
            }
            const json = xml2json(xml);
            if (json.Exception) {
                let errorMessage = i18next.t("models.csw.unknownError");
                if (json.Exception.ExceptionText) {
                    errorMessage = i18next.t("models.csw.exceptionMessage", {
                        exceptionText: json.Exception.ExceptionText
                    });
                }
                throw new TerriaError({
                    sender: catalogGroup,
                    title: i18next.t("models.csw.errorLoadingTitle"),
                    message: errorMessage
                });
            }
            records.push(...((_d = (_c = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _c === void 0 ? void 0 : _c.Record) !== null && _d !== void 0 ? _d : []));
            // Get next start position - or stop pageing
            const nextRecord = typeof ((_e = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _e === void 0 ? void 0 : _e.nextRecord) === "string"
                ? parseInt((_g = (_f = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _f === void 0 ? void 0 : _f.nextRecord) !== null && _g !== void 0 ? _g : "0")
                : (_h = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _h === void 0 ? void 0 : _h.nextRecord;
            const numberOfRecordsMatched = typeof ((_j = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _j === void 0 ? void 0 : _j.numberOfRecordsMatched) === "string"
                ? parseInt((_l = (_k = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _k === void 0 ? void 0 : _k.numberOfRecordsMatched) !== null && _l !== void 0 ? _l : "0")
                : (_m = json === null || json === void 0 ? void 0 : json.SearchResults) === null || _m === void 0 ? void 0 : _m.numberOfRecordsMatched;
            if (!isDefined(nextRecord) ||
                nextRecord === 0 ||
                nextRecord >= numberOfRecordsMatched) {
                paging = false;
            }
            else {
                startPosition = nextRecord;
            }
        }
        // If we have metadataGroups, add records to them
        if (metadataGroups.length > 0) {
            records.forEach((record) => {
                var _a;
                (_a = findGroup(metadataGroups, record)) === null || _a === void 0 ? void 0 : _a.records.push(record);
            });
        }
        return new CswStratum(catalogGroup, metadataGroups, records);
    }
    duplicateLoadableStratum(model) {
        return new CswStratum(model, this.metadataGroups, this.records);
    }
    get members() {
        // If no metadataGroups - return flat list of record ids
        if (this.metadataGroups.length === 0) {
            return this.records.map((r) => `${this.catalogGroup.uniqueId}/${r.identifier}`);
        }
        return this.metadataGroups.map((g) => `${this.catalogGroup.uniqueId}/${g.groupName}`);
    }
    createMembersFromLayers() {
        // If no metadata groups -> just create all records
        if (this.metadataGroups.length === 0) {
            this.records.forEach((record) => this.createRecord(this.catalogGroup.uniqueId, record));
            // If metadata groups -> create them (records will then be created for each group)
        }
        else {
            this.metadataGroups.forEach((metadataGroup) => this.createMetadataGroup(this.catalogGroup.uniqueId, metadataGroup));
        }
    }
    createMetadataGroup(parentId, metadataGroup) {
        const layerId = `${parentId}/${metadataGroup.groupName}`;
        const existingModel = this.catalogGroup.terria.getModelById(CatalogGroup, layerId);
        let model;
        if (existingModel === undefined) {
            model = new CatalogGroup(layerId, this.catalogGroup.terria);
            this.catalogGroup.terria.addModel(model);
        }
        else {
            model = existingModel;
        }
        // Replace the stratum inherited from the parent group.
        model.strata.delete(CommonStrata.definition);
        model.setTrait(CommonStrata.definition, "name", metadataGroup.groupName);
        model.setTrait(CommonStrata.definition, "members", filterOutUndefined([
            ...metadataGroup.children.map((childMetadataGroup) => this.createMetadataGroup(layerId, childMetadataGroup).uniqueId),
            ...metadataGroup.records.map((record) => { var _a; return (_a = this.createRecord(layerId, record)) === null || _a === void 0 ? void 0 : _a.uniqueId; })
        ]));
        return model;
    }
    createRecord(parentId, record) {
        var _a, _b, _c, _d, _e;
        const uris = toArray((_a = record.URI) !== null && _a !== void 0 ? _a : record.references);
        if (!isDefined(uris)) {
            return;
        }
        /**
         * Array of acceptable URLS for catalog item. Its indices map to resourceFormats' index.
         * For example - if `acceptableUrls[1]` is defined, it maps to `resourceFormats[1]` - which is a ArcGisMapServerCatalogItem
         */
        const acceptableUris = [];
        /**
         * There may be more than one url that results in a data layer here - so check for
         * the acceptable ones, store the others as downloadUrls that can be
         * displayed in the metadata summary for the layer
         */
        const downloadUrls = [];
        let legendUri = undefined;
        const filteredResourceFormats = this.resourceFormats.filter((f) => f.enabled);
        for (let m = 0; m < uris.length; m++) {
            const uri = uris[m];
            if (!uri)
                return;
            const resourceIndex = filteredResourceFormats.findIndex((f) => { var _a, _b; return (_b = ((_a = uri.protocol) !== null && _a !== void 0 ? _a : uri.scheme)) === null || _b === void 0 ? void 0 : _b.match(f.regex); });
            // If matching resource is found, and an acceptable URL hasn't been set for it -> add it
            if (resourceIndex !== -1 && !acceptableUris[resourceIndex]) {
                acceptableUris[resourceIndex] = uri;
            }
            else {
                if ((uri === null || uri === void 0 ? void 0 : uri.description) === "LegendUrl") {
                    legendUri = uri;
                }
                downloadUrls.push({
                    url: uri.toString(),
                    description: uri.description ? uri.description : uri.name
                });
            }
        }
        const layerId = `${parentId}/${record.identifier}`;
        const urlIndex = acceptableUris.findIndex((url) => isDefined(url));
        if (urlIndex !== -1) {
            const modelConstructor = this.resourceFormats[urlIndex].contructor;
            const existingModel = this.catalogGroup.terria.getModelById(modelConstructor, layerId);
            let model;
            if (existingModel === undefined) {
                model = new modelConstructor(layerId, this.catalogGroup.terria);
                this.catalogGroup.terria.addModel(model);
            }
            else {
                model = existingModel;
            }
            // Replace the stratum inherited from the parent group.
            model.strata.delete(CommonStrata.definition);
            model.setTrait(CommonStrata.definition, "name", (_b = record.title) !== null && _b !== void 0 ? _b : record.identifier);
            const uri = acceptableUris[urlIndex];
            model.setTrait(CommonStrata.definition, "url", uri.toString());
            if (record.abstract) {
                model.setTrait(CommonStrata.definition, "description", (_c = toArray(record.abstract)) === null || _c === void 0 ? void 0 : _c.join("\n\n"));
            }
            else if (record.description) {
                model.setTrait(CommonStrata.definition, "description", (_d = toArray(record.description)) === null || _d === void 0 ? void 0 : _d.join("\n\n"));
            }
            const infoSections = [];
            if (record.contributor && toArray(record.contributor).length > 0) {
                infoSections.push({
                    name: i18next.t("models.csw.dataResponsibility"),
                    content: (_e = toArray(record.contributor)) === null || _e === void 0 ? void 0 : _e.join("\n\n")
                });
            }
            infoSections.push({
                name: i18next.t("models.csw.links"),
                content: downloadUrls
                    .map((d) => `[${d.description}](${d.url})`)
                    .join("\n\n")
            });
            model.setTrait(CommonStrata.definition, "info", infoSections);
            model.setTrait(CommonStrata.definition, "metadataUrls", [
                {
                    title: i18next.t("models.csw.metadataURL"),
                    url: new URI(proxyCatalogItemUrl(this.catalogGroup, this.catalogGroup.url))
                        .query({
                        service: "CSW",
                        version: "2.0.2",
                        request: "GetRecordById",
                        outputSchema: "http://www.opengis.net/cat/csw/2.0.2",
                        ElementSetName: "full",
                        id: record.identifier
                    })
                        .toString()
                }
            ]);
            if (legendUri) {
                model.setTrait(CommonStrata.definition, "legends", [
                    { url: legendUri.toString() }
                ]);
            }
            // If this is a WMS item, we MUST set `layers` trait to `uri.name`
            if (model instanceof WebMapServiceCatalogItem) {
                if (!uri.name) {
                    return;
                }
                model.setTrait(CommonStrata.definition, "layers", uri.name);
            }
            // Same with ArcGis MapServer
            if (model instanceof ArcGisMapServerCatalogItem) {
                if (!uri.name) {
                    return;
                }
                model.setTrait(CommonStrata.definition, "layers", uri.name);
            }
            return model;
        }
    }
    /**
     * These are used to match URLs to model constructors
     */
    get resourceFormats() {
        return [
            {
                enabled: this.catalogGroup.includeWms,
                regex: new RegExp(this.catalogGroup.wmsResourceFormat, "i"),
                contructor: WebMapServiceCatalogItem
            },
            {
                enabled: this.catalogGroup.includeEsriMapServer,
                regex: new RegExp(this.catalogGroup.esriMapServerResourceFormat, "i"),
                contructor: ArcGisMapServerCatalogItem
            },
            {
                enabled: this.catalogGroup.includeKml,
                regex: new RegExp(this.catalogGroup.kmlResourceFormat, "i"),
                contructor: KmlCatalogItem
            },
            {
                enabled: this.catalogGroup.includeGeoJson,
                regex: new RegExp(this.catalogGroup.geoJsonResourceFormat, "i"),
                contructor: GeoJsonCatalogItem
            },
            {
                enabled: this.catalogGroup.includeCsv,
                regex: new RegExp(this.catalogGroup.csvResourceFormat, "i"),
                contructor: CsvCatalogItem
            }
        ];
    }
}
CswStratum.stratumName = "CswStratum";
__decorate([
    computed
], CswStratum.prototype, "members", null);
__decorate([
    action
], CswStratum.prototype, "createMembersFromLayers", null);
__decorate([
    action
], CswStratum.prototype, "createMetadataGroup", null);
__decorate([
    action
], CswStratum.prototype, "createRecord", null);
__decorate([
    computed
], CswStratum.prototype, "resourceFormats", null);
/**
 * Recursively add MetadataGroups from keys (which are split DomainValue)
 */
function addMetadataGroups(keys, index, group, separator, queryField) {
    if (index > keys.length - 1)
        return;
    let groupIndex = group.findIndex((g) => g.groupName === keys[index]);
    if (groupIndex === -1) {
        // not found so add it
        let value;
        let regex = true;
        // if we aren't at the last key, use a regex and tack on another separator to avoid mismatches
        if (index + 1 !== keys.length) {
            const sepRegex = separator.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            value = "^" + keys.slice(0, index + 1).join(sepRegex) + sepRegex;
        }
        else {
            value = keys.slice(0, index + 1).join(separator);
            regex = false;
        }
        group.push({
            field: queryField,
            value: value,
            regex: regex,
            groupName: keys[index],
            children: [],
            records: []
        });
        groupIndex = group.length - 1;
    }
    addMetadataGroups(keys, index + 1, group[groupIndex].children, separator, queryField);
}
// find groups that the record belongs to
function findGroup(metadataGroups, record) {
    var _a;
    for (var i = 0; i < metadataGroups.length; i++) {
        const group = metadataGroups[i];
        if (group.field) {
            const fields = filterOutUndefined((_a = toArray(record[group.field])) !== null && _a !== void 0 ? _a : []);
            if (fields.find((f) => matchValue(group.value, f, group.regex))) {
                if (group.children) {
                    // recurse to see if it fits into any of the children
                    const childGroup = findGroup(group.children, record);
                    if (isDefined(childGroup)) {
                        return childGroup;
                    }
                }
                return group;
            }
        }
    }
}
function matchValue(value, recordValue, regex) {
    if (isDefined(regex) && regex) {
        // regular expression so parse it and check string against it
        var regExp = new RegExp(value);
        return regExp.test(recordValue);
    }
    else {
        return value === recordValue;
    }
}
StratumOrder.addLoadStratum(CswStratum.stratumName);
export default class CswCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(CswCatalogGroupTraits)))) {
    get type() {
        return CswCatalogGroup.type;
    }
    async forceLoadMetadata() {
        if (this.strata.get(CswStratum.stratumName) !== undefined)
            return;
        const stratum = await CswStratum.load(this);
        runInAction(() => {
            this.strata.set(CswStratum.stratumName, stratum);
        });
    }
    async forceLoadMembers() {
        const cswStratum = (this.strata.get(CswStratum.stratumName));
        if (cswStratum) {
            await runLater(() => cswStratum.createMembersFromLayers());
        }
    }
}
CswCatalogGroup.type = "csw-group";
//# sourceMappingURL=CswCatalogGroup.js.map