import { createTransformer } from "mobx-utils";
import defined from "terriajs-cesium/Source/Core/defined";
import isReadOnlyArray from "../../../Core/isReadOnlyArray";
import loadXML from "../../../Core/loadXML";
import { networkRequestError } from "../../../Core/TerriaError";
import xml2json from "../../../ThirdParty/xml2json";
export function getRectangleFromLayer(layer) {
    var egbb = layer.EX_GeographicBoundingBox; // required in WMS 1.3.0
    if (egbb) {
        return {
            west: egbb.westBoundLongitude,
            south: egbb.southBoundLatitude,
            east: egbb.eastBoundLongitude,
            north: egbb.northBoundLatitude
        };
    }
    else {
        var llbb = layer.LatLonBoundingBox; // required in WMS 1.0.0 through 1.1.1
        if (llbb) {
            return {
                west: llbb.minx,
                south: llbb.miny,
                east: llbb.maxx,
                north: llbb.maxy
            };
        }
    }
    return undefined;
}
export default class WebMapServiceCapabilities {
    constructor(xml, json) {
        this.xml = xml;
        this.json = json;
        this.allLayers = [];
        this.rootLayers = [];
        this.topLevelNamedLayers = [];
        this.layersByName = {};
        this.layersByTitle = {};
        const allLayers = this.allLayers;
        const rootLayers = this.rootLayers;
        const topLevelNamedLayers = this.topLevelNamedLayers;
        const layersByName = this
            .layersByName;
        const layersByTitle = this
            .layersByTitle;
        function traverseLayer(layer, isTopLevel = false, parent) {
            allLayers.push(layer);
            if (layer.Name) {
                layersByName[layer.Name] = layer;
                if (isTopLevel) {
                    topLevelNamedLayers.push(layer);
                    isTopLevel = false;
                }
            }
            if (layer.Title) {
                layersByTitle[layer.Title] = layer;
            }
            layer._parent = parent;
            const layers = layer.Layer;
            if (isReadOnlyArray(layers)) {
                for (let i = 0; i < layers.length; ++i) {
                    traverseLayer(layers[i], isTopLevel, layer);
                }
            }
            else if (layers !== undefined) {
                traverseLayer(layers, isTopLevel, layer);
            }
        }
        if (json.Capability && json.Capability.Layer) {
            const layerElements = json.Capability.Layer;
            if (Array.isArray(layerElements)) {
                rootLayers.push(...layerElements);
            }
            else {
                rootLayers.push(layerElements);
            }
            rootLayers.forEach(layer => traverseLayer(layer, true));
        }
    }
    get Service() {
        return this.json.Service;
    }
    /**
     * Finds the layer in GetCapabilities corresponding to a given layer name. Names are
     * resolved as follows:
     *    * The layer has the exact name specified.
     *    * The layer name matches the name in the spec if the namespace portion is removed.
     *    * The name in the spec matches the title of the layer.
     *
     * @param {String} name The layer name to resolve.
     * @returns {CapabilitiesLayer} The resolved layer, or `undefined` if the layer name could not be resolved.
     */
    findLayer(name) {
        // Look for an exact match on the name.
        let match = this.layersByName[name];
        if (!match) {
            const colonIndex = name.indexOf(":");
            if (colonIndex >= 0) {
                // This looks like a namespaced name.  Such names will (usually?) show up in GetCapabilities
                // as just their name without the namespace qualifier.
                const nameWithoutNamespace = name.substring(colonIndex + 1);
                match = this.layersByName[nameWithoutNamespace];
            }
        }
        if (!match) {
            // Try matching by title.
            match = this.layersByTitle[name];
        }
        return match;
    }
    /**
     * Gets the ancestry of a layer. The returned array has the layer itself at position 0, its parent
     * layer at position 1, and so on until the root of the layer hierarchy.
     *
     * @param layer The layer for which to obtain ancestry.
     * @returns The ancestry of the layer.
     */
    getLayerAncestry(layer) {
        const result = [];
        while (layer) {
            result.push(layer);
            layer = layer._parent;
        }
        return result;
    }
    getInheritedValues(layer, property) {
        const values = this.getLayerAncestry(layer).reduce((p, c) => {
            const value = c[property];
            if (Array.isArray(value)) {
                p.push(...value);
            }
            else if (value !== undefined) {
                p.push(value);
            }
            return p;
        }, []);
        return values;
    }
}
WebMapServiceCapabilities.fromUrl = createTransformer((url) => {
    return Promise.resolve(loadXML(url)).then(function (capabilitiesXml) {
        const json = xml2json(capabilitiesXml);
        if (!defined(json.Capability)) {
            throw networkRequestError({
                title: "Invalid GetCapabilities",
                message: `The URL ${url} was retrieved successfully but it does not appear to be a valid Web Map Service (WMS) GetCapabilities document.` +
                    `\n\nEither the catalog file has been set up incorrectly, or the server address has changed.`
            });
        }
        return new WebMapServiceCapabilities(capabilitiesXml, json);
    });
});
//# sourceMappingURL=WebMapServiceCapabilities.js.map