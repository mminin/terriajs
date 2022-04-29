import React from "react";
import PropTypes from "prop-types";
import { useRefForTerria } from "../Hooks/useRefForTerria";
/*
    HOC to set a ref and store it in viewState
*/
export const withTerriaRef = (WrappedComponent, refName) => {
    const WithTerriaRef = (props) => {
        const hocRef = useRefForTerria(refName, props.viewState);
        return React.createElement(WrappedComponent, Object.assign({ refFromHOC: hocRef }, props));
    };
    WithTerriaRef.propTypes = {
        viewState: PropTypes.object.isRequired
    };
    return WithTerriaRef;
};
export default withTerriaRef;
//# sourceMappingURL=withTerriaRef.js.map