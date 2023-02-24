import i18next from "i18next";
import isDefined from "../../Core/isDefined";
import TerriaError from "../../Core/TerriaError";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import CommonStrata from "../Definition/CommonStrata";
import upsertModelFromJson from "../Definition/upsertModelFromJson";
import HasLocalData from "../HasLocalData";
import CatalogMemberFactory from "./CatalogMemberFactory";
import createUrlReferenceFromUrl from "./CatalogReferences/createUrlReferenceFromUrl";
export default function createCatalogItemFromFileOrUrl(terria, viewState, fileOrUrl, dataType) {
    dataType = isDefined(dataType) ? dataType : "auto";
    let isUrl, name;
    if (typeof fileOrUrl === "string") {
        name = fileOrUrl;
        isUrl = true;
    }
    else {
        name = fileOrUrl.name;
        isUrl = false;
    }
    if (dataType === "auto") {
        return createUrlReferenceFromUrl(name, terria, isUrl).then((newItem) => {
            if (!isDefined(newItem)) {
                terria.raiseErrorToUser(new TerriaError({
                    title: i18next.t("models.catalog.unsupportedFileTypeTitle"),
                    message: i18next.t("models.catalog.unsupportedFileTypeMessage", {
                        appName: terria.appName,
                        link: '<a href="https://github.com/TerriaJS/nationalmap/wiki/csv-geo-au">csv-geo-au format</a>'
                    })
                }));
                return undefined;
            }
            // It's a file or service we support directly
            // In some cases (web services), the item will already have been loaded by this point.
            return loadItem(newItem, fileOrUrl);
        });
    }
    else {
        // User has provided a type, so we go with that.
        return loadItem(createCatalogMember(terria, { type: dataType, name }), fileOrUrl);
    }
}
function createCatalogMember(terria, json) {
    return upsertModelFromJson(CatalogMemberFactory, terria, "", CommonStrata.definition, json, {}).throwIfUndefined({
        message: `Failed to create catalog member from JSON: ${json.name}`
    });
}
async function loadItem(newCatalogItem, fileOrUrl) {
    if (ReferenceMixin.isMixedInto(newCatalogItem) &&
        newCatalogItem.target !== undefined) {
        return loadItem(newCatalogItem.target, fileOrUrl);
    }
    if (typeof fileOrUrl === "string") {
        newCatalogItem.setTrait(CommonStrata.user, "url", fileOrUrl);
    }
    else if (HasLocalData.is(newCatalogItem)) {
        newCatalogItem.setFileInput(fileOrUrl);
    }
    return newCatalogItem;
}
//# sourceMappingURL=createCatalogItemFromFileOrUrl.js.map