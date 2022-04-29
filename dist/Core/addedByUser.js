import { BaseModel } from "../Models/Definition/Model";
import i18next from "i18next";
import isDefined from "./isDefined";
export const USER_ADDED_CATEGORY_ID = "__User-Added_Data__";
export default function addedByUser(catalogMember, options = {
    depth: 0
}) {
    if (!isDefined(catalogMember))
        return false;
    const depth = options.depth;
    if (depth > 100) {
        console.error(i18next.t("core.errors.tooDeepAddedByUser", {
            memberId: catalogMember.uniqueId
        }));
        return false;
    }
    const sourceReference = catalogMember.sourceReference !== undefined
        ? catalogMember.sourceReference
        : catalogMember;
    return sourceReference.knownContainerUniqueIds.some(containerId => {
        return (containerId === USER_ADDED_CATEGORY_ID ||
            addedByUser(catalogMember.terria.getModelById(BaseModel, containerId), {
                depth: depth + 1
            }));
    });
}
//# sourceMappingURL=addedByUser.js.map