import FunctionParameter from "./FunctionParameter";
export default class StringParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        this.type = "string";
    }
}
StringParameter.type = "string";
//# sourceMappingURL=StringParameter.js.map