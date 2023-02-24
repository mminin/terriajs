import { runInAction } from "mobx";
/**
 * Add a new feature button generator to Terria ViewState.
 *
 * @param viewState The ViewState object
 * @param buttonGenerator A button generator function. It will be called once
 * for each catalog item shown in the Feature info panel. The generator
 * function receives the catalog item as a parameter. It can decide to not show a
 * button by returning `undefined`. To show a button return a `SelectableDimensionButton` object.
 */
export function addFeatureButton(viewState, buttonGenerator) {
    runInAction(() => viewState.featureInfoPanelButtonGenerators.push(buttonGenerator));
}
/**
 * Close feature info panel
 */
export function closePanel(viewState) {
    runInAction(() => {
        viewState.terria.pickedFeatures = undefined;
    });
}
//# sourceMappingURL=FeatureInfoPanel.js.map