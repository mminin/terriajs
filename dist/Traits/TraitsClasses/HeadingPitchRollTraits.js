var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import Quaternion from "terriajs-cesium/Source/Core/Quaternion";
import HeadingPitchRoll from "terriajs-cesium/Source/Core/HeadingPitchRoll";
import updateModelFromJson from "../../Models/Definition/updateModelFromJson";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
// Scratch variables used to avoid repeated object instantiation
const hprScratch = new HeadingPitchRoll();
const quaternionScratch = new Quaternion();
export default class HeadingPitchRollTraits extends ModelTraits {
    static setFromRotationMatrix(model, stratumId, rotation) {
        this.setFromHeadingPitchRoll(model, stratumId, HeadingPitchRoll.fromQuaternion(Quaternion.fromRotationMatrix(rotation, quaternionScratch), hprScratch));
    }
    static setFromQuaternion(model, stratumId, rotation) {
        this.setFromHeadingPitchRoll(model, stratumId, HeadingPitchRoll.fromQuaternion(rotation, hprScratch));
    }
    static setFromHeadingPitchRoll(model, stratumId, hpr) {
        updateModelFromJson(model, stratumId, {
            heading: CesiumMath.toDegrees(hpr.heading),
            pitch: CesiumMath.toDegrees(hpr.pitch),
            roll: CesiumMath.toDegrees(hpr.roll)
        }).logError("Error ocurred while setting heading, pitch and roll");
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Heading",
        description: "Heading in degrees"
    })
], HeadingPitchRollTraits.prototype, "heading", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Pitch",
        description: "Pitch in degrees"
    })
], HeadingPitchRollTraits.prototype, "pitch", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Roll",
        description: "Roll in degrees"
    })
], HeadingPitchRollTraits.prototype, "roll", void 0);
//# sourceMappingURL=HeadingPitchRollTraits.js.map