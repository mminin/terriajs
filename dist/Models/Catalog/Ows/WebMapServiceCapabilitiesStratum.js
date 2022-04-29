var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import URI from "urijs";
import containsAny from "../../../Core/containsAny";
import createDiscreteTimesFromIsoSegments from "../../../Core/createDiscreteTimes";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import isReadOnlyArray from "../../../Core/isReadOnlyArray";
import TerriaError from "../../../Core/TerriaError";
import { terriaTheme } from "../../../ReactViews/StandardUserInterface/StandardTheme";
import { InfoSectionTraits, MetadataUrlTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import { KeyValueTraits, WebCoverageServiceParameterTraits } from "../../../Traits/TraitsClasses/ExportWebCoverageServiceTraits";
import LegendTraits from "../../../Traits/TraitsClasses/LegendTraits";
import WebMapServiceCatalogItemTraits, { SUPPORTED_CRS_3857, SUPPORTED_CRS_4326 } from "../../../Traits/TraitsClasses/WebMapServiceCatalogItemTraits";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import WebMapServiceCapabilities, { getRectangleFromLayer } from "./WebMapServiceCapabilities";
import WebMapServiceCatalogItem from "./WebMapServiceCatalogItem";
const dateFormat = require("dateformat");
/** Transforms WMS GetCapabilities XML into WebMapServiceCatalogItemTraits */
export default class WebMapServiceCapabilitiesStratum extends LoadableStratum(WebMapServiceCatalogItemTraits) {
    constructor(catalogItem, capabilities) {
        super();
        this.catalogItem = catalogItem;
        this.capabilities = capabilities;
    }
    static async load(catalogItem, capabilities) {
        if (!isDefined(catalogItem.getCapabilitiesUrl)) {
            throw new TerriaError({
                title: i18next.t("models.webMapServiceCatalogItem.missingUrlTitle"),
                message: i18next.t("models.webMapServiceCatalogItem.missingUrlMessage")
            });
        }
        if (!isDefined(capabilities))
            capabilities = await WebMapServiceCapabilities.fromUrl(proxyCatalogItemUrl(catalogItem, catalogItem.getCapabilitiesUrl, catalogItem.getCapabilitiesCacheDuration));
        return new WebMapServiceCapabilitiesStratum(catalogItem, capabilities);
    }
    duplicateLoadableStratum(model) {
        return new WebMapServiceCapabilitiesStratum(model, this.capabilities);
    }
    get metadataUrls() {
        const metadataUrls = [];
        Array.from(this.capabilitiesLayers.values()).forEach(layer => {
            if (!(layer === null || layer === void 0 ? void 0 : layer.MetadataURL))
                return;
            Array.isArray(layer === null || layer === void 0 ? void 0 : layer.MetadataURL)
                ? metadataUrls.push(...layer === null || layer === void 0 ? void 0 : layer.MetadataURL)
                : metadataUrls.push(layer === null || layer === void 0 ? void 0 : layer.MetadataURL);
        });
        return metadataUrls
            .filter(m => { var _a; return (_a = m.OnlineResource) === null || _a === void 0 ? void 0 : _a["xlink:href"]; })
            .map(m => createStratumInstance(MetadataUrlTraits, {
            url: m.OnlineResource["xlink:href"]
        }));
    }
    get layers() {
        let layers;
        if (this.catalogItem.uri !== undefined) {
            // Try to extract a layer from the URL
            const query = this.catalogItem.uri.query(true);
            layers = query.layers;
        }
        if (layers === undefined) {
            // Use all the top-level, named layers
            layers = filterOutUndefined(this.capabilities.topLevelNamedLayers.map(layer => layer.Name)).join(",");
        }
        return layers;
    }
    /**
   * **How we determine WMS legends (in order)**
    1. Defined manually in catalog JSON
    2. If `style` is undefined, and server doesn't support `GetLegendGraphic`, we must select first style as default - as there is no way to know what the default style is, and to request a legend for it
    3. If `style` is is set and it has a `legendUrl` -> use it!
    4. If server supports `GetLegendGraphic`, we can request a legend (with or without `style` parameter)
   */
    get legends() {
        var _a, _b, _c;
        const availableStyles = this.catalogItem.availableStyles || [];
        const layers = this.catalogItem.layersArray;
        const styles = this.catalogItem.stylesArray;
        const result = [];
        for (let i = 0; i < layers.length; ++i) {
            const layer = layers[i];
            const style = i < styles.length ? styles[i] : undefined;
            let legendUri;
            let legendUrlMimeType;
            let legendScaling;
            const layerAvailableStyles = (_a = availableStyles.find(candidate => candidate.layerName === layer)) === null || _a === void 0 ? void 0 : _a.styles;
            let layerStyle;
            if (isDefined(style)) {
                // Attempt to find layer style based on AvailableStyleTraits
                layerStyle = layerAvailableStyles === null || layerAvailableStyles === void 0 ? void 0 : layerAvailableStyles.find(candidate => candidate.name === style);
            }
            // If no style is selected and this WMS doesn't support GetLegendGraphics - we must use the first style if none is explicitly specified.
            // (If WMS supports GetLegendGraphics we can use it and omit style parameter to get the "default" style's legend)
            if (!isDefined(layerStyle) && !this.catalogItem.supportsGetLegendGraphic)
                layerStyle = layerAvailableStyles === null || layerAvailableStyles === void 0 ? void 0 : layerAvailableStyles[0];
            // If legend found - proxy URL and set mimetype
            if ((_b = layerStyle === null || layerStyle === void 0 ? void 0 : layerStyle.legend) === null || _b === void 0 ? void 0 : _b.url) {
                legendUri = URI(proxyCatalogItemUrl(this.catalogItem, layerStyle.legend.url));
                legendUrlMimeType = layerStyle.legend.urlMimeType;
            }
            // If no legends found and WMS supports GetLegendGraphics - make one up!
            if (!isDefined(legendUri) &&
                isDefined(this.catalogItem.url) &&
                this.catalogItem.supportsGetLegendGraphic) {
                legendUri = URI(proxyCatalogItemUrl(this.catalogItem, this.catalogItem.url.split("?")[0]));
                legendUri
                    .setQuery("service", "WMS")
                    .setQuery("version", "1.3.0")
                    .setQuery("request", "GetLegendGraphic")
                    .setQuery("format", "image/png")
                    .setQuery("layer", layer);
                // From OGC — about style property for GetLegendGraphic request:
                // If not present, the default style is selected. The style may be any valid style available for a layer, including non-SLD internally-defined styles.
                if (style) {
                    legendUri.setQuery("style", style);
                }
                legendUrlMimeType = "image/png";
            }
            if (isDefined(legendUri)) {
                // Add geoserver related LEGEND_OPTIONS to match terria styling (if supported)
                if (this.catalogItem.isGeoServer &&
                    legendUri.hasQuery("request", "GetLegendGraphic")) {
                    let legendOptions = "fontName:Courier;fontStyle:bold;fontSize:12;forceLabels:on;fontAntiAliasing:true;labelMargin:5";
                    // Geoserver fontColor must be a hex value - use `textLight` theme colour
                    let fontColor = (_c = terriaTheme.textLight.split("#")) === null || _c === void 0 ? void 0 : _c[1];
                    if (isDefined(fontColor)) {
                        // If fontColor is a 3-character hex -> turn into 6
                        if (fontColor.length === 3) {
                            fontColor = `${fontColor[0]}${fontColor[0]}${fontColor[1]}${fontColor[1]}${fontColor[2]}${fontColor[2]}`;
                        }
                        legendOptions += `;fontColor:0x${fontColor}`;
                    }
                    legendOptions += ";dpi:182"; // enable if we can scale the image back down by 50%.
                    legendScaling = 0.5;
                    legendUri.setQuery("LEGEND_OPTIONS", legendOptions);
                    legendUri.setQuery("transparent", "true");
                }
                // Add colour scale range params if supported
                if (this.catalogItem.supportsColorScaleRange &&
                    this.catalogItem.colorScaleRange) {
                    legendUri.setQuery("colorscalerange", this.catalogItem.colorScaleRange);
                }
                result.push(createStratumInstance(LegendTraits, {
                    url: legendUri.toString(),
                    urlMimeType: legendUrlMimeType,
                    imageScaling: legendScaling
                }));
            }
        }
        return result;
    }
    get capabilitiesLayers() {
        const lookup = name => [
            name,
            this.capabilities && this.capabilities.findLayer(name)
        ];
        return new Map(this.catalogItem.layersArray.map(lookup));
    }
    get availableCrs() {
        // Get set of supported CRS from layer hierarchy
        const layerCrs = new Set();
        this.capabilitiesLayers.forEach(layer => {
            if (layer) {
                const srs = this.capabilities.getInheritedValues(layer, "SRS");
                const crs = this.capabilities.getInheritedValues(layer, "CRS");
                [
                    ...(Array.isArray(srs) ? srs : [srs]),
                    ...(Array.isArray(crs) ? crs : [crs])
                ].forEach(c => layerCrs.add(c));
            }
        });
        return Array.from(layerCrs);
    }
    get crs() {
        var _a;
        // Note order is important here, the first one found will be used
        const supportedCrs = [...SUPPORTED_CRS_3857, ...SUPPORTED_CRS_4326];
        // If nothing is supported, ask for EPSG:3857, and hope for the best.
        return ((_a = supportedCrs.find(crs => this.availableCrs.includes(crs))) !== null && _a !== void 0 ? _a : "EPSG:3857");
    }
    get availableDimensions() {
        const result = [];
        if (!this.capabilities) {
            return result;
        }
        const capabilitiesLayers = this.capabilitiesLayers;
        for (const layerTuple of capabilitiesLayers) {
            const layerName = layerTuple[0];
            const layer = layerTuple[1];
            const dimensions = layer
                ? this.capabilities.getInheritedValues(layer, "Dimension")
                : [];
            result.push({
                layerName: layerName,
                dimensions: dimensions
                    .filter(dim => dim.name !== "time")
                    .map(dim => {
                    var _a;
                    return {
                        name: dim.name,
                        units: dim.units,
                        unitSymbol: dim.unitSymbol,
                        default: dim.default,
                        multipleValues: dim.multipleValues,
                        current: dim.current,
                        nearestValue: dim.nearestValue,
                        values: (_a = dim.text) === null || _a === void 0 ? void 0 : _a.split(",")
                    };
                })
            });
        }
        return result;
    }
    get availableStyles() {
        const result = [];
        if (!this.capabilities) {
            return result;
        }
        const capabilitiesLayers = this.capabilitiesLayers;
        for (const layerTuple of capabilitiesLayers) {
            const layerName = layerTuple[0];
            const layer = layerTuple[1];
            const styles = layer
                ? this.capabilities.getInheritedValues(layer, "Style")
                : [];
            result.push({
                layerName: layerName,
                styles: styles.map(style => {
                    var wmsLegendUrl = isReadOnlyArray(style.LegendURL)
                        ? style.LegendURL[0]
                        : style.LegendURL;
                    var legendUri, legendMimeType;
                    if (wmsLegendUrl &&
                        wmsLegendUrl.OnlineResource &&
                        wmsLegendUrl.OnlineResource["xlink:href"]) {
                        legendUri = new URI(decodeURIComponent(wmsLegendUrl.OnlineResource["xlink:href"]));
                        legendMimeType = wmsLegendUrl.Format;
                    }
                    const legend = !legendUri
                        ? undefined
                        : createStratumInstance(LegendTraits, {
                            url: legendUri.toString(),
                            urlMimeType: legendMimeType,
                            title: (capabilitiesLayers.size > 1 && (layer === null || layer === void 0 ? void 0 : layer.Title)) || undefined // Add layer Title as legend title if showing multiple layers
                        });
                    return {
                        name: style.Name,
                        title: style.Title,
                        abstract: style.Abstract,
                        legend: legend
                    };
                })
            });
        }
        return result;
    }
    /** There is no way of finding out default style if no style has been selected :(
     * If !supportsGetLegendGraphic - we have to just use the first available style (for each layer)
     * This is because, to request a "default" legend we need GetLegendGraphics
     **/
    get styles() {
        if (!this.catalogItem.supportsGetLegendGraphic) {
            return this.catalogItem.availableStyles
                .map(layer => {
                var _a;
                if (layer.layerName && layer.styles.length > 0) {
                    return (_a = layer.styles[0].name) !== null && _a !== void 0 ? _a : "";
                }
                return "";
            })
                .join(",");
        }
    }
    get info() {
        const result = [];
        let firstDataDescription;
        result.push(createStratumInstance(InfoSectionTraits, {
            name: i18next.t("models.webMapServiceCatalogItem.serviceDescription"),
            contentAsObject: this.capabilities.Service,
            // Hide big ugly table by default
            show: false
        }));
        const onlyHasSingleLayer = this.catalogItem.layersArray.length === 1;
        if (onlyHasSingleLayer) {
            // Clone the capabilitiesLayer as we'll modify it in a second
            const out = Object.assign({}, this.capabilitiesLayers.get(this.catalogItem.layersArray[0]));
            if (out !== undefined) {
                // The Dimension object is really weird and has a bunch of stray text in there
                if ("Dimension" in out) {
                    const goodDimension = {};
                    Object.keys(out.Dimension).forEach((k) => {
                        if (isNaN(k)) {
                            goodDimension[k] = out.Dimension[k];
                        }
                    });
                    out.Dimension = goodDimension;
                }
                // remove a circular reference to the parent
                delete out._parent;
                try {
                    result.push(createStratumInstance(InfoSectionTraits, {
                        name: i18next.t("models.webMapServiceCatalogItem.dataDescription"),
                        contentAsObject: out,
                        // Hide big ugly table by default
                        show: false
                    }));
                }
                catch (e) {
                    console.log(`FAILED to create InfoSection with WMS layer Capabilities`);
                    console.log(e);
                }
            }
        }
        for (const layer of this.capabilitiesLayers.values()) {
            if (!layer ||
                !layer.Abstract ||
                containsAny(layer.Abstract, WebMapServiceCatalogItem.abstractsToIgnore)) {
                continue;
            }
            const suffix = this.capabilitiesLayers.size === 1 ? "" : ` - ${layer.Title}`;
            const name = `Web Map Service Layer Description${suffix}`;
            result.push(createStratumInstance(InfoSectionTraits, {
                name,
                content: layer.Abstract
            }));
            firstDataDescription = firstDataDescription || layer.Abstract;
        }
        // Show the service abstract if there is one and if it isn't the Geoserver default "A compliant implementation..."
        const service = this.capabilities && this.capabilities.Service;
        if (service) {
            if (service.ContactInformation !== undefined) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webMapServiceCatalogItem.serviceContact"),
                    content: getServiceContactInformation(service.ContactInformation)
                }));
            }
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapServiceCatalogItem.getCapabilitiesUrl"),
                content: this.catalogItem.getCapabilitiesUrl
            }));
            if (service &&
                service.Abstract &&
                !containsAny(service.Abstract, WebMapServiceCatalogItem.abstractsToIgnore) &&
                service.Abstract !== firstDataDescription) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webMapServiceCatalogItem.serviceDescription"),
                    content: service.Abstract
                }));
            }
            // Show the Access Constraints if it isn't "none" (because that's the default, and usually a lie).
            if (service.AccessConstraints &&
                !/^none$/i.test(service.AccessConstraints)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webMapServiceCatalogItem.accessConstraints"),
                    content: service.AccessConstraints
                }));
            }
        }
        return result;
    }
    get infoSectionOrder() {
        let layerDescriptions = [`Web Map Service Layer Description`];
        // If more than one layer, push layer description titles for each applicable layer
        if (this.capabilitiesLayers.size > 1) {
            layerDescriptions = [];
            this.capabilitiesLayers.forEach(layer => {
                if (layer &&
                    layer.Abstract &&
                    !containsAny(layer.Abstract, WebMapServiceCatalogItem.abstractsToIgnore)) {
                    layerDescriptions.push(`Web Map Service Layer Description - ${layer.Title}`);
                }
            });
        }
        return [
            i18next.t("preview.disclaimer"),
            i18next.t("description.name"),
            ...layerDescriptions,
            i18next.t("preview.datasetDescription"),
            i18next.t("preview.serviceDescription"),
            i18next.t("models.webMapServiceCatalogItem.serviceDescription"),
            i18next.t("preview.resourceDescription"),
            i18next.t("preview.licence"),
            i18next.t("preview.accessConstraints"),
            i18next.t("models.webMapServiceCatalogItem.accessConstraints"),
            i18next.t("preview.author"),
            i18next.t("preview.contact"),
            i18next.t("models.webMapServiceCatalogItem.serviceContact"),
            i18next.t("preview.created"),
            i18next.t("preview.modified"),
            i18next.t("preview.updateFrequency"),
            i18next.t("models.webMapServiceCatalogItem.getCapabilitiesUrl")
        ];
    }
    get shortReport() {
        const catalogItem = this.catalogItem;
        if (catalogItem.isShowingDiff) {
            const format = "yyyy/mm/dd";
            const d1 = dateFormat(catalogItem.firstDiffDate, format);
            const d2 = dateFormat(catalogItem.secondDiffDate, format);
            return `Showing difference image computed for ${catalogItem.diffStyleId} style on dates ${d1} and ${d2}`;
        }
    }
    get rectangle() {
        const layers = [...this.capabilitiesLayers.values()]
            .filter(layer => layer !== undefined)
            .map(l => l);
        // Get union of bounding rectangles for all layers
        const allLayersRectangle = layers.reduce((unionRectangle, layer) => {
            // Convert to cesium Rectangle (so we can use Rectangle.union)
            const latLonRect = getRectangleFromLayer(layer);
            const ceisumRect = Rectangle.fromDegrees(latLonRect === null || latLonRect === void 0 ? void 0 : latLonRect.west, latLonRect === null || latLonRect === void 0 ? void 0 : latLonRect.south, latLonRect === null || latLonRect === void 0 ? void 0 : latLonRect.east, latLonRect === null || latLonRect === void 0 ? void 0 : latLonRect.north);
            if (!unionRectangle) {
                return ceisumRect;
            }
            return Rectangle.union(unionRectangle, ceisumRect);
        }, undefined);
        if (allLayersRectangle &&
            isDefined(allLayersRectangle.west) &&
            isDefined(allLayersRectangle.south) &&
            isDefined(allLayersRectangle.east) &&
            isDefined(allLayersRectangle.north)) {
            return {
                west: CesiumMath.toDegrees(allLayersRectangle.west),
                south: CesiumMath.toDegrees(allLayersRectangle.south),
                east: CesiumMath.toDegrees(allLayersRectangle.east),
                north: CesiumMath.toDegrees(allLayersRectangle.north)
            };
        }
    }
    get isGeoServer() {
        var _a, _b, _c, _d;
        const keyword = (_c = (_b = (_a = this.capabilities) === null || _a === void 0 ? void 0 : _a.Service) === null || _b === void 0 ? void 0 : _b.KeywordList) === null || _c === void 0 ? void 0 : _c.Keyword;
        return ((isReadOnlyArray(keyword) && keyword.indexOf("GEOSERVER") >= 0) ||
            keyword === "GEOSERVER" || ((_d = this.catalogItem.url) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes("geoserver")));
    }
    // TODO - There is possibly a better way to do this
    get isThredds() {
        if (this.catalogItem.url &&
            (this.catalogItem.url.indexOf("thredds") > -1 ||
                this.catalogItem.url.indexOf("tds") > -1)) {
            return true;
        }
        return false;
    }
    // TODO - Geoserver also support NCWMS via a plugin, just need to work out how to detect that
    get isNcWMS() {
        if (this.catalogItem.isThredds)
            return true;
        return false;
    }
    get isEsri() {
        if (this.catalogItem.url !== undefined)
            return this.catalogItem.url.indexOf("MapServer/WMSServer") > -1;
        return false;
    }
    get supportsGetLegendGraphic() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return (isDefined((_b = (_a = this.capabilities) === null || _a === void 0 ? void 0 : _a.json) === null || _b === void 0 ? void 0 : _b["xmlns:sld"]) ||
            isDefined((_f = (_e = (_d = (_c = this.capabilities) === null || _c === void 0 ? void 0 : _c.json) === null || _d === void 0 ? void 0 : _d.Capability) === null || _e === void 0 ? void 0 : _e.Request) === null || _f === void 0 ? void 0 : _f.GetLegendGraphic) ||
            ((_g = this.catalogItem.isGeoServer) !== null && _g !== void 0 ? _g : false) ||
            ((_h = this.catalogItem.isNcWMS) !== null && _h !== void 0 ? _h : false));
    }
    get supportsColorScaleRange() {
        return this.catalogItem.isNcWMS;
    }
    get discreteTimes() {
        const result = [];
        for (let layer of this.capabilitiesLayers.values()) {
            if (!layer) {
                continue;
            }
            const dimensions = this.capabilities.getInheritedValues(layer, "Dimension");
            const timeDimension = dimensions.find(dimension => dimension.name.toLowerCase() === "time");
            if (!timeDimension) {
                continue;
            }
            let extent = timeDimension;
            // WMS 1.1.1 puts dimension values in an Extent element instead of directly in the Dimension element.
            const extentElements = this.capabilities.getInheritedValues(layer, "Extent");
            const extentElement = extentElements.find(extent => extent.name.toLowerCase() === "time");
            if (extentElement) {
                extent = extentElement;
            }
            if (!extent || !extent.split) {
                continue;
            }
            const values = extent.split(",");
            for (let i = 0; i < values.length; ++i) {
                const value = values[i];
                const isoSegments = value.split("/");
                if (isoSegments.length === 1) {
                    result.push({
                        time: values[i],
                        tag: undefined
                    });
                }
                else {
                    createDiscreteTimesFromIsoSegments(result, isoSegments[0], isoSegments[1], isoSegments[2], this.catalogItem.maxRefreshIntervals);
                }
            }
        }
        return result;
    }
    get initialTimeSource() {
        return "now";
    }
    get currentTime() {
        // Get default times for all layers
        const defaultTimes = filterOutUndefined(Array.from(this.capabilitiesLayers).map(([layerName, layer]) => {
            if (!layer)
                return;
            const dimensions = this.capabilities.getInheritedValues(layer, "Dimension");
            const timeDimension = dimensions.find(dimension => dimension.name.toLowerCase() === "time");
            return timeDimension === null || timeDimension === void 0 ? void 0 : timeDimension.default;
        }));
        // From WMS 1.3.0 spec:
        // For the TIME parameter, the special keyword “current” may be used if the <Dimension name="time"> service metadata element includes a nonzero value for the “current” attribute, as described in C.2.
        // The expression “TIME=current” means “send the most current data available”.
        // Here we return undefined, because WebMapServiceCapabilitiesStratum.initialTimeSource is set to "now"
        if (defaultTimes[0] === "current") {
            return undefined;
        }
        // Return first default time
        return defaultTimes[0];
    }
    get linkedWcsParameters() {
        // Get outputCrs
        // Note: this will be overriden by `WebCoverageServiceDescribeCoverageStratum` if a better outputCrs is found
        let outputCrs = this.availableCrs[0];
        // Unless it is Web Mercator of course - that would be stupid
        // If this is the case - use 4326
        outputCrs =
            outputCrs && SUPPORTED_CRS_3857.includes(outputCrs)
                ? "EPSG:4326"
                : outputCrs;
        // Get WCS subsets from time and WMS dimensions
        // These are used to "subset" WCS coverage (dataset)
        // This is used to flag subsets (dimensions) which have multiple values
        // Each element in this array represents the **actual** value used for a subset which has multiple values
        let duplicateSubsetValues = [];
        // Get dimensionSubsets
        const dimensionSubsets = [];
        if (this.catalogItem.dimensions) {
            Object.entries(this.catalogItem.dimensions).forEach(([key, values]) => {
                if (isDefined(values)) {
                    // If we have multiple values for a particular dimension, they will be comma separated
                    // WCS only supports a single value per dimension - so we take the first value
                    const valuesArray = values.split(",");
                    const value = valuesArray[0];
                    if (valuesArray.length > 1) {
                        duplicateSubsetValues.push(createStratumInstance(KeyValueTraits, { key, value }));
                    }
                    // Wrap string values in double quotes
                    dimensionSubsets.push({ key, value });
                }
            });
        }
        const subsets = filterOutUndefined([
            // Add time dimension
            this.catalogItem.currentDiscreteTimeTag
                ? { key: "time", value: this.catalogItem.currentDiscreteTimeTag }
                : undefined,
            // Add other dimensions
            ...dimensionSubsets
        ]).map(subset => createStratumInstance(KeyValueTraits, subset));
        return createStratumInstance(WebCoverageServiceParameterTraits, {
            outputCrs,
            subsets,
            duplicateSubsetValues,
            // Add styles parameter for OpenDataCube WCS
            additionalParameters: [{ key: "styles", value: this.catalogItem.styles }]
        });
    }
}
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "metadataUrls", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "layers", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "legends", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "capabilitiesLayers", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "availableCrs", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "crs", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "availableDimensions", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "availableStyles", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "styles", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "info", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "infoSectionOrder", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "shortReport", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "rectangle", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "isGeoServer", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "isThredds", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "isNcWMS", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "isEsri", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "supportsGetLegendGraphic", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "supportsColorScaleRange", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "discreteTimes", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "initialTimeSource", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "currentTime", null);
__decorate([
    computed
], WebMapServiceCapabilitiesStratum.prototype, "linkedWcsParameters", null);
function getServiceContactInformation(contactInfo) {
    const primary = contactInfo.ContactPersonPrimary;
    let text = "";
    if (isDefined(primary)) {
        if (isDefined(primary.ContactOrganization) &&
            primary.ContactOrganization.length > 0 &&
            // Geoserver default
            primary.ContactOrganization !== "The Ancient Geographers") {
            text += primary.ContactOrganization + "<br/>";
        }
    }
    if (isDefined(contactInfo.ContactElectronicMailAddress) &&
        contactInfo.ContactElectronicMailAddress.length > 0 &&
        // Geoserver default
        contactInfo.ContactElectronicMailAddress !== "claudius.ptolomaeus@gmail.com") {
        text += `[${contactInfo.ContactElectronicMailAddress}](mailto:${contactInfo.ContactElectronicMailAddress})`;
    }
    return text;
}
//# sourceMappingURL=WebMapServiceCapabilitiesStratum.js.map