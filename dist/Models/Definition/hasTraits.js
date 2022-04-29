function hasTraits(model, TraitsClass, ...traits) {
    if (model === undefined || model.traits === undefined) {
        return false;
    }
    for (const trait of traits) {
        const modelTrait = model.traits[trait];
        const traitsTrait = TraitsClass.traits[trait];
        if (modelTrait === undefined || traitsTrait === undefined) {
            return false;
        }
        if (!traitsTrait.isSameType(modelTrait)) {
            return false;
        }
    }
    return true;
}
export default hasTraits;
//# sourceMappingURL=hasTraits.js.map