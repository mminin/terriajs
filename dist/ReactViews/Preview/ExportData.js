var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import { withTranslation } from "react-i18next";
import Styles from "./mappable-preview.scss";
import { observer } from "mobx-react";
import isDefined from "../../Core/isDefined";
import ExportableMixin from "../../ModelMixins/ExportableMixin";
const FileSaver = require("file-saver");
export async function exportData(item) {
    const data = await item.exportData();
    if (!isDefined(data)) {
        return;
    }
    if (typeof data === "string") {
        window.open(data);
    }
    else if ("file" in data && "name" in data) {
        FileSaver.saveAs(data.file, data.name);
    }
}
/**
 * CatalogItem ExportData.
 */
let ExportData = class ExportData extends React.Component {
    exportDataClicked(item) {
        exportData(item).catch((e) => {
            this.props.item.terria.raiseErrorToUser(e);
        });
    }
    render() {
        const catalogItem = this.props.item;
        if (!catalogItem ||
            !ExportableMixin.isMixedInto(catalogItem) ||
            !catalogItem.canExportData)
            return null;
        return (React.createElement("div", { className: Styles.metadata },
            React.createElement("button", { onClick: this.exportDataClicked.bind(this, catalogItem) }, "Export data")));
    }
};
ExportData = __decorate([
    observer
], ExportData);
export default withTranslation()(ExportData);
//# sourceMappingURL=ExportData.js.map