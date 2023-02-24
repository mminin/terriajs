import getDataType from "../../Core/getDataType";
import isDefined from "../../Core/isDefined";
import readJson from "../../Core/readJson";
import TerriaError from "../../Core/TerriaError";
import TimeVarying from "../../ModelMixins/TimeVarying";
import CommonStrata from "../Definition/CommonStrata";
import addUserCatalogMember from "./addUserCatalogMember";
import createCatalogItemFromFileOrUrl from "./createCatalogItemFromFileOrUrl";
import ResultPendingCatalogItem from "./ResultPendingCatalogItem";
export default async function addUserFiles(files, terria, viewState, fileType) {
    const dataType = fileType || getDataType().localDataType[0];
    const tempCatalogItemList = [];
    const promises = [];
    function loadCatalogItemFromFile(file) {
        try {
            const item = createCatalogItemFromFileOrUrl(terria, viewState, file, dataType.value);
            return addUserCatalogMember(terria, item);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    function loadInitData(initData) {
        terria.catalog.group
            .addMembersFromJson(CommonStrata.user, initData.catalog)
            .raiseError(terria, "Failed to load catalog from file");
    }
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const tempCatalogItem = new ResultPendingCatalogItem(file.name, terria);
        tempCatalogItem.setTrait(CommonStrata.user, "name", file.name);
        tempCatalogItem.setTrait(CommonStrata.user, "description", "Loading file...");
        terria.catalog.userAddedDataGroup.add(CommonStrata.user, tempCatalogItem);
        let loadPromise;
        if (file.name.toUpperCase().indexOf(".JSON") !== -1) {
            const promise = readJson(file).then((json) => {
                if (isDefined(json.catalog) || isDefined(json.stories)) {
                    // This is an init file.
                    try {
                        loadInitData(json);
                    }
                    finally {
                        tempCatalogItemList.splice(tempCatalogItemList.indexOf(tempCatalogItem), 1);
                        terria.workbench.remove(tempCatalogItem);
                        terria.catalog.userAddedDataGroup.remove(CommonStrata.user, tempCatalogItem);
                    }
                }
                else {
                    return loadCatalogItemFromFile(file);
                }
            });
            loadPromise = promise.catch((e) => {
                terria.raiseErrorToUser(e);
                return undefined;
            });
            promises.push();
        }
        else {
            loadPromise = loadCatalogItemFromFile(file);
            promises.push(loadPromise);
        }
        tempCatalogItem.loadPromise = loadPromise;
        terria.workbench.add(tempCatalogItem);
        tempCatalogItemList.push(tempCatalogItem);
    }
    const addedItems = await Promise.all(promises);
    // if addedItem has only undefined item, means init files
    // have been uploaded
    if (addedItems.every((item) => item === undefined)) {
        viewState.openAddData();
    }
    else {
        const items = addedItems.filter((item) => isDefined(item) && !(item instanceof TerriaError));
        tempCatalogItemList.forEach((item) => {
            terria.catalog.userAddedDataGroup.remove(CommonStrata.user, item);
            terria.workbench.remove(item);
        });
        items.forEach((item) => TimeVarying.is(item) && terria.timelineStack.addToTop(item));
        return items;
    }
}
//# sourceMappingURL=addUserFiles.js.map