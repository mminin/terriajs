import CommonStrata from "../Definition/CommonStrata";
import { BaseModel } from "../Definition/Model";
import StubCatalogItem from "./CatalogItems/StubCatalogItem";
export const getUniqueStubName = (terria) => {
    const stubName = "[StubCatalogItem]";
    let uniqueId = stubName;
    let idIncrement = 1;
    while (terria.getModelById(BaseModel, uniqueId) !== undefined) {
        uniqueId = stubName + " (" + idIncrement + ")";
        idIncrement++;
    }
    return uniqueId;
};
export default function createStubCatalogItem(terria, uniqueId) {
    const idToUse = uniqueId || getUniqueStubName(terria);
    const stub = new StubCatalogItem(idToUse, terria);
    stub.setTrait(CommonStrata.underride, "name", stub.uniqueId);
    terria.addModel(stub);
    return stub;
}
//# sourceMappingURL=createStubCatalogItem.js.map