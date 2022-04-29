import FunctionParameter from "./FunctionParameter";
export default class RegionParameter extends FunctionParameter {
    constructor(catalogFunction, options) {
        super(catalogFunction, options);
        this.type = "region";
        this.regionProvider = options.regionProvider;
    }
}
RegionParameter.type = "region";
//# sourceMappingURL=RegionParameter.js.map