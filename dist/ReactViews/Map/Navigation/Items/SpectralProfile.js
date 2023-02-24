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
export let spectralActive = false;
export function setSpectralActive(val) {
    spectralActive = val;
}
export function spectralApiRequest(imageName, latitude, longitude, that) {
    let link = "http://10.72.254.130:5000/get-spectra/?";
    let params = {
        image_id: imageName,
        lat: latitude,
        lon: longitude,
    };
    Object.entries(params).forEach(([key, value]) => {
        console.log(key, value);
        link = link.concat(key, "=", value, "&");
    });
    link = link.slice(0, -1);
    console.log(link);
    fetch(link)
        .then(response => response.json())
        .then(data => {
        console.log("api req:", data);
        that.props.viewState.setSpectralX(data.X);
        that.props.viewState.setSpectralY(data.Y);
        console.log("api x:", that.props.viewState.spectralX);
        console.log("api y:", that.props.viewState.spectralY);
        return data;
    });
}
class SpectralProfile extends MapNavigationItemController {
    constructor(viewState) {
        super();
        this.viewState = viewState;
        this.itemRef = React.createRef();
        setSpectralActive(this.active);
    }
    get glyph() {
        if (spectralActive) {
            return GLYPHS.spectralOn;
        }
        return GLYPHS.spectral;
    }
    get viewerMode() {
        return undefined;
    }
    activate() {
        setSpectralActive(true);
        this.viewState.spectralProfileActive = true;
        console.log("activating");
        super.activate();
    }
    deactivate() {
        setSpectralActive(false);
        this.viewState.spectralProfileActive = false;
        console.log("deactivating");
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
SpectralProfile.id = "spectral-profile";
SpectralProfile.displayName = "SpectralProfile";
__decorate([
    action
], SpectralProfile.prototype, "activate", null);
__decorate([
    action
], SpectralProfile.prototype, "deactivate", null);
export default SpectralProfile;
//# sourceMappingURL=SpectralProfile.js.map