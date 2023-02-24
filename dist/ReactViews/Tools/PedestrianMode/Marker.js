import BillboardGraphics from "terriajs-cesium/Source/DataSources/BillboardGraphics";
import CallbackProperty from "terriajs-cesium/Source/DataSources/CallbackProperty";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import CreateModel from "../../../Models/Definition/CreateModel";
import MappableTraits from "../../../Traits/TraitsClasses/MappableTraits";
export default class Marker extends MappableMixin(CreateModel(MappableTraits)) {
    /**
     * @param terria Terria instance
     * @param iconUrl An HTML image element to use as the marker icon
     * @param position Initial position of the marker icon
     * @param rotation Initial rotation of the marker icon
     */
    constructor(terria, iconUrl, position, rotation) {
        super(undefined, terria);
        this.terria = terria;
        this.iconUrl = iconUrl;
        this.currentRotation = 0;
        this.position = position;
        this.dataSource = new CustomDataSource();
        this.icon = new RotatableIcon(iconUrl, 24, 24);
        this.icon.loadPromise.then(() => this.icon.rotate(rotation));
        const entity = new Entity({
            billboard: new BillboardGraphics({
                image: this.icon.canvas
            }),
            position: new CallbackProperty(() => this.position, false)
        });
        this.dataSource.entities.add(entity);
    }
    /**
     * Set marker rotation in radians
     */
    set rotation(rotation) {
        // round to 2 decimal places to minimize rotation updates
        const newRotation = Math.round(rotation * 100) / 100;
        if (this.currentRotation !== newRotation) {
            this.icon.rotate(newRotation);
            this.currentRotation = newRotation;
        }
    }
    async forceLoadMapItems() { }
    get mapItems() {
        return [this.dataSource];
    }
}
/**
 * A dynamically rotatable icon
 *
 * This class provides a {@canvas} instance with the rotated image drawn on it.
 * The canvas instance can be used as an image parameter in Billboard graphics
 * or other entities drawn by Cesium/Leaflet instances.
 */
class RotatableIcon {
    /**
     * @param iconUrl The url of the icon image
     * @param width Optional icon width.
     *              If given, the image will be scaled to this width
     *              otherwise we use the image width.
     * @param height Optional icon height.
     *              If given, the image will be scaled to this height
     *              otherwise we use the image height.
     */
    constructor(iconUrl, width, height) {
        var _a;
        this.image = new Image();
        this.canvas = document.createElement("canvas");
        this.ctx = (_a = this.canvas.getContext("2d")) !== null && _a !== void 0 ? _a : undefined;
        this.image.src = iconUrl;
        this.loadPromise = new Promise((resolve) => {
            this.image.addEventListener("load", () => {
                this.canvas.width = width !== null && width !== void 0 ? width : this.image.width;
                this.canvas.height = height !== null && height !== void 0 ? height : this.image.height;
                resolve();
            });
        });
    }
    /**
     * Rotate the icon by the given angle
     *
     * @param rotation Angle in radians
     */
    rotate(rotation) {
        if (this.ctx === undefined || this.image.complete === false) {
            return;
        }
        const image = this.image;
        const ctx = this.ctx;
        const canvas = this.canvas;
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // translate so that we rotate about the image center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation);
        ctx.drawImage(image, 
        // x & y coordinate to draw the image relative to the translated center
        -canvas.width / 2, -canvas.height / 2, 
        // scales the image to fit the canvas width & height
        canvas.width, canvas.height);
        ctx.restore();
    }
}
//# sourceMappingURL=Marker.js.map