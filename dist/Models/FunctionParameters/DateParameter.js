import FunctionParameter from "./FunctionParameter";
export default class DateParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        this.type = "date";
        this.variant = "complex";
    }
    /**
     * Process value so that it can be used in an URL.
     */
    static formatValueForUrl(value) {
        return JSON.stringify({
            type: "object",
            properties: {
                timestamp: {
                    type: "string",
                    format: "date",
                    date: value
                }
            }
        });
    }
}
DateParameter.type = "date";
//# sourceMappingURL=DateParameter.js.map