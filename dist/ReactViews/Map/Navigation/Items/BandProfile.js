var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import { action } from "mobx";
import { GLYPHS } from "../../../../Styled/Icon";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";
class BandProfile extends MapNavigationItemController {
    constructor(viewState) {
        super();
        this.viewState = viewState;
        this.itemRef = React.createRef();
    }
    get glyph() {
        if (this.viewState.bandProfileActive) {
            return GLYPHS.bandOn;
        }
        return GLYPHS.band;
    }
    get viewerMode() {
        return undefined;
    }
    activate() {
        this.viewState.bandProfileActive = true;
        super.activate();
    }
    deactivate() {
        this.viewState.bandProfileActive = false;
        super.deactivate();
    }
    isActive() {
        return this.active;
    }
    handleClick() {
        if (this.active) {
            this.deactivate();
        }
        else {
            this.activate();
        }
    }
}
BandProfile.id = "band-profile";
BandProfile.displayName = "BandProfile";
__decorate([
    action
], BandProfile.prototype, "activate", null);
__decorate([
    action
], BandProfile.prototype, "deactivate", null);
export default BandProfile;
//# sourceMappingURL=BandProfile.js.map