var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
function ExportableMixin(Base) {
    class ExportableMixin extends Base {
        /**
         * Indicates if model is able to export data (will turn on/off UI elements)
         */
        get canExportData() {
            return !this.disableExport && this._canExportData;
        }
        /**
         * @returns an async function which returns a URL (to download) or a Blob with filename
         */
        exportData() {
            if (this.canExportData) {
                return this._exportData();
            }
        }
    }
    __decorate([
        computed
    ], ExportableMixin.prototype, "canExportData", null);
    return ExportableMixin;
}
(function (ExportableMixin) {
    function isMixedInto(model) {
        return model && "exportData" in model && "canExportData" in model;
    }
    ExportableMixin.isMixedInto = isMixedInto;
})(ExportableMixin || (ExportableMixin = {}));
export default ExportableMixin;
//# sourceMappingURL=ExportableMixin.js.map