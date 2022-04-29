import React from "react";
// Really really lightweight highlight without pulling in react-highlight-words
// pros: lightweight
// cons: ???
export default function highlightKeyword(searchResult, keywordToHighlight) {
    if (!keywordToHighlight)
        return searchResult;
    const parts = searchResult.split(new RegExp(`(${keywordToHighlight})`, "gi"));
    return (React.createElement(React.Fragment, null, parts.map((part, i) => (React.createElement("span", { key: i, style: part.toLowerCase() === keywordToHighlight.toLowerCase()
            ? { fontWeight: "bold" }
            : {} }, part)))));
}
//# sourceMappingURL=highlightKeyword.js.map