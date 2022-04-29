var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed } from "mobx";
import Icon from "../../../../Styled/Icon";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";
export class ToggleSplitterController extends MapNavigationItemController {
    constructor(viewState) {
        super();
        this.viewState = viewState;
    }
    get glyph() {
        if (this.active) {
            return Icon.GLYPHS.splitterOn;
        }
        return Icon.GLYPHS.compare;
    }
    get viewerMode() {
        return undefined;
    }
    get visible() {
        return super.visible && this.viewState.terria.currentViewer.canShowSplitter;
    }
    get disabled() {
        var _a;
        const toolIsDifference = ((_a = this.viewState.currentTool) === null || _a === void 0 ? void 0 : _a.toolName) === "Difference";
        return this.viewState.isToolOpen && toolIsDifference;
    }
    get active() {
        return this.viewState.terria.showSplitter;
    }
    activate() {
        this.viewState.terria.showSplitter = true;
        super.activate();
    }
    deactivate() {
        this.viewState.terria.showSplitter = false;
        super.deactivate();
    }
}
ToggleSplitterController.id = "split-tool";
__decorate([
    computed
], ToggleSplitterController.prototype, "visible", null);
__decorate([
    computed
], ToggleSplitterController.prototype, "disabled", null);
__decorate([
    computed
], ToggleSplitterController.prototype, "active", null);
__decorate([
    action
], ToggleSplitterController.prototype, "activate", null);
__decorate([
    action
], ToggleSplitterController.prototype, "deactivate", null);
//# sourceMappingURL=ToggleSplitterTool.js.map