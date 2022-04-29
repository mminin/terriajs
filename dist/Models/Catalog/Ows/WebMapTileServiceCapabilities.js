import i18next from "i18next";
import { createTransformer } from "mobx-utils";
import defined from "terriajs-cesium/Source/Core/defined";
import loadXML from "../../../Core/loadXML";
import { networkRequestError } from "../../../Core/TerriaError";
import xml2json from "../../../ThirdParty/xml2json";
export default class WebMapTileServiceCapabilities {
    constructor(xml, json) {
        var _a, _b;
        this.xml = xml;
        this.json = json;
        this.layers = [];
        this.tileMatrixSets = [];
        const layerElements = (_a = this.json.Contents) === null || _a === void 0 ? void 0 : _a.Layer;
        if (layerElements && Array.isArray(layerElements)) {
            this.layers.push(...layerElements);
        }
        else if (layerElements) {
            this.layers.push(layerElements);
        }
        const tileMatrixSetsElements = (_b = this.json.Contents) === null || _b === void 0 ? void 0 : _b.TileMatrixSet;
        if (tileMatrixSetsElements && Array.isArray(tileMatrixSetsElements)) {
            this.tileMatrixSets.push(...tileMatrixSetsElements);
        }
        else if (tileMatrixSetsElements) {
            this.tileMatrixSets.push(tileMatrixSetsElements);
        }
    }
    get ServiceIdentification() {
        return this.json.ServiceIdentification;
    }
    get OperationsMetadata() {
        return this.json.OperationsMetadata;
    }
    get ServiceProvider() {
        return this.json.ServiceProvider;
    }
    /**
     * Finds the layer in GetCapabilities corresponding to a given layer name. Names are
     * resolved as foll
     *    * The layer has the title exact with the name specified.
     *    * The layer name matches the name in the spec if the namespace portion is removed.
     *
     * @param {String} name The layer name to resolve.
     * @returns {LayerType} The resolved layer, or `undefined` if the layer name could not be resolved.
     */
    findLayer(name) {
        // Look for an exact match on the name.
        if (this.layers === undefined) {
            return undefined;
        }
        let match = this.layers.find(layer => layer.Identifier === name || layer.Title === name);
        if (!match) {
            const colonIndex = name.indexOf(":");
            if (colonIndex >= 0) {
                // This looks like a namespaced name. Such names will (usually?) show up in GetCapabilities
                // as just their name without the namespace qualifier.
                const nameWithoutNamespace = name.substring(colonIndex + 1);
                match = this.layers.find(layer => layer.Identifier === nameWithoutNamespace ||
                    layer.Title === nameWithoutNamespace);
            }
        }
        return match;
    }
    findTileMatrix(set) {
        if (this.tileMatrixSets === undefined) {
            return undefined;
        }
        return this.tileMatrixSets.find(tileMatrixSet => tileMatrixSet.Identifier === set);
    }
}
WebMapTileServiceCapabilities.fromUrl = createTransformer((url) => {
    return Promise.resolve(loadXML(url)).then(function (capabilitiesXml) {
        const json = xml2json(capabilitiesXml);
        if (!defined(json.ServiceIdentification)) {
            throw networkRequestError({
                title: i18next.t("models.webMapTileServiceCatalogGroup.invalidCapabilitiesTitle"),
                message: i18next.t("models.webMapTileServiceCatalogGroup.invalidCapabilitiesMessage", {
                    url: url
                })
            });
        }
        return new WebMapTileServiceCapabilities(capabilitiesXml, json);
    });
});
//# sourceMappingURL=WebMapTileServiceCapabilities.js.map