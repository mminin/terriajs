var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, observable, runInAction } from "mobx";
import React from "react";
import CesiumCartographic from "terriajs-cesium/Source/Core/Cartographic";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import isDefined from "../../../../Core/isDefined";
import TerriaError from "../../../../Core/TerriaError";
import GeoJsonCatalogItem from "../../../../Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import CommonStrata from "../../../../Models/Definition/CommonStrata";
import createStratumInstance from "../../../../Models/Definition/createStratumInstance";
import { GLYPHS } from "../../../../Styled/Icon";
import StyleTraits from "../../../../Traits/TraitsClasses/StyleTraits";
import MapNavigationItemController from "../../../../ViewModels/MapNavigation/MapNavigationItemController";
class MyLocation extends MapNavigationItemController {
    constructor(props) {
        super();
        this.itemRef = React.createRef();
        this.terria = props.terria;
        this._marker = new GeoJsonCatalogItem(createGuid(), props.terria);
        this.zoomToMyLocation = this.zoomToMyLocation.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
        this.augmentedVirtualityEnabled = this.augmentedVirtualityEnabled.bind(this);
        this.followMeEnabled = this.followMeEnabled.bind(this);
    }
    get glyph() {
        return GLYPHS.geolocationThick;
    }
    get viewerMode() {
        return undefined;
    }
    getLocation() {
        const t = i18next.t.bind(i18next);
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            if (!this.augmentedVirtualityEnabled()) {
                // When Augmented Virtuality is not enabled then just get a single position update.
                navigator.geolocation.getCurrentPosition(this.zoomToMyLocation, this.handleLocationError, options);
            }
            else {
                // When Augmented Virtuality is enabled then we effectively toggle into watch mode and the position is repeatedly updated.
                this.watchId = navigator.geolocation.watchPosition(this.zoomToMyLocation, this.handleLocationError, options);
            }
        }
        else {
            this.terria.raiseErrorToUser(new TerriaError({
                sender: this,
                title: t("location.errorGettingLocation"),
                message: t("location.browserCannotProvide")
            }));
        }
    }
    zoomToMyLocation(position) {
        const t = i18next.t.bind(i18next);
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        if (this.augmentedVirtualityEnabled()) {
            // Note: Specifying the value of 27500m here enables this function to approximately mimic the behaviour of
            //       the else case from the cameras initial view and when the viewer pan/zooms out to much.
            // We use the flag variable flown so that the user is flown to the current location when this function is
            // first fired, but subsequently the updates are jump location moves, since we assume that the movements are
            // small and flyTo performs badly when the increments are small (slow and unresponsive).
            this.terria.augmentedVirtuality.moveTo(CesiumCartographic.fromDegrees(longitude, latitude), 27500, !isDefined(this.flown));
            this.flown = true;
        }
        else {
            // west, south, east, north, result
            const rectangle = Rectangle.fromDegrees(longitude - 0.1, latitude - 0.1, longitude + 0.1, latitude + 0.1);
            this.terria.currentViewer.zoomTo(rectangle);
        }
        runInAction(() => {
            const name = t("location.myLocation");
            this._marker.setTrait(CommonStrata.user, "name", name);
            this._marker.setTrait(CommonStrata.user, "geoJsonData", {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                properties: {
                    title: t("location.location"),
                    longitude: longitude,
                    latitude: latitude
                }
            });
            this._marker.setTrait(CommonStrata.user, "style", createStratumInstance(StyleTraits, {
                "marker-size": "25",
                "marker-color": "#08ABD5",
                stroke: "#ffffff",
                "stroke-width": 3
            }));
            this.terria.workbench.add(this._marker);
        });
    }
    handleLocationError(err) {
        const t = i18next.t.bind(i18next);
        let message = err.message;
        if (message && message.indexOf("Only secure origins are allowed") === 0) {
            // This is actually the recommended way to check for this error.
            // https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only
            const uri = new URI(window.location);
            const secureUrl = uri.protocol("https").toString();
            message = t("location.originError", { secureUrl: secureUrl });
        }
        this.terria.raiseErrorToUser(new TerriaError({
            sender: this,
            title: t("location.errorGettingLocation"),
            message: message
        }));
    }
    augmentedVirtualityEnabled() {
        return (isDefined(this.terria.augmentedVirtuality) &&
            this.terria.augmentedVirtuality.enabled);
    }
    followMeEnabled() {
        return !!isDefined(this.watchId);
    }
    disableFollowMe() {
        if (isDefined(this.watchId)) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = undefined;
            this.flown = undefined;
        }
    }
    handleClick() {
        if (this.followMeEnabled()) {
            this.disableFollowMe();
        }
        else {
            this.getLocation();
        }
    }
}
MyLocation.id = "my-location";
MyLocation.displayName = "MyLocation";
__decorate([
    observable
], MyLocation.prototype, "watchId", void 0);
__decorate([
    observable
], MyLocation.prototype, "flown", void 0);
__decorate([
    action.bound
], MyLocation.prototype, "getLocation", null);
__decorate([
    action.bound
], MyLocation.prototype, "disableFollowMe", null);
export default MyLocation;
//# sourceMappingURL=MyLocation.js.map