import Terria from "../Terria";
import { runInAction } from "mobx";
/**
 * Runs a selectable dimension workflow which is a workflow for a workbench item.
 *
 * @param viewStateOrTerria - The {@link ViewState} or {@link Terria} instance
 * @param workflow - A {@link SelectableDimensionWorkflow} instance
 */
export function runWorkflow(viewStateOrTerria, workflow) {
    runInAction(() => {
        const terria = viewStateOrTerria instanceof Terria
            ? viewStateOrTerria
            : viewStateOrTerria.terria;
        terria.selectableDimensionWorkflow = workflow;
    });
}
//# sourceMappingURL=SelectableDimensionWorkflow.js.map