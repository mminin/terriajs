var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, observable, reaction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import { addMarker, removeMarker } from "../../../Models/LocationMarkerUtils";
import MapInteractionMode, { UIMode } from "../../../Models/MapInteractionMode";
import Loader from "../../Loader";
let LocationPicker = class LocationPicker extends React.Component {
    setupPicker() {
        const { terria, location, onPicking, onPicked } = this.props;
        this.pickMode = new MapInteractionMode({
            message: "",
            messageAsNode: React.createElement("div", null),
            uiMode: UIMode.Difference
        });
        addInteractionModeToMap(terria, this.pickMode);
        if (location)
            showMarker(terria, location);
        this.pickDisposer = reaction(() => this.pickMode.pickedFeatures, action((newPick) => {
            var _a;
            if (newPick === undefined || newPick.pickPosition === undefined) {
                return;
            }
            this.pickMode.customUi = () => (React.createElement(Loader, { message: `Querying ${location ? "new" : ""} position...` }));
            const position = cartesianToDegrees(newPick.pickPosition);
            showMarker(this.props.terria, position);
            this.currentPick = newPick;
            onPicking(position);
            (_a = newPick.allFeaturesAvailablePromise) === null || _a === void 0 ? void 0 : _a.then(() => {
                if (newPick === this.currentPick) {
                    onPicked(newPick, position);
                }
            });
        }));
    }
    destroyPicker() {
        var _a;
        const { terria } = this.props;
        if (this.pickMode) {
            removeInteractionModeFromMap(terria, this.pickMode);
        }
        removeMarker(terria);
        this.pickMode = undefined;
        this.currentPick = undefined;
        (_a = this.pickDisposer) === null || _a === void 0 ? void 0 : _a.call(this);
        this.pickDisposer = undefined;
    }
    componentDidMount() {
        this.setupPicker();
    }
    componentDidUpdate() {
        this.destroyPicker();
        this.setupPicker();
    }
    componentWillUnmount() {
        this.destroyPicker();
    }
    render() {
        return null;
    }
};
__decorate([
    observable
], LocationPicker.prototype, "pickMode", void 0);
__decorate([
    observable
], LocationPicker.prototype, "currentPick", void 0);
__decorate([
    observable
], LocationPicker.prototype, "pickDisposer", void 0);
__decorate([
    action
], LocationPicker.prototype, "setupPicker", null);
__decorate([
    action
], LocationPicker.prototype, "destroyPicker", null);
LocationPicker = __decorate([
    observer
], LocationPicker);
export default LocationPicker;
function addInteractionModeToMap(terria, mode) {
    terria.mapInteractionModeStack.push(mode);
}
function removeInteractionModeFromMap(terria, mode) {
    const [currentMode] = terria.mapInteractionModeStack.slice(-1);
    if (currentMode === mode) {
        terria.mapInteractionModeStack.pop();
    }
}
function showMarker(terria, location) {
    addMarker(terria, {
        name: "User selection",
        location,
        customMarkerIcon: require("../../../../wwwroot/images/difference-pin.png")
    });
}
function cartesianToDegrees(cartesian) {
    const carto = Ellipsoid.WGS84.cartesianToCartographic(cartesian);
    return {
        longitude: CesiumMath.toDegrees(carto.longitude),
        latitude: CesiumMath.toDegrees(carto.latitude)
    };
}
//# sourceMappingURL=LocationPicker.js.map