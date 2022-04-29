import CommonStrata from "../Definition/CommonStrata";
/**
 * Remove a user added data item or group
 */
export default function (terria, target) {
    terria.catalog.userAddedDataGroup.remove(CommonStrata.user, target);
}
//# sourceMappingURL=removeUserAddedData.js.map