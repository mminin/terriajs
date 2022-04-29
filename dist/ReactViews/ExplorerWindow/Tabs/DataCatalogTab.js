var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import DataCatalog from "../../DataCatalog/DataCatalog";
import DataPreview from "../../Preview/DataPreview";
import SearchBox, { DEBOUNCE_INTERVAL } from "../../Search/SearchBox.jsx";
import Styles from "./data-catalog-tab.scss";
import Breadcrumbs from "../../Search/Breadcrumbs";
import Box from "../../../Styled/Box";
// The DataCatalog Tab
let DataCatalogTab = class DataCatalogTab extends React.Component {
    get searchPlaceholder() {
        const { t } = this.props;
        return this.props.searchPlaceholder || t("addData.searchPlaceholder");
    }
    changeSearchText(newText) {
        runInAction(() => {
            this.props.viewState.searchState.catalogSearchText = newText;
        });
    }
    search() {
        this.props.viewState.searchState.searchCatalog();
    }
    render() {
        const terria = this.props.terria;
        const searchState = this.props.viewState.searchState;
        const previewed = this.props.viewState.previewedItem;
        const showBreadcrumbs = this.props.viewState.breadcrumbsShown;
        return (React.createElement("div", { className: Styles.root },
            React.createElement(Box, { fullHeight: true, column: true },
                React.createElement(Box, { fullHeight: true, overflow: "hidden" },
                    React.createElement(Box, { className: Styles.dataExplorer, styledWidth: "40%" },
                        searchState.catalogSearchProvider && (React.createElement(SearchBox, { searchText: searchState.catalogSearchText, onSearchTextChanged: val => this.changeSearchText(val), onDoSearch: () => this.search(), placeholder: this.searchPlaceholder, debounceDuration: terria.catalogReferencesLoaded &&
                                searchState.catalogSearchProvider
                                ? searchState.catalogSearchProvider
                                    .debounceDurationOnceLoaded
                                : DEBOUNCE_INTERVAL })),
                        React.createElement(DataCatalog, { terria: this.props.terria, viewState: this.props.viewState, onActionButtonClicked: this.props.onActionButtonClicked, items: this.props.items })),
                    React.createElement(Box, { styledWidth: "60%" },
                        React.createElement(DataPreview, { terria: terria, viewState: this.props.viewState, previewed: previewed }))),
                showBreadcrumbs && (React.createElement(Breadcrumbs, { terria: this.props.terria, viewState: this.props.viewState, previewed: previewed })))));
    }
};
DataCatalogTab.propTypes = {
    terria: PropTypes.object,
    viewState: PropTypes.object,
    items: PropTypes.array,
    searchPlaceholder: PropTypes.string,
    onActionButtonClicked: PropTypes.func,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
};
__decorate([
    computed
], DataCatalogTab.prototype, "searchPlaceholder", null);
DataCatalogTab = __decorate([
    observer
], DataCatalogTab);
export default withTranslation()(withTheme(DataCatalogTab));
//# sourceMappingURL=DataCatalogTab.js.map