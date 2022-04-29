import CommonStrata from "../../Definition/CommonStrata";
import upsertModelFromJson from "../../Definition/upsertModelFromJson";
import CatalogMemberFactory from "../CatalogMemberFactory";
import UrlReference from "./UrlReference";
import TerriaError from "../../../Core/TerriaError";
export default async function createUrlReferenceFromUrl(url, terria, allowLoad) {
    try {
        const item = upsertModelFromJson(CatalogMemberFactory, terria, "", CommonStrata.definition, {
            type: UrlReference.type,
            name: url,
            localId: url,
            allowLoad: allowLoad
        }, {}).throwIfUndefined();
        // Set URL in user stratum so it can be shared
        item.setTrait(CommonStrata.user, "url", url);
        if (!(item instanceof UrlReference)) {
            throw `Invalid model type`;
        }
        terria.catalog.userAddedDataGroup.add(CommonStrata.user, item);
        (await item.loadReference()).throwIfError();
        if (item.target !== undefined) {
            return item;
        }
    }
    catch (e) {
        throw TerriaError.from(e, `Could not load UrlReference for URL: ${url}`);
    }
}
//# sourceMappingURL=createUrlReferenceFromUrl.js.map