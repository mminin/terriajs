import i18next from "i18next";
import markerIcon from "./markerIcon";
import prettifyCoordinates from "../Map/prettifyCoordinates";
import CommonStrata from "./Definition/CommonStrata";
import CzmlCatalogItem from "./Catalog/CatalogItems/CzmlCatalogItem";
import { toJS } from "mobx";
export const LOCATION_MARKER_DATA_SOURCE_NAME = "TerriaJS Location Marker Points";
export const MARKER_UNIQUE_ID = "__TERRRIAJS-LOCATIONMARKER__";
/**
 * Adds a location marker to the map with the position supplied in the result, adding a data source to terria if one hasn't
 * already been added, and removing all previously added markers in that data source. This data source is stored in
 * terria.locationMarker.
 */
export function addMarker(terria, details) {
    const location = details.location;
    const displayCoords = prettifyCoordinates(details.location.longitude, details.location.latitude, { digits: 5 });
    const billboard = {
        image: details.customMarkerIcon || markerIcon,
        scale: details.customMarkerIcon ? 1 : 0.5,
        verticalOrigin: "BOTTOM",
        heightReference: details.heightReference ||
            (details.location.height === undefined ? "CLAMP_TO_GROUND" : "NONE")
    };
    const document = {
        id: "document",
        name: LOCATION_MARKER_DATA_SOURCE_NAME,
        version: "1.0"
    };
    const marker = {
        name: details.name,
        position: {
            cartographicDegrees: [
                location.longitude,
                location.latitude,
                location.height || 0.0
            ]
        },
        description: `<table><tr><td>${i18next.t("featureInfo.latLon")}</td><td>${displayCoords.latitude}, ${displayCoords.longitude}</td></tr></table>`,
        billboard: billboard
    };
    let catalogItem = terria.getModelById(CzmlCatalogItem, MARKER_UNIQUE_ID);
    if (catalogItem === undefined) {
        catalogItem = new CzmlCatalogItem(MARKER_UNIQUE_ID, terria);
        catalogItem.setTrait(CommonStrata.definition, "name", LOCATION_MARKER_DATA_SOURCE_NAME);
        terria.addModel(catalogItem);
    }
    catalogItem.setTrait(CommonStrata.user, "czmlData", [document, marker]);
    terria.overlays.add(catalogItem);
    return catalogItem;
}
/** Removes a marker previously added in {@link #addMarker}. */
export function removeMarker(terria) {
    const catalogItem = terria.getModelById(CzmlCatalogItem, MARKER_UNIQUE_ID);
    if (catalogItem !== undefined) {
        terria.overlays.remove(catalogItem);
    }
}
/** Determines whether the location marker is visible previously added in {@link #addMarker}. */
export function isMarkerVisible(terria) {
    const catalogItem = terria.getModelById(CzmlCatalogItem, MARKER_UNIQUE_ID);
    return catalogItem !== undefined && terria.overlays.contains(catalogItem);
}
export function getMarkerLocation(terria) {
    var _a;
    const catalogItem = terria.getModelById(CzmlCatalogItem, MARKER_UNIQUE_ID);
    if (catalogItem === undefined || !terria.overlays.contains(catalogItem)) {
        return;
    }
    const marker = catalogItem.czmlData[1];
    const position = (_a = marker === null || marker === void 0 ? void 0 : marker.position) === null || _a === void 0 ? void 0 : _a.cartographicDegrees;
    if (Array.isArray(toJS(position))) {
        const [longitude, latitude, height] = position;
        if (longitude !== undefined && latitude !== undefined) {
            return { longitude, latitude, height };
        }
    }
    return undefined;
}
//# sourceMappingURL=LocationMarkerUtils.js.map