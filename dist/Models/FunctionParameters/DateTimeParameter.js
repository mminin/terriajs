import FunctionParameter from "./FunctionParameter";
export default class DateTimeParameter extends FunctionParameter {
    constructor() {
        super(...arguments);
        this.type = "dateTime";
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
                    format: "date-time",
                    "date-time": value
                }
            }
        });
    }
}
DateTimeParameter.type = "dateTime";
//# sourceMappingURL=DateTimeParameter.js.map