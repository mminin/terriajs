var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import ShadowTraits from "./ShadowTraits";
import TransformationTraits from "./TransformationTraits";
export default class GltfTraits extends mixTraits(MappableTraits, TransformationTraits, ShadowTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.heightReference = "NONE";
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Up axis",
        description: "The model's up-axis. By default models are y-up according to the glTF spec, however geo-referenced models will typically be z-up. Valid values are 'X', 'Y', or 'Z'."
    })
], GltfTraits.prototype, "upAxis", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Forward axis",
        description: "The model's forward axis. By default, glTF 2.0 models are Z-forward according to the glTF spec, however older glTF (1.0, 0.8) models used X-forward. Valid values are 'X' or 'Z'."
    })
], GltfTraits.prototype, "forwardAxis", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Height reference",
        description: "Position relative to the ground. Accepted values are NONE, CLAMP_TO_GROUND & RELATIVE_TO_GROUND as described in the cesium doc - https://cesium.com/docs/cesiumjs-ref-doc/global.html#HeightReference"
    })
], GltfTraits.prototype, "heightReference", void 0);
//# sourceMappingURL=GltfTraits.js.map