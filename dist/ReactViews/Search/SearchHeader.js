import Loader from "../Loader";
import { observer } from "mobx-react";
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./search-header.scss";
/** Renders either a loader or a message based off search state. */
export default observer(createReactClass({
    displayName: "SearchHeader",
    propTypes: {
        searchResults: PropTypes.object.isRequired,
        isWaitingForSearchToStart: PropTypes.bool
    },
    render() {
        if (this.props.searchResults.isSearching ||
            this.props.isWaitingForSearchToStart) {
            return (React.createElement("div", { key: "loader", className: Styles.loader },
                React.createElement(Loader, null)));
        }
        else if (this.props.searchResults.message) {
            return (React.createElement("div", { key: "message", className: Styles.noResults }, this.props.searchResults.message));
        }
        else {
            return null;
        }
    }
}));
//# sourceMappingURL=SearchHeader.js.map