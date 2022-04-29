import React from "react";
import { getName } from "../../../../../ModelMixins/CatalogMemberMixin";
import Description from "../../../../Preview/Description";
const PrintDatasets = (props) => {
    return (React.createElement(React.Fragment, null, props.items.map((item, index) => (React.createElement("details", { key: index, open: true },
        React.createElement("summary", null, getName(item)),
        React.createElement(Description, { item: item, printView: true, key: index }))))));
};
export default PrintDatasets;
//# sourceMappingURL=PrintDatasets.js.map