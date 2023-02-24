import i18next from "i18next";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import { isJsonObject, isJsonString } from "../../../Core/Json";
import loadXML from "../../../Core/loadXML";
import { networkRequestError } from "../../../Core/TerriaError";
import xml2json from "../../../ThirdParty/xml2json";
import { parseOnlineResource, parseOwsKeywordList } from "./OwsInterfaces";
export default class WebProcessingServiceCapabilities {
    constructor(capabilitiesXml, capabilities) {
        this.capabilitiesXml = capabilitiesXml;
        this.capabilities = capabilities;
    }
    static fromUrl(url) {
        return Promise.resolve(loadXML(url)).then(function (capabilitiesXml) {
            const capabilities = parseCapabilities(xml2json(capabilitiesXml));
            if (capabilities === undefined) {
                throw networkRequestError({
                    title: i18next.t("models.webProcessingServiceCatalogGroup.invalidCapabilitiesTitle"),
                    message: i18next.t("models.webProcessingServiceCatalogGroup.invalidCapabilitiesMessage", {
                        url: url
                    })
                });
            }
            return new WebProcessingServiceCapabilities(capabilitiesXml, capabilities);
        });
    }
    get ServiceIdentification() {
        return this.capabilities.ServiceIdentification;
    }
    get ServiceProvider() {
        return this.capabilities.ServiceProvider;
    }
    get ProcessOfferings() {
        return this.capabilities.ProcessOfferings;
    }
}
function parseCapabilities(json) {
    var _a;
    if (!isJsonObject(json))
        return;
    const ServiceIdentification = parseServiceIdentification(json.ServiceIdentification);
    if (ServiceIdentification === undefined)
        return;
    const ServiceProvider = parseServiceProvider(json.ServiceProvider);
    const ProcessOfferings = (_a = parseProcessOfferings(json.ProcessOfferings)) !== null && _a !== void 0 ? _a : [];
    return {
        ServiceIdentification,
        ServiceProvider,
        ProcessOfferings
    };
}
function parseServiceIdentification(json) {
    if (!isJsonObject(json))
        return;
    const ServiceType = isJsonString(json.ServiceType)
        ? json.ServiceType
        : undefined;
    const ServiceTypeVersion = isJsonString(json.ServiceTypeVersion)
        ? [json.ServiceTypeVersion]
        : Array.isArray(json.ServiceTypeVersion)
            ? filterOutUndefined(json.ServiceTypeVersion.map((s) => (isJsonString(s) ? s : undefined)))
            : undefined;
    if (ServiceType === undefined ||
        ServiceTypeVersion === undefined ||
        ServiceTypeVersion.length === 0) {
        return;
    }
    const Title = isJsonString(json.Title) ? json.Title : undefined;
    const Abstract = isJsonString(json.Abstract) ? json.Abstract : undefined;
    const Fees = isJsonString(json.Fees) ? json.Fees : undefined;
    const AccessConstraints = isJsonString(json.AccessConstraints)
        ? json.AccessConstraints
        : undefined;
    const Keywords = parseOwsKeywordList(json);
    return {
        ServiceType,
        ServiceTypeVersion,
        Title,
        Abstract,
        Fees,
        AccessConstraints,
        Keywords
    };
}
function parseServiceProvider(json) {
    if (!isJsonObject(json))
        return;
    const ProviderName = isJsonString(json.ProviderName)
        ? json.ProviderName
        : undefined;
    const ProviderSite = parseOnlineResource(json.OnlineResource);
    return {
        ProviderName,
        ProviderSite
    };
}
function parseProcessOfferings(json) {
    if (!isJsonObject(json))
        return undefined;
    const processes = Array.isArray(json.Process)
        ? json.Process
        : isJsonObject(json.Process)
            ? [json.Process]
            : [];
    const ProcessOfferings = filterOutUndefined(processes.map(parseProcess));
    return ProcessOfferings;
}
function parseProcess(json) {
    if (!isJsonObject(json))
        return;
    if (!isJsonString(json.Identifier))
        return;
    const Identifier = json.Identifier;
    const Title = isJsonString(json.Title) ? json.Title : undefined;
    const Abstract = isJsonString(json.Abstract) ? json.Abstract : undefined;
    return {
        Identifier,
        Title,
        Abstract
    };
}
//# sourceMappingURL=WebProcessingServiceCapabilities.js.map