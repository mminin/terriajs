import React from "react";
import { Credit } from "./Credit";
export const Credits = ({ credits }) => {
    if (!credits || credits.length === 0) {
        return null;
    }
    return (React.createElement(React.Fragment, null, credits.map((credit, index) => (React.createElement(Credit, { key: index, credit: credit, lastElement: index === credits.length - 1 })))));
};
//# sourceMappingURL=Credits.js.map