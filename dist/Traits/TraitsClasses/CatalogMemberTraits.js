var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import EnumDimensionTraits from "./DimensionTraits";
export class MetadataUrlTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "URL",
        description: "The metadata URL of the file or service."
    })
], MetadataUrlTraits.prototype, "url", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Title",
        description: "Title used for metadata URL button."
    })
], MetadataUrlTraits.prototype, "title", void 0);
export class DataUrlTraits extends mixTraits(MetadataUrlTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Type",
        description: `Type of data URL. This value will be used to provide context or instruction on how to use the data URL. For example \`wcs\` will provide a link to WCS docs.
    Current supported values are:
    - \`wfs\` = A Web Feature Service (WFS) base URL
    - \`wcs\` = A Web Coverage Service (WCS) base URL
    - \`wfs-complete\` = A complete, ready-to-use link to download features from a WCS server
    -  \`wcs-complete\` = A complete, ready-to-use link to download features from a WFS server
    -  \`direct\` = Direct URL to dataset (this is the default if no \`type\` is specified)
    -  \`none\` = Hide data URL
    `
    })
], DataUrlTraits.prototype, "type", void 0);
export class InfoSectionTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.show = true;
    }
    static isRemoval(infoSection) {
        return infoSection.content === null;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "The name of the section."
    })
], InfoSectionTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Content",
        description: "The content of the section, in Markdown and HTML format. Set this property to null to remove this section entirely.",
        isNullable: true
    })
], InfoSectionTraits.prototype, "content", void 0);
__decorate([
    anyTrait({
        name: "Content As Object",
        description: "The content of the section which is a JSON object. Set this property to null to remove this section entirely."
    })
], InfoSectionTraits.prototype, "contentAsObject", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show",
        description: "Indicates if this info section showing (not collapsed)."
    })
], InfoSectionTraits.prototype, "show", void 0);
export class ShortReportTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.show = true;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "The name of the section."
    })
], ShortReportTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Content",
        description: "The content of the section."
    })
], ShortReportTraits.prototype, "content", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show",
        description: "Indicates if this short report section showing."
    })
], ShortReportTraits.prototype, "show", void 0);
export default class CatalogMemberTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.info = [];
        this.infoSectionOrder = [
            i18next.t("preview.disclaimer"),
            i18next.t("description.name"),
            i18next.t("preview.dataDescription"),
            i18next.t("preview.datasetDescription"),
            i18next.t("preview.serviceDescription"),
            i18next.t("preview.resourceDescription"),
            i18next.t("preview.licence"),
            i18next.t("preview.accessConstraints"),
            i18next.t("preview.author"),
            i18next.t("preview.contact"),
            i18next.t("preview.created"),
            i18next.t("preview.modified"),
            i18next.t("preview.updateFrequency")
        ];
        this.isOpenInWorkbench = true;
        this.isExperiencingIssues = false;
        this.hideSource = false;
        this.disableAboutData = false;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "The name of the catalog item."
    })
], CatalogMemberTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Description",
        description: "The description of the catalog item. Markdown and HTML may be used."
    })
], CatalogMemberTraits.prototype, "description", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name in catalog",
        description: "The name of the item to be displayed in the catalog, if it is different from the one to display in the workbench."
    })
], CatalogMemberTraits.prototype, "nameInCatalog", void 0);
__decorate([
    objectArrayTrait({
        type: InfoSectionTraits,
        name: "Info",
        description: "Human-readable information about this dataset.",
        idProperty: "name"
    })
], CatalogMemberTraits.prototype, "info", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "InfoSectionOrder",
        description: `An array of section titles defining the display order of info sections. If this property is not defined, {@link DataPreviewSections}'s DEFAULT_SECTION_ORDER is used`
    })
], CatalogMemberTraits.prototype, "infoSectionOrder", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is catalog item open in workbench",
        description: "Whether the item in the workbench open or collapsed."
    })
], CatalogMemberTraits.prototype, "isOpenInWorkbench", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Short report",
        description: "A short report to show on the now viewing tab."
    })
], CatalogMemberTraits.prototype, "shortReport", void 0);
__decorate([
    objectArrayTrait({
        type: ShortReportTraits,
        idProperty: "name",
        name: "Short report sections",
        description: "A list of collapsible sections of the short report"
    })
], CatalogMemberTraits.prototype, "shortReportSections", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is experiencing issues",
        description: "Whether the catalog item is experiencing issues which may cause its data to be unavailable"
    })
], CatalogMemberTraits.prototype, "isExperiencingIssues", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Hide source in explorer window",
        description: "Indicates that the source of this data should be hidden from the UI (obviously this isn't super-secure as you can just look at the network requests)."
    })
], CatalogMemberTraits.prototype, "hideSource", void 0);
__decorate([
    objectArrayTrait({
        type: MetadataUrlTraits,
        name: "Metadata URLs",
        description: "Metadata URLs to show in data catalog.",
        idProperty: "index"
    })
], CatalogMemberTraits.prototype, "metadataUrls", void 0);
__decorate([
    objectArrayTrait({
        type: DataUrlTraits,
        name: "Data URLs",
        description: "Data URLs to show in data catalog.",
        idProperty: "index"
    })
], CatalogMemberTraits.prototype, "dataUrls", void 0);
__decorate([
    primitiveTrait({
        name: "Data Custodian",
        type: "string",
        description: "Gets or sets a description of the custodian of this data item."
    })
], CatalogMemberTraits.prototype, "dataCustodian", void 0);
__decorate([
    objectArrayTrait({
        type: EnumDimensionTraits,
        idProperty: "id",
        name: "Model dimensions",
        description: "This provides ability to set model JSON through SelectableDimensions (a dropdown). When an option is selected, the `value` property will be used to call `updateModelFromJson()`. All string properties support Mustache templates (with the catalog member as context)"
    })
], CatalogMemberTraits.prototype, "modelDimensions", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable about data",
        description: "Disables the 'About Data' button in the workbench."
    })
], CatalogMemberTraits.prototype, "disableAboutData", void 0);
//# sourceMappingURL=CatalogMemberTraits.js.map