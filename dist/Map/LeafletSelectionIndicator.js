import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import EasingFunction from "terriajs-cesium/Source/Core/EasingFunction";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import L from "leaflet";
import cesiumRequestAnimationFrame from "terriajs-cesium/Source/Core/requestAnimationFrame";
import isDefined from "../Core/isDefined";
const TweenCollection = require("terriajs-cesium/Source/Scene/TweenCollection")
    .default;
const selectionIndicatorUrl = require("../../wwwroot/images/NM-LocationTarget.svg");
const cartographicScratch = new Cartographic();
export default class LeafletSelectionIndicator {
    constructor(leaflet) {
        this._tweens = new TweenCollection();
        this._selectionIndicatorIsAppearing = false;
        this._tweensAreRunning = false;
        this._leaflet = leaflet;
        this._marker = L.marker([0, 0], {
            icon: L.divIcon({
                className: "",
                html: '<img src="' +
                    selectionIndicatorUrl +
                    '" width="50" height="50" alt="" />',
                iconSize: L.point(50, 50)
            }),
            zIndexOffset: 1,
            interactive: false,
            keyboard: false
        });
        this._marker.addTo(this._leaflet.map);
        this._selectionIndicatorDomElement = this._marker._icon.children[0];
    }
    setLatLng(latlng) {
        this._marker.setLatLng(latlng);
    }
    animateSelectionIndicatorAppear() {
        if (isDefined(this._selectionIndicatorTween)) {
            if (this._selectionIndicatorIsAppearing) {
                // Already appearing; don't restart the animation.
                return;
            }
            this._selectionIndicatorTween.cancelTween();
            this._selectionIndicatorTween = undefined;
        }
        var style = this._selectionIndicatorDomElement.style;
        this._selectionIndicatorIsAppearing = true;
        const that = this;
        this._selectionIndicatorTween = this._tweens.add({
            startObject: {
                scale: 2.0,
                opacity: 0.0,
                rotate: -180
            },
            stopObject: {
                scale: 1.0,
                opacity: 1.0,
                rotate: 0
            },
            duration: 0.8,
            easingFunction: EasingFunction.EXPONENTIAL_OUT,
            update: function (value) {
                style.opacity = value.opacity;
                style.transform =
                    "scale(" + value.scale + ") rotate(" + value.rotate + "deg)";
            },
            complete: function () {
                that._selectionIndicatorTween = undefined;
            },
            cancel: function () {
                that._selectionIndicatorTween = undefined;
            }
        });
        this._startTweens();
    }
    animateSelectionIndicatorDepart() {
        if (isDefined(this._selectionIndicatorTween)) {
            if (!this._selectionIndicatorIsAppearing) {
                // Already disappearing, dont' restart the animation.
                return;
            }
            this._selectionIndicatorTween.cancelTween();
            this._selectionIndicatorTween = undefined;
        }
        var style = this._selectionIndicatorDomElement.style;
        this._selectionIndicatorIsAppearing = false;
        const that = this;
        this._selectionIndicatorTween = this._tweens.add({
            startObject: {
                scale: 1.0,
                opacity: 1.0
            },
            stopObject: {
                scale: 1.5,
                opacity: 0.0
            },
            duration: 0.8,
            easingFunction: EasingFunction.EXPONENTIAL_OUT,
            update: function (value) {
                style.opacity = value.opacity;
                style.transform = "scale(" + value.scale + ") rotate(0deg)";
            },
            complete: function () {
                that._selectionIndicatorTween = undefined;
            },
            cancel: function () {
                that._selectionIndicatorTween = undefined;
            }
        });
        this._startTweens();
    }
    _startTweens() {
        if (this._tweensAreRunning) {
            return;
        }
        var feature = this._leaflet.terria.selectedFeature;
        if (isDefined(feature) && isDefined(feature.position)) {
            var cartographic = Ellipsoid.WGS84.cartesianToCartographic(feature.position.getValue(this._leaflet.terria.timelineClock.currentTime), cartographicScratch);
            this._marker.setLatLng([
                CesiumMath.toDegrees(cartographic.latitude),
                CesiumMath.toDegrees(cartographic.longitude)
            ]);
        }
        if (this._tweens.length > 0) {
            this._tweens.update();
        }
        if (this._tweens.length !== 0 ||
            (isDefined(feature) && isDefined(feature.position))) {
            cesiumRequestAnimationFrame(() => {
                this._startTweens();
            });
        }
    }
}
//# sourceMappingURL=LeafletSelectionIndicator.js.map