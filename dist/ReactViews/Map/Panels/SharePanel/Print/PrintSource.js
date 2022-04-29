import React from "react";
import dateFormat from "dateformat";
const PrintSource = (props) => {
    return (React.createElement("div", null,
        React.createElement("p", null,
            "This map was created using",
            " ",
            React.createElement("a", { href: window.location.origin }, window.location.origin),
            " on",
            " ",
            dateFormat()),
        React.createElement("p", null,
            "An interactive version of this map can be found here:",
            " ",
            React.createElement("a", { href: props.link }, props.link))));
};
export default PrintSource;
//# sourceMappingURL=PrintSource.js.map