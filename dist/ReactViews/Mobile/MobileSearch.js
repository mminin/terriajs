import React from "react";
import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import { addMarker } from "../../Models/LocationMarkerUtils";
import LocationSearchResults from "../Search/LocationSearchResults";
import SearchResult from "../Search/SearchResult";
import { withTranslation } from "react-i18next";
import Styles from "./mobile-search.scss";
// A Location item when doing Bing map searvh or Gazetter search
const MobileSearch = observer(createReactClass({
    displayName: "MobileSearch",
    propTypes: {
        viewState: PropTypes.object,
        terria: PropTypes.object,
        t: PropTypes.func.isRequired
    },
    onLocationClick(result) {
        runInAction(() => {
            result.clickAction();
            addMarker(this.props.terria, result);
            // Close modal window
            this.props.viewState.switchMobileView(null);
            this.props.viewState.searchState.showMobileLocationSearch = false;
        });
    },
    searchInDataCatalog() {
        const { searchState } = this.props.viewState;
        runInAction(() => {
            // Set text here so that it doesn't get batched up and the catalog
            // search text has a chance to set isWaitingToStartCatalogSearch
            searchState.catalogSearchText = searchState.locationSearchText;
        });
        this.props.viewState.searchInCatalog(searchState.locationSearchText);
    },
    render() {
        const theme = "light";
        return (React.createElement("div", { className: Styles.mobileSearch },
            React.createElement("div", null, this.renderSearchInCatalogLink(theme)),
            React.createElement("div", { className: Styles.location }, this.renderLocationResult(theme))));
    },
    renderSearchInCatalogLink(theme) {
        const { t } = this.props;
        const searchState = this.props.viewState.searchState;
        return (React.createElement(If, { condition: searchState.locationSearchText.length > 0 },
            React.createElement("div", { className: Styles.providerResult },
                React.createElement("ul", { className: Styles.btnList }, searchState.catalogSearchProvider && (React.createElement(SearchResult, { clickAction: this.searchInDataCatalog, icon: null, locationSearchText: searchState.locationSearchText, name: t("search.search", {
                        searchText: searchState.locationSearchText
                    }), searchResultTheme: theme }))))));
    },
    renderLocationResult(theme) {
        const searchState = this.props.viewState.searchState;
        return searchState.locationSearchResults.map((search) => (React.createElement(LocationSearchResults, { key: search.searchProvider.name, terria: this.props.terria, viewState: this.props.viewState, search: search, locationSearchText: searchState.locationSearchText, onLocationClick: this.onLocationClick, isWaitingForSearchToStart: searchState.isWaitingToStartLocationSearch, theme: theme })));
    }
}));
module.exports = withTranslation()(MobileSearch);
//# sourceMappingURL=MobileSearch.js.map