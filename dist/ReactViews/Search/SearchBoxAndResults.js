import React from "react";
import { removeMarker } from "../../Models/LocationMarkerUtils";
import { reaction, runInAction } from "mobx";
import { Trans } from "react-i18next";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import styled from "styled-components";
// import { ThemeContext } from "styled-components";
import SearchBox from "../Search/SearchBox";
// import SidebarSearch from "../Search/SidebarSearch";
import LocationSearchResults from "../Search/LocationSearchResults";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Box from "../../Styled/Box";
import Text from "../../Styled/Text";
import Spacing from "../../Styled/Spacing";
import { RawButton } from "../../Styled/Button";
import { addMarker } from "../../Models/LocationMarkerUtils";
export function SearchInDataCatalog({ viewState, handleClick }) {
    const locationSearchText = viewState.searchState.locationSearchText;
    return (React.createElement(RawButton, { fullWidth: true, onClick: () => {
            const { searchState } = viewState;
            // Set text here as a separate action so that it doesn't get batched up and the catalog
            // search text has a chance to set isWaitingToStartCatalogSearch
            searchState.setCatalogSearchText(searchState.locationSearchText);
            viewState.searchInCatalog(searchState.locationSearchText);
            handleClick && handleClick();
        } },
        React.createElement(Box, { paddedRatio: 2, rounded: true, charcoalGreyBg: true },
            React.createElement(StyledIcon, { styledWidth: "14px", glyph: Icon.GLYPHS["dataCatalog"] }),
            React.createElement(Spacing, { right: 2 }),
            React.createElement(Text, { textAlignLeft: true, textLight: true, large: true, fullWidth: true },
                React.createElement(Trans, { i18nKey: "search.searchInDataCatalog", values: { locationSearchText } },
                    "Search ",
                    React.createElement("strong", null, locationSearchText),
                    " in the Data Catalogue")),
            React.createElement(StyledIcon, { glyph: Icon.GLYPHS.right2, styledWidth: "14px", light: true }))));
}
SearchInDataCatalog.propTypes = {
    handleClick: PropTypes.func.isRequired,
    viewState: PropTypes.object.isRequired
};
const PresentationBox = styled(Box).attrs({
    fullWidth: true
}) `
  ${(props) => props.highlightBottom &&
    `
      // styled-components doesn't seem to prefix linear-gradient.. soo
      background-image: linear-gradient(bottom, ${props.theme.greyLightest} 50%, transparent 50%);
      background-image: -o-linear-gradient(bottom, ${props.theme.greyLightest} 50%, transparent 50%);
      background-image: -moz-linear-gradient(bottom, ${props.theme.greyLightest} 50%, transparent 50%);
      background-image: -webkit-linear-gradient(bottom, ${props.theme.greyLightest} 50%, transparent 50%);
      background-image: -ms-linear-gradient(bottom, ${props.theme.greyLightest} 50%, transparent 50%);
    `}
`;
export const LOCATION_SEARCH_INPUT_NAME = "LocationSearchInput";
export class SearchBoxAndResultsRaw extends React.Component {
    constructor(props) {
        super(props);
        this.locationSearchRef = React.createRef();
    }
    componentDidMount() {
        this.props.viewState.updateAppRef(LOCATION_SEARCH_INPUT_NAME, this.locationSearchRef);
        this.subscribeToProps();
    }
    componentDidUpdate() {
        this.subscribeToProps();
    }
    componentWillUnmount() {
        this.unsubscribeFromProps();
    }
    subscribeToProps() {
        this.unsubscribeFromProps();
        // TODO(wing): why is this a reaction here and not in viewState itself?
        // Close the search results when the Now Viewing changes (so that it's visible).
        this._nowViewingChangeSubscription = reaction(() => this.props.terria.workbench.items, () => {
            this.props.viewState.searchState.showLocationSearchResults = false;
        });
    }
    unsubscribeFromProps() {
        if (this._nowViewingChangeSubscription) {
            this._nowViewingChangeSubscription();
            this._nowViewingChangeSubscription = undefined;
        }
    }
    changeSearchText(newText) {
        runInAction(() => {
            this.props.viewState.searchState.locationSearchText = newText;
        });
        if (newText.length === 0) {
            removeMarker(this.props.terria);
            runInAction(() => {
                this.toggleShowLocationSearchResults(false);
            });
        }
        if (newText.length > 0 &&
            !this.props.viewState.searchState.showLocationSearchResults) {
            runInAction(() => {
                this.toggleShowLocationSearchResults(true);
            });
        }
    }
    search() {
        this.props.viewState.searchState.searchLocations();
    }
    toggleShowLocationSearchResults(bool) {
        runInAction(() => {
            this.props.viewState.searchState.showLocationSearchResults = bool;
        });
    }
    startLocationSearch() {
        this.toggleShowLocationSearchResults(true);
    }
    render() {
        const { viewState, placeholder } = this.props;
        const searchState = viewState.searchState;
        const locationSearchText = searchState.locationSearchText;
        const shouldShowResults = searchState.locationSearchText.length > 0 &&
            searchState.showLocationSearchResults;
        return (React.createElement(Text, { textDarker: true },
            React.createElement(Box, { fullWidth: true },
                React.createElement(PresentationBox, { highlightBottom: shouldShowResults },
                    React.createElement(SearchBox, { ref: this.locationSearchRef, onSearchTextChanged: this.changeSearchText.bind(this), onDoSearch: this.search.bind(this), onFocus: this.startLocationSearch.bind(this), searchText: searchState.locationSearchText, placeholder: placeholder })),
                React.createElement(If, { condition: shouldShowResults },
                    React.createElement(Box, { position: "absolute", fullWidth: true, column: true, css: `
                top: 100%;
                background-color: ${(props) => props.theme.greyLightest};
                max-height: calc(100vh - 120px);
                border-radius: 0 0 ${(props) => props.theme.radius40Button}px
                  ${(props) => props.theme.radius40Button}px;
              ` },
                        searchState.catalogSearchProvider && (React.createElement(Box, { column: true, paddedRatio: 2 },
                            React.createElement(SearchInDataCatalog, { viewState: viewState, handleClick: () => {
                                    this.toggleShowLocationSearchResults(false);
                                } }))),
                        React.createElement(Box, { column: true, css: `
                  overflow-y: auto;
                ` },
                            React.createElement(For, { each: "search", of: this.props.viewState.searchState.locationSearchResults },
                                React.createElement(LocationSearchResults, { key: search.searchProvider.name, terria: this.props.terria, viewState: this.props.viewState, search: search, locationSearchText: locationSearchText, onLocationClick: (result) => {
                                        addMarker(this.props.terria, result);
                                        result.clickAction();
                                        runInAction(() => {
                                            searchState.showLocationSearchResults = false;
                                        });
                                    }, isWaitingForSearchToStart: searchState.isWaitingToStartLocationSearch }))))))));
    }
}
SearchBoxAndResultsRaw.propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    placeholder: PropTypes.string.isRequired
};
export default observer(SearchBoxAndResultsRaw);
//# sourceMappingURL=SearchBoxAndResults.js.map