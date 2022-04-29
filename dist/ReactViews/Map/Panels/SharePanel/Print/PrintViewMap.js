import React, { useEffect, useState } from "react";
const PrintViewMap = (props) => {
    const [map, setMap] = useState(null);
    const [isError, setError] = useState(false);
    useEffect(() => {
        setMap(null);
        props.screenshot.then(setMap).catch(() => setError(true));
    }, [props.screenshot]);
    return isError ? (React.createElement("div", null, "Error has occured")) : map ? (React.createElement("div", { className: "mapContainer" },
        React.createElement("img", { className: "map-image", src: map, alt: "Map snapshot" }),
        props.children)) : (React.createElement("div", null, "Loading"));
};
export default PrintViewMap;
//# sourceMappingURL=PrintViewMap.js.map