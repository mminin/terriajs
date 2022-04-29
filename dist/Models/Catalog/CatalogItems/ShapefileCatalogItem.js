var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as geoJsonMerge from "@mapbox/geojson-merge";
import i18next from "i18next";
import { computed } from "mobx";
import * as shp from "shpjs";
import isDefined from "../../../Core/isDefined";
import { isJsonObject } from "../../../Core/Json";
import loadBlob, { isZip } from "../../../Core/loadBlob";
import TerriaError from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GeoJsonMixin from "../../../ModelMixins/GeojsonMixin";
import ShapefileCatalogItemTraits from "../../../Traits/TraitsClasses/ShapefileCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import { fileApiNotSupportedError } from "./GeoJsonCatalogItem";
export function isJsonArrayOrDeepArrayOfObjects(value) {
    return (Array.isArray(value) &&
        value.every(child => isJsonObject(child) || isJsonArrayOrDeepArrayOfObjects(child)));
}
class ShapefileCatalogItem extends GeoJsonMixin(CatalogMemberMixin(CreateModel(ShapefileCatalogItemTraits))) {
    get type() {
        return ShapefileCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.shapefile.name");
    }
    setFileInput(file) {
        this._file = file;
    }
    get hasLocalData() {
        return isDefined(this._file);
    }
    async forceLoadGeojsonData() {
        // ShapefileCatalogItem._file
        if (this._file) {
            return await parseShapefile(this._file);
        }
        // GeojsonTraits.url
        else if (this.url) {
            // URL to zipped fle
            if (isZip(this.url)) {
                if (typeof FileReader === "undefined") {
                    throw fileApiNotSupportedError(this.terria);
                }
                const blob = await loadBlob(this.url);
                return await parseShapefile(blob);
            }
            else {
                throw TerriaError.from("Invalid URL: Only zipped shapefiles are supported (the extension must be `.zip`)");
            }
        }
        throw TerriaError.from("Failed to load shapefile - no URL of file has been defined");
    }
}
ShapefileCatalogItem.type = "shp";
__decorate([
    computed
], ShapefileCatalogItem.prototype, "hasLocalData", null);
async function parseShapefile(blob) {
    let json;
    const asAb = await blob.arrayBuffer();
    json = await shp.parseZip(asAb);
    if (isJsonArrayOrDeepArrayOfObjects(json)) {
        // There were multiple shapefiles in this zip file. Merge them.
        json = geoJsonMerge.merge(json);
    }
    return json;
}
export default ShapefileCatalogItem;
//# sourceMappingURL=ShapefileCatalogItem.js.map