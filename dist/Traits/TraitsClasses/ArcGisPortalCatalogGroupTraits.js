var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ArcGisPortalSharedTraits from "./ArcGisPortalSharedTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import GroupTraits from "./GroupTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import UrlTraits from "./UrlTraits";
export default class ArcGisPortalCatalogGroupTraits extends mixTraits(GroupTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits, ArcGisPortalSharedTraits) {
    constructor() {
        super(...arguments);
        this.searchParams = {
            q: `(type:"Scene Service" OR
         type:"Feature Service" OR
         type:"Map Service" OR
         type:"WMS" OR
         type:"WFS" OR
         type:"KML")`,
            sortField: "title"
        };
        this.groupSearchParams = {
            q: `orgid:0123456789ABCDEF
       (access:private OR access:org)
       -owner:esri_nav
       -owner:esri_livingatlas
       -owner:esri_boundaries
       -owner:esri_demographics
      `,
            searchUserAccess: "groupMember"
        };
        this.groupBy = "none";
        this.ungroupedTitle = "Ungrouped";
        this.hideEmptyGroups = true;
    }
}
__decorate([
    anyTrait({
        name: "Search Parameters",
        description: `An object containing parameters matching the ArcGIS Rest API params, see https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm`
    })
], ArcGisPortalCatalogGroupTraits.prototype, "searchParams", void 0);
__decorate([
    anyTrait({
        name: "Group Search Parameters",
        description: `An object containing parameters to search by groups using the ArcGIS Rest API params, see https://developers.arcgis.com/rest/users-groups-and-items/group-search.htm
    Note: this setting is only used when "groupBy" option is set to "organisationsGroups".
    `
    })
], ArcGisPortalCatalogGroupTraits.prototype, "groupSearchParams", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Group By",
        description: `Gets or sets a value indicating how datasets should be grouped.  Valid values are:
     * none - All available datasets are put in a flat list; they are not grouped at all.
     * organisationsGroups - Data is retrieved and sorted by the organisations groups.
     * portalCategories - Data is retrieved and sorted by categories specified by the portal items.
     * usersGroups - Data is retrieved and sorted by the groups particular to the user.
     * Note: This requires a user to be signed into portal, with a "portalUsername" to be set in "terria.userProperties", this is not available by default and requires custom configuration of TerriaMap.
    `
    })
], ArcGisPortalCatalogGroupTraits.prototype, "groupBy", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Ungrouped title",
        description: `A title for the group holding all items that don't have a group in an ArcGIS Portal.
      If the value is a blank string or undefined, these items will be left at the top level, not grouped.`
    })
], ArcGisPortalCatalogGroupTraits.prototype, "ungroupedTitle", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Hide empty groups",
        description: `If a group has no items don't display it in the catalog`
    })
], ArcGisPortalCatalogGroupTraits.prototype, "hideEmptyGroups", void 0);
//# sourceMappingURL=ArcGisPortalCatalogGroupTraits.js.map