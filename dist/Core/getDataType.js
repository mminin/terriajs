import i18next from "i18next";
import { observable, action } from "mobx";
/**
 * List of builtin remote upload types
 */
const builtinRemoteDataTypes = [
    {
        value: "auto",
        name: "core.dataType.auto"
    },
    {
        value: "wms-group",
        name: "core.dataType.wms-group"
    },
    {
        value: "wfs-group",
        name: "core.dataType.wfs-group"
    },
    {
        value: "esri-group",
        name: "core.dataType.esri-group"
    },
    // esri-group is registered with ArcGisCatalogGroup, which can read REST, MapServer and FeatureServer groups.
    // So we do not need to explicitly include esri-mapServer-group or esri-featureServer-group here.
    {
        value: "esri-mapServer",
        name: "core.dataType.esri-mapServer"
    },
    /* {
          value: "esri-mapServer-group",
          name: "Esri ArcGIS MapServer"
        }, */
    {
        value: "esri-featureServer",
        name: "core.dataType.esri-featureServer"
    },
    // to be removed once ArcGisCatalogGroup is implemented
    /* {
          value: "esri-featureServer-group",
          name: "Esri ArcGIS FeatureServer"
        }, */
    {
        value: "3d-tiles",
        name: "core.dataType.3d-tiles"
    },
    {
        value: "open-street-map",
        name: "core.dataType.open-street-map"
    },
    {
        value: "geojson",
        name: "core.dataType.geojson"
    },
    {
        value: "kml",
        name: "core.dataType.kml"
    },
    {
        value: "csv",
        name: "core.dataType.csv"
    },
    {
        value: "wmts-group",
        name: "core.dataType.wmts-group"
    },
    {
        value: "carto",
        name: "core.dataType.carto"
    },
    {
        value: "czml",
        name: "core.dataType.czml"
    },
    {
        value: "gpx",
        name: "core.dataType.gpx"
    },
    {
        value: "georss",
        name: "core.dataType.geoRss"
    },
    {
        value: "shp",
        name: "core.dataType.shp"
    },
    {
        value: "wps-getCapabilities",
        name: "core.dataType.wps-getCapabilities"
    },
    {
        value: "sdmx-group",
        name: "core.dataType.sdmx-group"
    },
    {
        value: "opendatasoft-group",
        name: "core.dataType.opendatasoft-group"
    },
    {
        value: "socrata-group",
        name: "core.dataType.socrata-group"
    },
    {
        value: "gltf",
        name: "core.dataType.gltf"
    },
    {
        value: "json",
        name: "core.dataType.json"
    }
    // Add next builtin remote upload type
];
/**
 * List of builtin local upload types
 */
const builtinLocalDataTypes = [
    {
        value: "auto",
        name: "core.dataType.auto"
    },
    {
        value: "geojson",
        name: "core.dataType.geojson",
        extensions: ["geojson"]
    },
    {
        value: "kml",
        name: "core.dataType.kml",
        extensions: ["kml", "kmz"]
    },
    {
        value: "csv",
        name: "core.dataType.csv",
        extensions: ["csv"]
    },
    {
        value: "czml",
        name: "core.dataType.czml",
        extensions: ["czml"]
    },
    {
        value: "gpx",
        name: "core.dataType.gpx",
        extensions: ["gpx"]
    },
    {
        value: "json",
        name: "core.dataType.json",
        extensions: ["json", "json5"]
    },
    {
        value: "georss",
        name: "core.dataType.geoRss",
        extensions: ["xml"]
    },
    {
        value: "gltf",
        name: "core.dataType.gltf",
        extensions: ["glb"]
    },
    {
        value: "shp",
        name: "core.dataType.shp",
        extensions: ["zip"]
    }
    // Add next builtin local upload type
];
/**
 * Custom remote data types. Add to it by calling addRemoteDataType().
 */
const customRemoteDataTypes = observable(new Map());
/**
 * Custom local data types. Add by calling addLocalDataType().
 */
const customLocalDataTypes = observable(new Map());
export default function getDataTypes() {
    const uniqueRemoteDataTypes = new Map([
        ...builtinRemoteDataTypes.map((dtype) => [
            dtype.value,
            translateDataType(dtype)
        ]),
        ...customRemoteDataTypes.entries()
    ]);
    const uniqueLocalDataTypes = new Map([
        ...builtinLocalDataTypes.map((dtype) => [
            dtype.value,
            translateDataType(dtype)
        ]),
        ...customLocalDataTypes.entries()
    ]);
    return {
        remoteDataType: [...uniqueRemoteDataTypes.values()],
        localDataType: [...uniqueLocalDataTypes.values()]
    };
}
/**
 * Add a new data type to show in the supported file type listing when
 * uploading a file from the a remote server. If a data type with the same
 * `value` already exists, we replace it with the new one.
 *
 * @param newRemoteDataType The new remote data type to be added.
 */
export const addRemoteUploadType = action((newRemoteDataType) => {
    customRemoteDataTypes.set(newRemoteDataType.value, newRemoteDataType);
});
/**
 * Add a new data type to show in the supported file type listing when
 * uploading a file from the users local machine. If a data type with the same
 * `value` already exists, we replace it with the new one.
 *
 * @param newLocalDataType The new local data type to be added.
 */
export const addLocalUploadType = action((newLocalDataType) => {
    customLocalDataTypes.set(newLocalDataType.value, newLocalDataType);
});
function translateDataType(dataType) {
    return {
        ...dataType,
        value: dataType.value,
        name: i18next.t(dataType.name),
        description: dataType.description
            ? i18next.t(dataType.description)
            : undefined
    };
}
//# sourceMappingURL=getDataType.js.map