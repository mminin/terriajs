import React from "react";
import { getName } from "../../../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../../../ModelMixins/MappableMixin";
import DiscretelyTimeVaryingMixin from "../../../../../ModelMixins/DiscretelyTimeVaryingMixin";
import Legend from "../../../../Workbench/Controls/Legend";
import SelectableDimensions, { DEFAULT_PLACEMENT, filterSelectableDimensions, findSelectedValueName } from "../../../../../Models/SelectableDimensions";
import CatalogMemberMixin from "../../../../../ModelMixins/CatalogMemberMixin";
const renderDisplayVariables = (catalogItem) => {
    if (SelectableDimensions.is(catalogItem)) {
        return filterSelectableDimensions(DEFAULT_PLACEMENT)(catalogItem.selectableDimensions).map((dim, key) => (React.createElement("div", { key: key },
            dim.name,
            ": ",
            findSelectedValueName(dim))));
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