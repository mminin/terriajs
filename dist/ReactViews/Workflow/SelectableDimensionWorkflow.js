import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getName } from "../../ModelMixins/CatalogMemberMixin";
import { filterSelectableDimensions } from "../../Models/SelectableDimensions/SelectableDimensions";
import SelectableDimension from "../SelectableDimensions/SelectableDimension";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
import WorkbenchItemControls, { hideAllControls } from "../Workbench/Controls/WorkbenchItemControls";
import { Panel } from "./Panel";
import { PanelMenu } from "./PanelMenu";
import WorkflowPanel from "./WorkflowPanel";
/** Two main components:
 * - Title panel with `title`, item `WorkbenchItemControls` and menu
 * - Panel for each top-level selectable dimension
 */
const SelectableDimensionWorkflow = observer(() => {
    const viewState = useViewState();
    const terria = viewState.terria;
    const [t] = useTranslation();
    return terria.selectableDimensionWorkflow ? (React.createElement(WorkflowPanel, { viewState: viewState, icon: terria.selectableDimensionWorkflow.icon, title: terria.selectableDimensionWorkflow.name, closeButtonText: t("compare.done"), onClose: action(() => {
            terria.selectableDimensionWorkflow = undefined;
        }), footer: terria.selectableDimensionWorkflow.footer },
        React.createElement(Panel, { title: getName(terria.selectableDimensionWorkflow.item), menuComponent: terria.selectableDimensionWorkflow.menu ? (React.createElement(PanelMenu, Object.assign({}, terria.selectableDimensionWorkflow.menu))) : undefined },
            React.createElement(WorkbenchItemControls, { item: terria.selectableDimensionWorkflow.item, viewState: viewState, controls: {
                    ...hideAllControls,
                    opacity: true,
                    timer: true,
                    dateTime: true,
                    shortReport: true
                } })),
        terria.selectableDimensionWorkflow.selectableDimensions.map((groupDim, i) => {
            var _a, _b, _c;
            if (groupDim.disable)
                return null;
            const childDims = filterSelectableDimensions()(groupDim.selectableDimensions);
            if (childDims.length === 0)
                return null;
            return (React.createElement(Panel, { title: (_a = groupDim.name) !== null && _a !== void 0 ? _a : groupDim.id, key: (_b = groupDim.name) !== null && _b !== void 0 ? _b : groupDim.id, isOpen: (_c = groupDim.isOpen) !== null && _c !== void 0 ? _c : true, onToggle: groupDim.onToggle, collapsible: true }, childDims.map((childDim) => {
                var _a, _b;
                return (React.createElement(SelectableDimension, { key: `${(_a = terria.selectableDimensionWorkflow) === null || _a === void 0 ? void 0 : _a.item.uniqueId}-${childDim.id}-fragment`, id: `${(_b = terria.selectableDimensionWorkflow) === null || _b === void 0 ? void 0 : _b.item.uniqueId}-${childDim.id}`, dim: childDim }));
            })));
        }))) : null;
});
export default SelectableDimensionWorkflow;
//# sourceMappingURL=SelectableDimensionWorkflow.js.map