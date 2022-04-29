import Rollbar from "rollbar";
import TerriaError, { TerriaErrorSeverity } from "../../Core/TerriaError";
export default class RollbarErrorServiceProvider {
    /**
     * @param configuration Configuration for the Rollbar instance. See https://docs.rollbar.com/docs/rollbarjs-configuration-reference#context-1
     *
     * Caveat: Rollbar API requests are blocked by some privacy extensions for browsers.
     */
    constructor(configuration) {
        this.rollbar = new Rollbar({
            captureUncaught: true,
            captureUnhandledRejections: true,
            enabled: true,
            ...configuration
        });
    }
    error(error) {
        if (error instanceof TerriaError) {
            if ((typeof error.severity === "function"
                ? error.severity()
                : error.severity) === TerriaErrorSeverity.Error) {
                this.rollbar.error(error.toError());
            }
            else {
                this.rollbar.warning(error.toError());
            }
        }
        else {
            this.rollbar.error(error);
        }
    }
}
//# sourceMappingURL=RollbarErrorServiceProvider.js.map