import { runInAction, toJS } from "mobx";
import isDefined from "../Core/isDefined";
import TerriaError from "../Core/TerriaError";
import CommonStrata from "../Models/Definition/CommonStrata";
import CatalogFunctionJobMixin from "./CatalogFunctionJobMixin";
import CatalogMemberMixin from "./CatalogMemberMixin";
function CatalogFunctionMixin(Base) {
    class CatalogFunctionMixin extends CatalogMemberMixin(Base) {
        /**
         * Submit job:
         * - create new job {@link CatalogFunctionMixin#createJob}
         * - sets job traits (`name`, `parameters`, ...)
         * - invokes job {@link CatalogFunctionJobMixin#invoke}
         * - adds to workbench/models (in user added data) if successfully submitted
         * @returns new job
         */
        async submitJob() {
            try {
                const timestamp = new Date().toISOString();
                const newJob = await this.createJob(`${this.uniqueId}-${timestamp}`);
                if (!CatalogFunctionJobMixin.isMixedInto(newJob)) {
                    throw `Error creating job catalog item - ${newJob.type} is not a valid jobType`;
                }
                // Give default name if needed
                if (!isDefined(runInAction(() => newJob.name))) {
                    newJob.setTrait(CommonStrata.user, "name", `${newJob.typeName} ${timestamp}`);
                }
                newJob.setTrait(CommonStrata.user, "parameters", toJS(this.parameters));
                (await newJob.loadMetadata()).throwIfError();
                this.terria.addModel(newJob);
                this.terria.catalog.userAddedDataGroup.add(CommonStrata.user, newJob);
                this.terria.workbench
                    .add(newJob)
                    .then((r) => r.raiseError(this.terria));
                await newJob.invoke();
                return newJob;
            }
            catch (error) {
                throw TerriaError.from(error, {
                    title: `Error submitting \`${this.typeName}\` job`
                });
            }
        }
        get hasCatalogFunctionMixin() {
            return true;
        }
    }
    return CatalogFunctionMixin;
}
(function (CatalogFunctionMixin) {
    function isMixedInto(model) {
        return model && model.hasCatalogFunctionMixin;
    }
    CatalogFunctionMixin.isMixedInto = isMixedInto;
})(CatalogFunctionMixin || (CatalogFunctionMixin = {}));
export default CatalogFunctionMixin;
//# sourceMappingURL=CatalogFunctionMixin.js.map