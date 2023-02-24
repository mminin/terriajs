var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import { createTransformer } from "mobx-utils";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import { isJsonString } from "../../../Core/Json";
import loadJson from "../../../Core/loadJson";
import ReferenceMixin from "../../../ModelMixins/ReferenceMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import CkanItemReferenceTraits from "../../../Traits/TraitsClasses/CkanItemReferenceTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import CatalogMemberFactory from "../CatalogMemberFactory";
import WebMapServiceCatalogGroup from "../Ows/WebMapServiceCatalogGroup";
import WebMapServiceCatalogItem from "../Ows/WebMapServiceCatalogItem";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import { createInheritedCkanSharedTraitsStratum } from "./CkanCatalogGroup";
import CkanDefaultFormatsStratum from "./CkanDefaultFormatsStratum";
export class CkanDatasetStratum extends LoadableStratum(CkanItemReferenceTraits) {
    constructor(ckanItemReference, ckanCatalogGroup) {
        super();
        this.ckanItemReference = ckanItemReference;
        this.ckanCatalogGroup = ckanCatalogGroup;
    }
    duplicateLoadableStratum(newModel) {
        return new CkanDatasetStratum(this.ckanItemReference, this.ckanCatalogGroup);
    }
    static async load(ckanItemReference, ckanCatalogGroup) {
        if (ckanItemReference._ckanDataset === undefined) {
            // If we've got a dataset and no defined resource
            if (ckanItemReference.datasetId !== undefined &&
                ckanItemReference.resourceId !== undefined) {
                ckanItemReference._ckanDataset = await loadCkanDataset(ckanItemReference);
                ckanItemReference._ckanResource = findResourceInDataset(ckanItemReference._ckanDataset, ckanItemReference.resourceId);
                ckanItemReference.setSupportedFormatFromResource(ckanItemReference._ckanResource);
            }
            else if (ckanItemReference.datasetId !== undefined &&
                ckanItemReference.resourceId === undefined) {
                ckanItemReference._ckanDataset = await loadCkanDataset(ckanItemReference);
                const matched = getSupportedFormats(ckanItemReference._ckanDataset, ckanItemReference.preparedSupportedFormats);
                if (matched[0] === undefined)
                    return undefined;
                ckanItemReference._ckanResource = matched[0].resource;
                ckanItemReference._supportedFormat = matched[0].format;
            }
            else if (ckanItemReference.datasetId === undefined &&
                ckanItemReference.resourceId !== undefined) {
                ckanItemReference._ckanResource = await loadCkanResource(ckanItemReference);
                ckanItemReference._supportedFormat = isResourceInSupportedFormats(ckanItemReference._ckanResource, ckanItemReference.preparedSupportedFormats);
            }
        }
        return new CkanDatasetStratum(ckanItemReference, ckanCatalogGroup);
    }
    get ckanDataset() {
        return this.ckanItemReference._ckanDataset;
    }
    get ckanResource() {
        return this.ckanItemReference._ckanResource;
    }
    get url() {
        return getCkanItemResourceUrl(this.ckanItemReference);
    }
    get name() {
        return getCkanItemName(this.ckanItemReference);
    }
    get rectangle() {
        if (this.ckanDataset === undefined)
            return undefined;
        if (this.ckanDataset.extras !== undefined) {
            const out = [];
            const bboxExtras = this.ckanDataset.extras.forEach((e) => {
                if (e.key === "bbox-west-long")
                    out[0] = parseFloat(e.value);
                if (e.key === "bbox-south-lat")
                    out[1] = parseFloat(e.value);
                if (e.key === "bbox-north-lat")
                    out[2] = parseFloat(e.value);
                if (e.key === "bbox-east-long")
                    out[3] = parseFloat(e.value);
            });
            if (out.length === 4) {
                return createStratumInstance(RectangleTraits, {
                    west: out[0],
                    south: out[1],
                    east: out[2],
                    north: out[3]
                });
            }
        }
        if (this.ckanDataset.geo_coverage !== undefined) {
            var bboxString = this.ckanDataset.geo_coverage;
            var parts = bboxString.split(",");
            if (parts.length === 4) {
                return createStratumInstance(RectangleTraits, {
                    west: parseInt(parts[0]),
                    south: parseInt(parts[1]),
                    east: parseInt(parts[2]),
                    north: parseInt(parts[3])
                });
            }
        }
        if (isDefined(this.ckanDataset.spatial) &&
            this.ckanDataset.spatial !== "") {
            var gj = JSON.parse(this.ckanDataset.spatial);
            if (gj.type === "Polygon" && gj.coordinates[0].length === 5) {
                return createStratumInstance(RectangleTraits, {
                    west: gj.coordinates[0][0][0],
                    south: gj.coordinates[0][0][1],
                    east: gj.coordinates[0][2][0],
                    north: gj.coordinates[0][2][1]
                });
            }
        }
        return undefined;
    }
    get info() {
        function prettifyDate(date) {
            if (date.match(/^\d\d\d\d-\d\d-\d\d.*/)) {
                return date.substr(0, 10);
            }
            else
                return date;
        }
        const outArray = [];
        if (this.ckanDataset === undefined)
            return outArray;
        if (this.ckanDataset.license_url !== undefined) {
            outArray.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.ckan.licence"),
                content: `[${this.ckanDataset.license_title || this.ckanDataset.license_url}](${this.ckanDataset.license_url})`
            }));
        }
        else if (this.ckanDataset.license_title !== undefined) {
            outArray.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.ckan.licence"),
                content: this.ckanDataset.license_title
            }));
        }
        outArray.push(createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.ckan.contact_point"),
            content: this.ckanDataset.contact_point
        }), createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.ckan.datasetDescription"),
            content: this.ckanDataset.notes
        }), createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.ckan.author"),
            content: this.ckanDataset.author
        }));
        if (this.ckanDataset.organization) {
            outArray.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.ckan.datasetCustodian"),
                content: this.ckanDataset.organization.description ||
                    this.ckanDataset.organization.title
            }));
        }
        outArray.push(createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.ckan.metadata_created"),
            content: prettifyDate(this.ckanDataset.metadata_created)
        }), createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.ckan.metadata_modified"),
            content: prettifyDate(this.ckanDataset.metadata_modified)
        }), createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.ckan.update_freq"),
            content: this.ckanDataset.update_freq
        }));
        return outArray;
    }
    /** Set isGroup = true if this turns into WMS Group (See CkanItemReference.forceLoadReference for more info) */
    get isGroup() {
        var _a, _b;
        if (((_b = (_a = this.ckanItemReference._supportedFormat) === null || _a === void 0 ? void 0 : _a.definition) === null || _b === void 0 ? void 0 : _b.type) ===
            WebMapServiceCatalogItem.type &&
            !this.ckanItemReference.wmsLayers)
            return true;
    }
}
CkanDatasetStratum.stratumName = "ckanDataset";
__decorate([
    computed
], CkanDatasetStratum.prototype, "ckanDataset", null);
__decorate([
    computed
], CkanDatasetStratum.prototype, "ckanResource", null);
__decorate([
    computed
], CkanDatasetStratum.prototype, "url", null);
__decorate([
    computed
], CkanDatasetStratum.prototype, "name", null);
__decorate([
    computed
], CkanDatasetStratum.prototype, "rectangle", null);
__decorate([
    computed
], CkanDatasetStratum.prototype, "info", null);
__decorate([
    computed
], CkanDatasetStratum.prototype, "isGroup", null);
StratumOrder.addLoadStratum(CkanDatasetStratum.stratumName);
export default class CkanItemReference extends UrlMixin(ReferenceMixin(CreateModel(CkanItemReferenceTraits))) {
    constructor(id, terria, sourceReference, strata) {
        super(id, terria, sourceReference, strata);
        this._ckanDataset = undefined;
        this._ckanResource = undefined;
        this._ckanCatalogGroup = undefined;
        this._supportedFormat = undefined;
        this.strata.set(CkanDefaultFormatsStratum.stratumName, new CkanDefaultFormatsStratum());
    }
    get type() {
        return CkanItemReference.type;
    }
    get typeName() {
        return i18next.t("models.ckan.name");
    }
    get preparedSupportedFormats() {
        return this.supportedResourceFormats
            ? this.supportedResourceFormats.map(prepareSupportedFormat)
            : [];
    }
    setDataset(ckanDataset) {
        this._ckanDataset = ckanDataset;
    }
    setResource(ckanResource) {
        this._ckanResource = ckanResource;
    }
    setCkanCatalog(ckanCatalogGroup) {
        this._ckanCatalogGroup = ckanCatalogGroup;
    }
    setSupportedFormat(format) {
        this._supportedFormat = format;
    }
    setSupportedFormatFromResource(resource) {
        this._supportedFormat = isResourceInSupportedFormats(resource, this.preparedSupportedFormats);
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    // We will first attach this to the CkanItemReference
    // and then we'll attach it to the target model
    // I wonder if it needs to be on both?
    async setCkanStrata(model) {
        const stratum = await CkanDatasetStratum.load(this, this._ckanCatalogGroup);
        if (stratum === undefined)
            return;
        runInAction(() => {
            model.strata.set(CkanDatasetStratum.stratumName, stratum);
        });
    }
    setSharedStratum(inheritedPropertiesStratum) {
        // The values in this stratum should not be updated as the same object is used
        //  in all CkanItemReferences
        this.strata.set(createInheritedCkanSharedTraitsStratum.stratumName, inheritedPropertiesStratum);
    }
    async forceLoadReference(previousTarget) {
        var _a;
        await this.setCkanStrata(this);
        if (this._supportedFormat === undefined)
            return undefined;
        const type = ((_a = this._supportedFormat.definition) !== null && _a !== void 0 ? _a : {}).type;
        if (typeof type !== "string")
            return undefined;
        let model;
        // Special case for WMS
        // Check for `layers` before creating model
        // If WMS layers have been found - create WebMapServiceCatalogItem
        // If no WMS layers are found - create WebMapServiceCatalogGroup
        if (type === WebMapServiceCatalogItem.type) {
            // If WMS layers have been found
            if (this.wmsLayers) {
                model = new WebMapServiceCatalogItem(this.uniqueId, this.terria, this);
                model.setTrait(CommonStrata.definition, "layers", decodeURI(this.wmsLayers));
            }
            // if no WMS layers are found
            else {
                model = new WebMapServiceCatalogGroup(this.uniqueId, this.terria, this);
            }
        }
        else {
            model = CatalogMemberFactory.create(type, this.uniqueId, this.terria, this);
        }
        if (model === undefined)
            return;
        previousTarget = model;
        await this.setCkanStrata(model);
        model.setTrait(CommonStrata.definition, "name", this.name);
        return model;
    }
    get wmsLayers() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const params = (_a = new URI(getCkanItemResourceUrl(this))) === null || _a === void 0 ? void 0 : _a.search(true);
        const layersFromItemProperties = (_j = (_e = (_d = (_c = (_b = this.itemPropertiesByIds) === null || _b === void 0 ? void 0 : _b.find((itemProps) => this.uniqueId && itemProps.ids.includes(this.uniqueId))) === null || _c === void 0 ? void 0 : _c.itemProperties) === null || _d === void 0 ? void 0 : _d.layers) !== null && _e !== void 0 ? _e : (_h = (_g = (_f = this.itemPropertiesByType) === null || _f === void 0 ? void 0 : _f.find((itemProps) => itemProps.type === WebMapServiceCatalogItem.type)) === null || _g === void 0 ? void 0 : _g.itemProperties) === null || _h === void 0 ? void 0 : _h.layers) !== null && _j !== void 0 ? _j : (_k = this.itemProperties) === null || _k === void 0 ? void 0 : _k.layers;
        // Mixing ?? and || because for params we don't want to use empty string params if there are non-empty string parameters
        const rawLayers = (_o = (_l = (isJsonString(layersFromItemProperties)
            ? layersFromItemProperties
            : undefined)) !== null && _l !== void 0 ? _l : (_m = this._ckanResource) === null || _m === void 0 ? void 0 : _m.wms_layer) !== null && _o !== void 0 ? _o : ((params === null || params === void 0 ? void 0 : params.LAYERS) || (params === null || params === void 0 ? void 0 : params.layers) || (params === null || params === void 0 ? void 0 : params.typeName));
        // Improve the robustness.
        const cleanLayers = rawLayers === null || rawLayers === void 0 ? void 0 : rawLayers.split(",").map((layer) => layer.trim()).join(",");
        return cleanLayers;
    }
}
CkanItemReference.type = "ckan-item";
__decorate([
    computed
], CkanItemReference.prototype, "preparedSupportedFormats", null);
__decorate([
    computed
], CkanItemReference.prototype, "cacheDuration", null);
__decorate([
    action
], CkanItemReference.prototype, "setSharedStratum", null);
__decorate([
    computed
], CkanItemReference.prototype, "wmsLayers", null);
async function loadCkanDataset(ckanItem) {
    var uri = new URI(ckanItem.url)
        .segment("api/3/action/package_show")
        .addQuery({ id: ckanItem.datasetId });
    const response = await loadJson(proxyCatalogItemUrl(ckanItem, uri.toString()));
    if (response.result)
        return response.result;
    return undefined;
}
async function loadCkanResource(ckanItem) {
    var uri = new URI(ckanItem.url)
        .segment("api/3/action/resource_show")
        .addQuery({ id: ckanItem.resourceId });
    const response = await loadJson(proxyCatalogItemUrl(ckanItem, uri.toString()));
    if (response.result)
        return response.result;
    return undefined;
}
function findResourceInDataset(ckanDataset, resourceId) {
    if (ckanDataset === undefined)
        return undefined;
    for (let i = 0; i < ckanDataset.resources.length; ++i) {
        if (ckanDataset.resources[i].id === resourceId) {
            return ckanDataset.resources[i];
        }
    }
    return undefined;
}
export const prepareSupportedFormat = createTransformer((format) => {
    return {
        id: format.id,
        definition: format.definition,
        maxFileSize: format.maxFileSize,
        removeDuplicates: format.removeDuplicates,
        onlyUseIfSoleResource: format.onlyUseIfSoleResource,
        formatRegex: format.formatRegex,
        urlRegex: format.urlRegex,
        formatRegexParsed: format.formatRegex
            ? new RegExp(format.formatRegex, "i")
            : undefined,
        urlRegexParsed: format.urlRegex
            ? new RegExp(format.urlRegex, "i")
            : undefined
    };
});
export function getSupportedFormats(dataset, formats) {
    if (!dataset)
        return [];
    const supported = [];
    for (let i = 0; i < formats.length; ++i) {
        const format = formats[i];
        for (let j = 0; j < dataset.resources.length; ++j) {
            const resource = dataset.resources[j];
            if (resourceIsSupported(resource, format)) {
                supported.push({ resource: resource, format: format });
            }
        }
    }
    return supported;
}
export function isResourceInSupportedFormats(resource, formats) {
    if (resource === undefined)
        return undefined;
    let matches = [];
    for (let i = 0; i < formats.length; ++i) {
        const format = formats[i];
        if (resourceIsSupported(resource, format))
            return format;
    }
    return undefined;
}
export function resourceIsSupported(resource, format) {
    let match = false;
    // Does format match (formatRegex is required)
    if (!isDefined(format.formatRegexParsed))
        return false;
    if (format.formatRegexParsed.test(resource.format)) {
        match = true;
    }
    // Does URL match (urlRegex is optional)
    if (match &&
        isDefined(format.urlRegexParsed) &&
        !format.urlRegexParsed.test(resource.url)) {
        match = false;
    }
    // Is resource.size (in bytes) greater than maxFileSize? (maxFileSize is optional)
    if (match &&
        isDefined(format.maxFileSize) &&
        format.maxFileSize !== null &&
        isDefined(resource.size) &&
        resource.size !== null &&
        resource.size / (1024 * 1024) > format.maxFileSize) {
        match = false;
    }
    return match;
}
export function getCkanItemName(item) {
    if (!item._ckanResource)
        return;
    if (item.useResourceName)
        return item._ckanResource.name;
    // via @steve9164
    /** Switched the order [check `useCombinationNameWhereMultipleResources`
     * first ] that these are checked so the default is checked last. Otherwise
     * setting useCombinationNameWhereMultipleResources without setting
     * useDatasetNameAndFormatWhereMultipleResources to false doesn't do
     * anything */
    if (item._ckanDataset) {
        if (item.useCombinationNameWhereMultipleResources &&
            item._ckanDataset.resources.length > 1) {
            return item._ckanDataset.title + " - " + item._ckanResource.name;
        }
        if (item.useDatasetNameAndFormatWhereMultipleResources &&
            item._ckanDataset.resources.length > 1) {
            return item._ckanDataset.title + " - " + item._ckanResource.format;
        }
        return item._ckanDataset.title;
    }
    return item._ckanResource.name;
}
function getCkanItemResourceUrl(item) {
    var _a;
    if (item._ckanResource === undefined)
        return undefined;
    if (item._supportedFormat !== undefined) {
        if (((_a = item._supportedFormat.definition) !== null && _a !== void 0 ? _a : {}).type === "wms" &&
            item._ckanResource.wms_api_url) {
            return item._ckanResource.wms_api_url;
        }
    }
    return item._ckanResource.url;
}
//# sourceMappingURL=CkanItemReference.js.map