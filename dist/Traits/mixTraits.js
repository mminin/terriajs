import ModelTraits from "./ModelTraits";
import filterOutUndefined from "../Core/filterOutUndefined";
/**
 * Mixes together traits classes to produce a new traits class.
 * @param Traits1
 * @param Traits2
 * @param Traits3
 * @param Traits4
 * @param Traits5
 * @param Traits6
 * @param Traits7
 * @param Traits8
 * @param Traits9
 * @param Traits10
 * @param Traits11
 * @param Traits12
 */
export default function mixTraits(Traits1, Traits2, Traits3, Traits4, Traits5, Traits6, Traits7, Traits8, Traits9, Traits10, Traits11, Traits12) {
    const traitsClasses = filterOutUndefined([
        Traits1,
        Traits2,
        Traits3,
        Traits4,
        Traits5,
        Traits6,
        Traits7,
        Traits8,
        Traits9,
        Traits10,
        Traits11,
        Traits12
    ]);
    const traitsInstances = traitsClasses.map(TraitsClass => new TraitsClass());
    const keysValues = traitsInstances.reduce((result, traitsInstance) => {
        return result.concat(Object.keys(traitsInstance).map(property => ({
            key: property,
            value: traitsInstance[property]
        })));
    }, []);
    class Mixed extends ModelTraits {
        constructor() {
            super();
            keysValues.forEach(kv => {
                this[kv.key] = kv.value;
            });
        }
    }
    Mixed.traits = {};
    traitsClasses.forEach(traitsClass => {
        Object.keys(traitsClass.traits).forEach(trait => {
            Mixed.traits[trait] = traitsClass.traits[trait];
        });
    });
    return Mixed;
}
//# sourceMappingURL=mixTraits.js.map