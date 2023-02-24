import { createTransformer } from "mobx-utils";
import defined from "terriajs-cesium/Source/Core/defined";
import isDefined from "../../../Core/isDefined";
import loadXML from "../../../Core/loadXML";
import TerriaError from "../../../Core/TerriaError";
import xml2json from "../../../ThirdParty/xml2json";
import { isJsonString } from "../../../Core/Json";
export function getRectangleFromLayer(layer) {
    var bbox = layer.WGS84BoundingBox;
    if (bbox) {
        return {
            west: bbox.westBoundLongitude,
            south: bbox.southBoundLatitude,
            east: bbox.eastBoundLongitude,
            north: bbox.northBoundLatitude
        };
    }
    return undefined;
}
/**
 * Get CapabilitiesService (in WMS form)
 */
function getService(json) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const serviceProviderJson = json["ServiceProvider"];
    const serviceIdentificationJson = json["ServiceIdentification"];
    const serviceAddressJson = (_b = (_a = serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ServiceContact"]) === null || _a === void 0 ? void 0 : _a["ContactInfo"]) === null || _b === void 0 ? void 0 : _b["Address"];
    const service = {
        Title: serviceIdentificationJson === null || serviceIdentificationJson === void 0 ? void 0 : serviceIdentificationJson["Title"],
        Abstract: serviceIdentificationJson === null || serviceIdentificationJson === void 0 ? void 0 : serviceIdentificationJson["Abstract"],
        Fees: serviceIdentificationJson === null || serviceIdentificationJson === void 0 ? void 0 : serviceIdentificationJson["Fees"],
        AccessConstraints: serviceIdentificationJson === null || serviceIdentificationJson === void 0 ? void 0 : serviceIdentificationJson["AccessConstraints"],
        KeywordList: {
            Keyword: (_c = serviceIdentificationJson === null || serviceIdentificationJson === void 0 ? void 0 : serviceIdentificationJson["Keywords"]) === null || _c === void 0 ? void 0 : _c["Keyword"]
        },
        ContactInformation: {
            ContactPersonPrimary: {
                ContactPerson: (_d = serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ServiceContact"]) === null || _d === void 0 ? void 0 : _d["IndividualName"],
                ContactOrganization: serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ProviderName"]
            },
            ContactPosition: (_e = serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ServiceContact"]) === null || _e === void 0 ? void 0 : _e["PositionName"],
            ContactAddress: {
                Address: serviceAddressJson === null || serviceAddressJson === void 0 ? void 0 : serviceAddressJson["DeliveryPoint"],
                City: serviceAddressJson === null || serviceAddressJson === void 0 ? void 0 : serviceAddressJson["City"],
                StateOrProvince: serviceAddressJson === null || serviceAddressJson === void 0 ? void 0 : serviceAddressJson["AdministrativeArea"],
                PostCode: serviceAddressJson === null || serviceAddressJson === void 0 ? void 0 : serviceAddressJson["PostalCode"],
                Country: serviceAddressJson === null || serviceAddressJson === void 0 ? void 0 : serviceAddressJson["Country"]
            },
            ContactVoiceTelephone: (_h = (_g = (_f = serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ServiceContact"]) === null || _f === void 0 ? void 0 : _f["ContactInfo"]) === null || _g === void 0 ? void 0 : _g["Phone"]) === null || _h === void 0 ? void 0 : _h["Voice"],
            ContactFacsimileTelephone: (_l = (_k = (_j = serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ServiceContact"]) === null || _j === void 0 ? void 0 : _j["ContactInfo"]) === null || _k === void 0 ? void 0 : _k["Phone"]) === null || _l === void 0 ? void 0 : _l["Facsimile"],
            ContactElectronicMailAddress: (_p = (_o = (_m = serviceProviderJson === null || serviceProviderJson === void 0 ? void 0 : serviceProviderJson["ServiceContact"]) === null || _m === void 0 ? void 0 : _m["ContactInfo"]) === null || _o === void 0 ? void 0 : _o["Address"]) === null || _p === void 0 ? void 0 : _p["ElectronicMailAddress"]
        }
    };
    return service;
}
function getFeatureTypes(json) {
    var _a;
    let featureTypesJson = (_a = json.FeatureTypeList) === null || _a === void 0 ? void 0 : _a.FeatureType;
    if (!isDefined(featureTypesJson)) {
        return [];
    }
    if (!Array.isArray(featureTypesJson)) {
        featureTypesJson = [featureTypesJson];
    }
    return (featureTypesJson.map((json) => {
        var _a, _b, _c;
        const lowerCorner = (_a = json["WGS84BoundingBox"]) === null || _a === void 0 ? void 0 : _a["LowerCorner"].split(" ");
        const upperCorner = (_b = json["WGS84BoundingBox"]) === null || _b === void 0 ? void 0 : _b["UpperCorner"].split(" ");
        let outputFormats;
        if (isDefined(json.OutputFormats)) {
            outputFormats = Array.isArray(json.OutputFormats)
                ? json.OutputFormats.map((o) => o.Format)
                : [json.OutputFormats.Format];
        }
        return {
            Title: json.Title,
            Name: json.Name,
            Abstract: json.Abstract,
            Keyword: (_c = json["Keywords"]) === null || _c === void 0 ? void 0 : _c["Keyword"],
            WGS84BoundingBox: {
                westBoundLongitude: lowerCorner && parseFloat(lowerCorner[0]),
                southBoundLatitude: lowerCorner && parseFloat(lowerCorner[1]),
                eastBoundLongitude: upperCorner && parseFloat(upperCorner[0]),
                northBoundLatitude: upperCorner && parseFloat(upperCorner[1])
            },
            OutputFormats: outputFormats
        };
    }) || []);
}
function getOutputTypes(json) {
    var _a, _b, _c, _d, _e;
    let outputTypes = (_e = (_d = (_c = (_b = (_a = json.OperationsMetadata) === null || _a === void 0 ? void 0 : _a.Operation) === null || _b === void 0 ? void 0 : _b.find((op) => op.name === "GetFeature")) === null || _c === void 0 ? void 0 : _c.Parameter) === null || _d === void 0 ? void 0 : _d.find((p) => p.name === "outputFormat")) === null || _e === void 0 ? void 0 : _e.Value;
    if (!isDefined(outputTypes)) {
        return;
    }
    return Array.isArray(outputTypes) ? outputTypes : [outputTypes];
}
/**
 * Get the coordinate systems (srsName) supported by the WFS service for each layer.
 * @param json
 * returns an object with an array of srsNames for each layer. The first element is the defaultSRS as specified by the WFS service.
 * TODO: For catalog items that specify which layer we are interested in, why build the array describing the srsNames for all the other layers too?
 */
function getSrsNames(json) {
    var _a, _b;
    let layers = (_a = json.FeatureTypeList) === null || _a === void 0 ? void 0 : _a.FeatureType;
    let srsNamesByLayer = [];
    if (Array.isArray(layers)) {
        srsNamesByLayer = layers.map(buildSrsNameObject);
    }
    else {
        srsNamesByLayer.push(buildSrsNameObject((_b = json.FeatureTypeList) === null || _b === void 0 ? void 0 : _b.FeatureType));
    }
    return srsNamesByLayer;
}
/**
 * Helper function to build individual objects describing the allowable srsNames for each layer in the WFS
 * @param layer
 */
function buildSrsNameObject(layer) {
    let srsNames = [];
    if (isJsonString(layer.DefaultSRS))
        srsNames.push(layer.DefaultSRS);
    if (Array.isArray(layer.OtherSRS))
        layer.OtherSRS.forEach((item) => {
            if (isJsonString(item))
                srsNames.push(item);
        });
    else if (isJsonString(layer.OtherSRS))
        srsNames.push(layer.OtherSRS);
    return { layerName: layer.Name, srsArray: srsNames };
}
export default class WebFeatureServiceCapabilities {
    constructor(xml, json) {
        this.service = getService(json);
        this.outputTypes = getOutputTypes(json);
        this.featureTypes = getFeatureTypes(json);
        this.srsNames = getSrsNames(json);
    }
    /**
     * Finds the layer in GetCapabilities corresponding to a given layer name. Names are
     * resolved as foll
     *    * The layer has the exact name specified.
     *    * The layer name matches the name in the spec if the namespace portion is removed.
     *    * The name in the spec matches the title of the layer.
     *
     * @param {String} name The layer name to resolve.
     * @returns {CapabilitiesLayer} The resolved layer, or `undefined` if the layer name could not be resolved.
     */
    findLayer(name) {
        // Look for an exact match on the name.
        let match = this.featureTypes.find((ft) => ft.Name === name);
        if (!match) {
            const colonIndex = name.indexOf(":");
            if (colonIndex >= 0) {
                // This looks like a namespaced name.  Such names will (usually?) show up in GetCapabilities
                // as just their name without the namespace qualifier.
                const nameWithoutNamespace = name.substring(colonIndex + 1);
                match = this.featureTypes.find((ft) => ft.Name === nameWithoutNamespace);
            }
        }
        if (!match) {
            // Try matching by title.
            match = this.featureTypes.find((ft) => ft.Title === name);
        }
        return match;
    }
}
WebFeatureServiceCapabilities.fromUrl = createTransformer((url) => {
    return loadXML(url).then(function (capabilitiesXml) {
        const json = xml2json(capabilitiesXml);
        if (!defined(json.ServiceIdentification)) {
            throw new TerriaError({
                title: "Invalid GetCapabilities",
                message: `The URL ${url} was retrieved successfully but it does not appear to be a valid Web Feature Service (WFS) GetCapabilities document.` +
                    `\n\nEither the catalog file has been set up incorrectly, or the server address has changed.`
            });
        }
        return new WebFeatureServiceCapabilities(capabilitiesXml, json);
    });
});
//# sourceMappingURL=WebFeatureServiceCapabilities.js.map