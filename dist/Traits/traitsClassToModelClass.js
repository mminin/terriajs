import memoize from "lodash-es/memoize";
import CreateModel from "../Models/Definition/CreateModel";
// Unlike other places, we use lodash-es/memoize instead of `createTransformer`
// to memoize because this method is called during model class definition stage
// (check objectTrait & objectArrayTrait) and it will always be run outside an
// `autorun` or an `observer`. Therefore, thecall to `createTransformer` will
// not memoize and logs a warning.
const traitsClassToModelClass = memoize(function (traitsClass) {
    return CreateModel(traitsClass);
});
export default traitsClassToModelClass;
//# sourceMappingURL=traitsClassToModelClass.js.map