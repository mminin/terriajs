import React from "react";
import CatalogMemberMixin, { getName } from "../../../../../ModelMixins/CatalogMemberMixin";
import DiscretelyTimeVaryingMixin from "../../../../../ModelMixins/DiscretelyTimeVaryingMixin";
import MappableMixin from "../../../../../ModelMixins/MappableMixin";
import SelectableDimensions, { DEFAULT_PLACEMENT, filterSelectableDimensions, findSelectedValueName, isGroup } from "../../../../../Models/SelectableDimensions/SelectableDimensions";
import Legend from "../../../../Workbench/Controls/Legend";
const renderDisplayVariables = (catalogItem) => {
    if (SelectableDimensions.is(catalogItem)) {
        return filterSelectableDimensions(DEFAULT_PLACEMENT)(catalogItem.selectableDimensions).map((dim, key) => !isGroup(dim) ? (React.createElement("div", { key: key },
            dim.name,
            ": ",
            findSelectedValueName(dim))) : null);
    }
    return null;
};
const renderLegend = (catalogItem) => {
    if (!MappableMixin.isMixedInto(catalogItem)) {
        return null;
    }
    return (React.createElement("div", { key: catalogItem.uniqueId, className: "layer-legends" },
        React.createElement("div", { className: "layer-title" }, getName(catalogItem)),
        DiscretelyTimeVaryingMixin.isMixedInto(catalogItem) && (React.createElement("div", { className: "layer-time" },
            "Time: ",
            catalogItem.currentTime)),
        CatalogMemberMixin.isMixedInto(catalogItem) && (React.createElement(Legend, { forPrint: true, item: catalogItem }))));
};
const WorkbenchItem = ({ item }) => {
    return (React.createElement("div", { className: "WorkbenchItem" },
        React.createElement("h3", null, getName(item)),
        renderDisplayVariables(item),
        React.createElement("div", null, renderLegend(item))));
};
const PrintWorkbench = (props) => {
    return (React.createElement(React.Fragment, null, props.workbench.items.map((item, index) => (React.createElement(WorkbenchItem, { item: item, key: index })))));
};
export default PrintWorkbench;
//# sourceMappingURL=PrintWorkbench.js.map