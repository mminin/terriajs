var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import HeadingPitchRoll from "terriajs-cesium/Source/Core/HeadingPitchRoll";
import Transforms from "terriajs-cesium/Source/Core/Transforms";
import ConstantPositionProperty from "terriajs-cesium/Source/DataSources/ConstantPositionProperty";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import ModelGraphics from "terriajs-cesium/Source/DataSources/ModelGraphics";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import proxyCatalogItemUrl from "../Models/Catalog/proxyCatalogItemUrl";
import CatalogMemberMixin from "./CatalogMemberMixin";
import MappableMixin from "./MappableMixin";
import ShadowMixin from "./ShadowMixin";
// We want TS to look at the type declared in lib/ThirdParty/terriajs-cesium-extra/index.d.ts
// and import doesn't allows us to do that, so instead we use require + type casting to ensure
// we still maintain the type checking, without TS screaming with errors
const Axis = require("terriajs-cesium/Source/Scene/Axis").default;
function GltfMixin(Base) {
    class GltfMixin extends ShadowMixin(CatalogMemberMixin(MappableMixin(Base))) {
        constructor() {
            super(...arguments);
            // Create stable instances of DataSource and Entity instead
            // of generating a new one each time the traits change and mobx recomputes.
            // This vastly improves the performance.
            //
            // Note that these are private instances and must not be modified outside the Mixin
            this._dataSource = new CustomDataSource("glTF Model");
            this._modelEntity = new Entity({ name: "glTF Model Entity" });
        }
        get hasGltfMixin() {
            return true;
        }
        get disableZoomTo() {
            const { latitude, longitude, height } = this.origin;
            return (latitude === undefined ||
                longitude === undefined ||
                height === undefined);
        }
        get cesiumUpAxis() {
            if (this.upAxis === undefined) {
                return Axis.Y;
            }
            return Axis.fromName(this.upAxis);
        }
        get cesiumForwardAxis() {
            if (this.forwardAxis === undefined) {
                return Axis.Z;
            }
            return Axis.fromName(this.forwardAxis);
        }
        get cesiumHeightReference() {
            const heightReference = 
            // @ts-ignore
            HeightReference[this.heightReference] || HeightReference.NONE;
            return heightReference;
        }
        get cesiumPosition() {
            if (this.origin !== undefined &&
                this.origin.longitude !== undefined &&
                this.origin.latitude !== undefined &&
                this.origin.height !== undefined) {
                return Cartesian3.fromDegrees(this.origin.longitude, this.origin.latitude, this.origin.height);
            }
            else {
                return Cartesian3.ZERO;
            }
        }
        /**
         * Returns the orientation of the model in the ECEF frame
         */
        get cesiumRotation() {
            const { heading = 0, pitch = 0, roll = 0 } = this.rotation;
            const hpr = HeadingPitchRoll.fromDegrees(heading, pitch, roll);
            const rotation = Transforms.headingPitchRollQuaternion(this.cesiumPosition, hpr);
            return rotation;
        }
        get transformationJson() {
            return {
                origin: {
                    latitude: this.origin.latitude,
                    longitude: this.origin.longitude,
                    height: this.origin.height
                },
                rotation: {
                    heading: this.rotation.heading,
                    pitch: this.rotation.pitch,
                    roll: this.rotation.roll
                },
                scale: this.scale
            };
        }
        get modelGraphics() {
            if (this.gltfModelUrl === undefined) {
                return undefined;
            }
            const options = {
                uri: new ConstantProperty(proxyCatalogItemUrl(this, this.gltfModelUrl)),
                upAxis: new ConstantProperty(this.cesiumUpAxis),
                forwardAxis: new ConstantProperty(this.cesiumForwardAxis),
                scale: new ConstantProperty(this.scale !== undefined ? this.scale : 1),
                shadows: new ConstantProperty(this.cesiumShadows),
                heightReference: new ConstantProperty(this.cesiumHeightReference)
            };
            return new ModelGraphics(options);
        }
        forceLoadMetadata() {
            return Promise.resolve();
        }
        forceLoadMapItems() {
            return Promise.resolve();
        }
        get shortReport() {
            if (this.terria.currentViewer.type === "Leaflet") {
                return i18next.t("models.commonModelErrors.3dTypeIn2dMode", this);
            }
            return super.shortReport;
        }
        get modelEntity() {
            const entity = this._modelEntity;
            entity.position = new ConstantPositionProperty(this.cesiumPosition);
            entity.orientation = new ConstantProperty(this.cesiumRotation);
            entity.model = this.modelGraphics;
            return entity;
        }
        get mapItems() {
            const modelEntity = this.modelEntity;
            const modelGraphics = this.modelGraphics;
            const dataSource = this._dataSource;
            if (modelGraphics === undefined) {
                return [];
            }
            dataSource.show = this.show;
            if (modelGraphics)
                modelGraphics.show = new ConstantProperty(this.show);
            if (this.name) {
                dataSource.name = this.name;
                modelEntity.name = this.name;
            }
            if (!dataSource.entities.contains(modelEntity)) {
                dataSource.entities.add(modelEntity);
            }
            return [dataSource];
        }
    }
    __decorate([
        computed
    ], GltfMixin.prototype, "disableZoomTo", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumUpAxis", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumForwardAxis", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumHeightReference", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumPosition", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "cesiumRotation", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "transformationJson", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "modelGraphics", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "shortReport", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "modelEntity", null);
    __decorate([
        computed
    ], GltfMixin.prototype, "mapItems", null);
    return GltfMixin;
}
(function (GltfMixin) {
    function isMixedInto(model) {
        return model && model.hasGltfMixin;
    }
    GltfMixin.isMixedInto = isMixedInto;
})(GltfMixin || (GltfMixin = {}));
export default GltfMixin;
//# sourceMappingURL=GltfMixin.js.map