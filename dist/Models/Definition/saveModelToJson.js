import saveStratumToJson from "./saveStratumToJson";
export default function saveModelToJson(model, options = {}) {
    const includeStrata = options.includeStrata
        ? options.includeStrata
        : Array.from(model.strata.keys());
    const excludeStrata = options.excludeStrata ? options.excludeStrata : [];
    const strata = includeStrata.filter((stratum) => excludeStrata.indexOf(stratum) < 0);
    const result = {};
    strata.forEach((stratumId) => {
        const stratum = model.strata.get(stratumId);
        if (stratum === undefined) {
            return;
        }
        result[stratumId] = saveStratumToJson(model.traits, stratum);
    });
    if (model.uniqueId !== undefined) {
        // TODO: should the JSON property be named `uniqueId` too?
        result.id = model.uniqueId;
    }
    result.type = model.type;
    return result;
}
//# sourceMappingURL=saveModelToJson.js.map