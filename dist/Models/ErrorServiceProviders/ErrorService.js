/**
 * Asynchronously loads and returns an error service provider instance for the given options.
 */
export async function initializeErrorServiceProvider(options) {
    const provider = options === null || options === void 0 ? void 0 : options.provider;
    const configuration = options === null || options === void 0 ? void 0 : options.configuration;
    if (provider === "rollbar") {
        const rollbarModule = await import("./RollbarErrorServiceProvider");
        const rollbarProvider = new rollbarModule.default(configuration);
        return rollbarProvider;
    }
    else {
        throw new Error(`Unknown error service provider: ${provider}`);
    }
}
//# sourceMappingURL=ErrorService.js.map