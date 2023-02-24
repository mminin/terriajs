export default function saveStratumToJson(traits, stratum) {
    const stratumAny = stratum;
    const result = {};
    Object.keys(traits).forEach((traitId) => {
        const trait = traits[traitId];
        const value = stratumAny[traitId];
        const jsonValue = trait.toJson(value);
        if (jsonValue !== undefined) {
            result[traitId] = jsonValue;
        }
    });
    return result;
}
//# sourceMappingURL=saveStratumToJson.js.map