import CesiumEvent from "terriajs-cesium/Source/Core/Event";
export default class LeafletScene {
    constructor(map) {
        this.featureClicked = new CesiumEvent();
        this.featureMousedown = new CesiumEvent();
        this.map = map;
    }
}
//# sourceMappingURL=LeafletScene.js.map