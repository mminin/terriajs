var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed } from "mobx";
import isDefined from "../../Core/isDefined";
import { GLYPHS } from "../../Styled/Icon";
import MapNavigationItemController from "../../ViewModels/MapNavigation/MapNavigationItemController";
export const FEEDBACK_TOOL_ID = "feedback";
export class FeedbackButtonController extends MapNavigationItemController {
    constructor(viewState) {
        super();
        this.viewState = viewState;
    }
    get glyph() {
        return GLYPHS.feedback;
    }
    get viewerMode() {
        return undefined;
    }
    activate() {
        this.viewState.feedbackFormIsVisible = true;
        super.activate();
    }
    deactivate() {
        this.viewState.feedbackFormIsVisible = false;
        super.deactivate();
    }
    get visible() {
        return (isDefined(this.viewState.terria.configParameters.feedbackUrl) &&
            !this.viewState.hideMapUi &&
            super.visible);
    }
    get active() {
        return this.viewState.feedbackFormIsVisible;
    }
}
__decorate([
    action.bound
], FeedbackButtonController.prototype, "activate", null);
__decorate([
    action.bound
], FeedbackButtonController.prototype, "deactivate", null);
__decorate([
    computed
], FeedbackButtonController.prototype, "visible", null);
__decorate([
    computed
], FeedbackButtonController.prototype, "active", null);
//# sourceMappingURL=FeedbackButtonController.js.map