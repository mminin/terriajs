var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, toJS } from "mobx";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import clone from "terriajs-cesium/Source/Core/clone";
import Color from "terriajs-cesium/Source/Core/Color";
import HeadingPitchRoll from "terriajs-cesium/Source/Core/HeadingPitchRoll";
import Matrix3 from "terriajs-cesium/Source/Core/Matrix3";
import Matrix4 from "terriajs-cesium/Source/Core/Matrix4";
import Transforms from "terriajs-cesium/Source/Core/Transforms";
import ClippingPlane from "terriajs-cesium/Source/Scene/ClippingPlane";
import ClippingPlaneCollection from "terriajs-cesium/Source/Scene/ClippingPlaneCollection";
import filterOutUndefined from "../Core/filterOutUndefined";
import BoxDrawing from "../Models/BoxDrawing";
import CommonStrata from "../Models/Definition/CommonStrata";
import updateModelFromJson from "../Models/Definition/updateModelFromJson";
import HeadingPitchRollTraits from "../Traits/TraitsClasses/HeadingPitchRollTraits";
import LatLonHeightTraits from "../Traits/TraitsClasses/LatLonHeightTraits";
function ClippingMixin(Base) {
    class MixedClass extends Base {
        constructor() {
            super(...arguments);
            this.clippingPlaneModelMatrix = Matrix4.IDENTITY.clone();
        }
        get inverseClippingPlanesOriginMatrix() {
            return Matrix4.inverse(this.clippingPlanesOriginMatrix(), new Matrix4());
        }
        get simpleClippingPlaneCollection() {
            if (!this.clippingPlanes) {
                return;
            }
            if (this.clippingPlanes.planes.length == 0) {
                return;
            }
            const { planes, enabled = true, unionClippingRegions = false, edgeColor, edgeWidth, modelMatrix } = this.clippingPlanes;
            const planesMapped = planes.map((plane) => {
                return new ClippingPlane(Cartesian3.fromArray(plane.normal || []), plane.distance);
            });
            let options = {
                planes: planesMapped,
                enabled,
                unionClippingRegions
            };
            if (edgeColor && edgeColor.length > 0) {
                options = Object.assign(options, {
                    edgeColor: Color.fromCssColorString(edgeColor) || Color.WHITE
                });
            }
            if (edgeWidth && edgeWidth > 0) {
                options = Object.assign(options, { edgeWidth: edgeWidth });
            }
            if (modelMatrix && modelMatrix.length > 0) {
                const array = clone(toJS(modelMatrix));
                options = Object.assign(options, {
                    modelMatrix: Matrix4.fromArray(array) || Matrix4.IDENTITY
                });
            }
            return new ClippingPlaneCollection(options);
        }
        get clippingBoxPlaneCollection() {
            if (!this.clippingBox.enableFeature) {
                return;
            }
            const clipDirection = this.clippingBox.clipDirection === "inside" ? -1 : 1;
            const planes = BoxDrawing.localSidePlanes.map((plane) => {
                return new ClippingPlane(plane.normal, plane.distance * clipDirection);
            });
            const clippingPlaneCollection = new ClippingPlaneCollection({
                planes,
                unionClippingRegions: this.clippingBox.clipDirection === "outside",
                enabled: this.clippingBox.clipModel
            });
            clippingPlaneCollection.modelMatrix = this.clippingPlaneModelMatrix;
            return clippingPlaneCollection;
        }
        get clippingPlaneCollection() {
            var _a;
            return ((_a = this.simpleClippingPlaneCollection) !== null && _a !== void 0 ? _a : this.clippingBoxPlaneCollection);
        }
        get clippingMapItems() {
            var _a;
            return filterOutUndefined([(_a = this.clippingBoxDrawing) === null || _a === void 0 ? void 0 : _a.dataSource]);
        }
        get clippingBoxDrawing() {
            var _a, _b, _c;
            const options = this.clippingBox;
            const cesium = this.terria.cesium;
            if (!cesium ||
                !options.enableFeature ||
                !options.clipModel ||
                !options.showClippingBox) {
                if (this._clippingBoxDrawing) {
                    this._clippingBoxDrawing = undefined;
                }
                return;
            }
            const clippingPlanesOriginMatrix = this.clippingPlanesOriginMatrix();
            const dimensions = new Cartesian3((_a = this.clippingBox.dimensions.length) !== null && _a !== void 0 ? _a : 100, (_b = this.clippingBox.dimensions.width) !== null && _b !== void 0 ? _b : 100, (_c = this.clippingBox.dimensions.height) !== null && _c !== void 0 ? _c : 100);
            let position = LatLonHeightTraits.toCartesian(this.clippingBox.position);
            if (!position) {
                // Use clipping plane origin as position but height set to 0 so that the box is grounded.
                const cartographic = Cartographic.fromCartesian(Matrix4.getTranslation(clippingPlanesOriginMatrix, new Cartesian3()));
                cartographic.height = dimensions.z / 2;
                position = Cartographic.toCartesian(cartographic, cesium.scene.globe.ellipsoid, new Cartesian3());
            }
            let hpr;
            if (this.clippingBox.rotation.heading !== undefined &&
                this.clippingBox.rotation.pitch !== undefined &&
                this.clippingBox.rotation.roll !== undefined) {
                hpr = HeadingPitchRoll.fromDegrees(this.clippingBox.rotation.heading, this.clippingBox.rotation.pitch, this.clippingBox.rotation.roll);
            }
            const boxTransform = Matrix4.multiply(hpr
                ? Matrix4.fromRotationTranslation(Matrix3.fromHeadingPitchRoll(hpr), position)
                : Transforms.eastNorthUpToFixedFrame(position), Matrix4.fromScale(dimensions, new Matrix4()), new Matrix4());
            Matrix4.multiply(this.inverseClippingPlanesOriginMatrix, boxTransform, this.clippingPlaneModelMatrix);
            if (this._clippingBoxDrawing) {
                this._clippingBoxDrawing.setTransform(boxTransform);
                this._clippingBoxDrawing.keepBoxAboveGround =
                    this.clippingBox.keepBoxAboveGround;
            }
            else {
                this._clippingBoxDrawing = BoxDrawing.fromTransform(cesium, boxTransform, {
                    keepBoxAboveGround: this.clippingBox.keepBoxAboveGround,
                    onChange: action(({ modelMatrix, isFinished }) => {
                        Matrix4.multiply(this.inverseClippingPlanesOriginMatrix, modelMatrix, this.clippingPlaneModelMatrix);
                        if (isFinished) {
                            const position = Matrix4.getTranslation(modelMatrix, new Cartesian3());
                            LatLonHeightTraits.setFromCartesian(this.clippingBox.position, CommonStrata.user, position);
                            const dimensions = Matrix4.getScale(modelMatrix, new Cartesian3());
                            updateModelFromJson(this.clippingBox.dimensions, CommonStrata.user, {
                                length: dimensions.x,
                                width: dimensions.y,
                                height: dimensions.z
                            }).logError("Failed to update clipping box dimensions");
                            const rotationMatrix = Matrix3.getRotation(Matrix4.getMatrix3(modelMatrix, new Matrix3()), new Matrix3());
                            HeadingPitchRollTraits.setFromRotationMatrix(this.clippingBox.rotation, CommonStrata.user, rotationMatrix);
                        }
                    })
                });
            }
            return this._clippingBoxDrawing;
        }
        get selectableDimensions() {
            if (!this.clippingBox.enableFeature) {
                return super.selectableDimensions;
            }
            return [
                ...super.selectableDimensions,
                {
                    type: "checkbox-group",
                    id: "clipping-box",
                    selectedId: this.clippingBox.clipModel ? "true" : "false",
                    options: [
                        {
                            id: "true",
                            name: i18next.t("models.clippingBox.clipModel")
                        },
                        {
                            id: "false",
                            name: i18next.t("models.clippingBox.clipModel")
                        }
                    ],
                    setDimensionValue: (stratumId, value) => {
                        this.clippingBox.setTrait(stratumId, "clipModel", value === "true");
                    },
                    selectableDimensions: [
                        {
                            id: "show-clip-editor-ui",
                            type: "checkbox",
                            selectedId: this.clippingBox.showClippingBox ? "true" : "false",
                            disable: this.clippingBox.clipModel === false,
                            options: [
                                {
                                    id: "true",
                                    name: i18next.t("models.clippingBox.showClippingBox")
                                },
                                {
                                    id: "false",
                                    name: i18next.t("models.clippingBox.showClippingBox")
                                }
                            ],
                            setDimensionValue: (stratumId, value) => {
                                this.clippingBox.setTrait(stratumId, "showClippingBox", value === "true");
                            }
                        },
                        {
                            id: "clamp-box-to-ground",
                            type: "checkbox",
                            selectedId: this.clippingBox.keepBoxAboveGround
                                ? "true"
                                : "false",
                            disable: this.clippingBox.clipModel === false ||
                                this.clippingBox.showClippingBox === false,
                            options: [
                                {
                                    id: "true",
                                    name: i18next.t("models.clippingBox.keepBoxAboveGround")
                                },
                                {
                                    id: "false",
                                    name: i18next.t("models.clippingBox.keepBoxAboveGround")
                                }
                            ],
                            setDimensionValue: (stratumId, value) => {
                                this.clippingBox.setTrait(stratumId, "keepBoxAboveGround", value === "true");
                            }
                        },
                        {
                            id: "clip-direction",
                            name: i18next.t("models.clippingBox.clipDirection.name"),
                            type: "select",
                            selectedId: this.clippingBox.clipDirection,
                            disable: this.clippingBox.clipModel === false,
                            options: [
                                {
                                    id: "inside",
                                    name: i18next.t("models.clippingBox.clipDirection.options.inside")
                                },
                                {
                                    id: "outside",
                                    name: i18next.t("models.clippingBox.clipDirection.options.outside")
                                }
                            ],
                            setDimensionValue: (stratumId, value) => {
                                this.clippingBox.setTrait(stratumId, "clipDirection", value);
                            }
                        }
                    ]
                }
            ];
        }
    }
    __decorate([
        computed
    ], MixedClass.prototype, "inverseClippingPlanesOriginMatrix", null);
    __decorate([
        computed
    ], MixedClass.prototype, "simpleClippingPlaneCollection", null);
    __decorate([
        computed
    ], MixedClass.prototype, "clippingBoxPlaneCollection", null);
    __decorate([
        computed
    ], MixedClass.prototype, "clippingPlaneCollection", null);
    __decorate([
        computed
    ], MixedClass.prototype, "clippingMapItems", null);
    __decorate([
        computed
    ], MixedClass.prototype, "clippingBoxDrawing", null);
    __decorate([
        computed
    ], MixedClass.prototype, "selectableDimensions", null);
    return MixedClass;
}
export default ClippingMixin;
//# sourceMappingURL=ClippingMixin.js.map