import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import FunctionParameter from "./FunctionParameter";
const Reproject = require("../../Map/Vector/Reproject");
export default class RectangleParameter extends FunctionParameter {
    constructor(catalogFunction, options) {
        super(catalogFunction, options);
        this.type = "rectangle";
        this.crs = defaultValue(options.crs, Reproject.TERRIA_CRS);
    }
}
RectangleParameter.type = "rectangle";
//# sourceMappingURL=RectangleParameter.js.map