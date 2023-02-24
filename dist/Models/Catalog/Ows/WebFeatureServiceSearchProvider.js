import i18next from "i18next";
import { runInAction } from "mobx";
import URI from "urijs";
import zoomRectangleFromPoint from "../../../Map/Vector/zoomRectangleFromPoint";
import xml2json from "../../../ThirdParty/xml2json";
import SearchProvider from "../../SearchProviders/SearchProvider";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import Resource from "terriajs-cesium/Source/Core/Resource";
export default class WebFeatureServiceSearchProvider extends SearchProvider {
    constructor(options) {
        super();
        this._waitingForResults = false;
        this._wfsServiceUrl = new URI(options.wfsServiceUrl);
        this._searchPropertyName = options.searchPropertyName;
        this._searchPropertyTypeName = options.searchPropertyTypeName;
        this._featureToSearchResultFunction = options.featureToSearchResultFunction;
        this.terria = options.terria;
        this.flightDurationSeconds = defaultValue(options.flightDurationSeconds, 1.5);
        this._transformSearchText = options.transformSearchText;
        this._searchResultFilterFunction = options.searchResultFilterFunction;
        this._searchResultScoreFunction = options.searchResultScoreFunction;
        this.name = options.name;
    }
    getXml() {
        const resource = new Resource({ url: this._wfsServiceUrl.toString() });
        this._waitingForResults = true;
        const xmlPromise = resource.fetchXML();
        this.cancelRequest = resource.request.cancelFunction;
        return xmlPromise.finally(() => {
            this._waitingForResults = false;
        });
    }
    doSearch(searchText, results) {
        results.results.length = 0;
        results.message = undefined;
        if (this._waitingForResults) {
            // There's been a new search! Cancel the previous one.
            if (this.cancelRequest !== undefined) {
                this.cancelRequest();
                this.cancelRequest = undefined;
            }
            this._waitingForResults = false;
        }
        const originalSearchText = searchText;
        searchText = searchText.trim();
        if (this._transformSearchText !== undefined) {
            searchText = this._transformSearchText(searchText);
        }
        if (searchText.length < 2) {
            return Promise.resolve();
        }
        // Support for matchCase="false" is patchy, but we try anyway
        const filter = `<ogc:Filter><ogc:PropertyIsLike wildCard="*" matchCase="false">
        <ogc:ValueReference>${this._searchPropertyName}</ogc:ValueReference>
        <ogc:Literal>*${searchText}*</ogc:Literal></ogc:PropertyIsLike></ogc:Filter>`;
        this._wfsServiceUrl.setSearch({
            service: "WFS",
            request: "GetFeature",
            typeName: this._searchPropertyTypeName,
            version: "1.1.0",
            srsName: "urn:ogc:def:crs:EPSG::4326",
            filter: filter
        });
        return this.getXml()
            .then((xml) => {
            let json = xml2json(xml);
            let features;
            if (json === undefined) {
                results.message = i18next.t("viewModels.searchErrorOccurred");
                return;
            }
            if (json.member !== undefined) {
                features = json.member;
            }
            else if (json.featureMember !== undefined) {
                features = json.featureMember;
            }
            else {
                results.message = i18next.t("viewModels.searchNoPlaceNames");
                return;
            }
            // if there's only one feature, make it an array
            if (!Array.isArray(features)) {
                features = [features];
            }
            const resultSet = new Set();
            runInAction(() => {
                if (this._searchResultFilterFunction !== undefined) {
                    features = features.filter(this._searchResultFilterFunction);
                }
                if (features.length === 0) {
                    results.message = i18next.t("viewModels.searchNoPlaceNames");
                    return;
                }
                if (this._searchResultScoreFunction !== undefined) {
                    features = features.sort((featureA, featureB) => this._searchResultScoreFunction(featureB, originalSearchText) -
                        this._searchResultScoreFunction(featureA, originalSearchText));
                }
                let searchResults = features
                    .map(this._featureToSearchResultFunction)
                    .map((result) => {
                    result.clickAction = createZoomToFunction(this, result.location);
                    return result;
                });
                // If we don't have a scoring function, sort the search results now
                // We can't do this earlier because we don't know what the schema of the unprocessed feature looks like
                if (this._searchResultScoreFunction === undefined) {
                    // Put shorter results first
                    // They have a larger percentage of letters that the user actually typed in them
                    searchResults = searchResults.sort((featureA, featureB) => featureA.name.length - featureB.name.length);
                }
                // Remove results that have the same name and are close to each other
                searchResults = searchResults.filter((result) => {
                    var _a, _b;
                    const hash = `${result.name},${(_a = result.location) === null || _a === void 0 ? void 0 : _a.latitude.toFixed(1)},${(_b = result.location) === null || _b === void 0 ? void 0 : _b.longitude.toFixed(1)}`;
                    if (resultSet.has(hash)) {
                        return false;
                    }
                    resultSet.add(hash);
                    return true;
                });
                // append new results to all results
                results.results.push(...searchResults);
            });
        })
            .catch((e) => {
            if (results.isCanceled) {
                // A new search has superseded this one, so ignore the result.
                return;
            }
            results.message = i18next.t("viewModels.searchErrorOccurred");
        });
    }
}
function createZoomToFunction(model, location) {
    // Server does not return information of a bounding box, just a location.
    // bboxSize is used to expand a point
    var bboxSize = 0.2;
    var rectangle = zoomRectangleFromPoint(location.latitude, location.longitude, bboxSize);
    return function () {
        model.terria.currentViewer.zoomTo(rectangle, model.flightDurationSeconds);
    };
}
//# sourceMappingURL=WebFeatureServiceSearchProvider.js.map