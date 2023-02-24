var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import { removeMarker } from "../../Models/LocationMarkerUtils";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import SearchBox from "../Search/SearchBox";
import Branding from "../SidePanel/Branding";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
import Styles from "./mobile-header.scss";
import MobileMenu from "./MobileMenu";
import MobileModalWindow from "./MobileModalWindow";
let MobileHeader = class MobileHeader extends React.Component {
    showSearch() {
        const viewState = this.props.viewState;
        const mobileView = viewState.mobileView;
        const mobileViewOptions = viewState.mobileViewOptions;
        const searchState = viewState.searchState;
        runInAction(() => {
            if (mobileView === mobileViewOptions.data ||
                mobileView === mobileViewOptions.preview) {
                searchState.showMobileCatalogSearch = true;
            }
            else {
                searchState.showMobileLocationSearch = true;
                this.showLocationSearchResults();
            }
        });
    }
    closeLocationSearch() {
        runInAction(() => {
            this.props.viewState.searchState.showMobileLocationSearch = false;
            this.props.viewState.explorerPanelIsVisible = false;
            this.props.viewState.switchMobileView(null);
        });
    }
    closeCatalogSearch() {
        runInAction(() => {
            this.props.viewState.searchState.showMobileCatalogSearch = false;
            this.props.viewState.searchState.catalogSearchText = "";
        });
    }
    onMobileDataCatalogClicked() {
        this.props.viewState.setTopElement("DataCatalog");
        this.toggleView(this.props.viewState.mobileViewOptions.data);
    }
    onMobileNowViewingClicked() {
        this.props.viewState.setTopElement("NowViewing");
        this.toggleView(this.props.viewState.mobileViewOptions.nowViewing);
    }
    changeLocationSearchText(newText) {
        runInAction(() => {
            this.props.viewState.searchState.locationSearchText = newText;
        });
        if (newText.length === 0) {
            removeMarker(this.props.viewState.terria);
        }
        this.showLocationSearchResults();
    }
    showLocationSearchResults() {
        runInAction(() => {
            const text = this.props.viewState.searchState.locationSearchText;
            if (text && text.length > 0) {
                this.props.viewState.explorerPanelIsVisible = true;
                this.props.viewState.mobileView =
                    this.props.viewState.mobileViewOptions.locationSearchResults;
            }
            else {
                // TODO: return to the preview mobileView, rather than dropping back to the map
                this.props.viewState.explorerPanelIsVisible = false;
                this.props.viewState.mobileView = null;
            }
        });
    }
    changeCatalogSearchText(newText) {
        runInAction(() => {
            this.props.viewState.searchState.catalogSearchText = newText;
        });
    }
    searchLocations() {
        this.props.viewState.searchState.searchLocations();
    }
    searchCatalog() {
        this.props.viewState.searchState.searchCatalog();
    }
    toggleView(viewname) {
        runInAction(() => {
            if (this.props.viewState.mobileView !== viewname) {
                this.props.viewState.explorerPanelIsVisible = true;
                this.props.viewState.switchMobileView(viewname);
            }
            else {
                this.props.viewState.explorerPanelIsVisible = false;
                this.props.viewState.switchMobileView(null);
            }
        });
    }
    onClickFeedback(e) {
        e.preventDefault();
        runInAction(() => {
            this.props.viewState.feedbackFormIsVisible = true;
        });
        this.setState({
            menuIsOpen: false
        });
    }
    render() {
        const searchState = this.props.viewState.searchState;
        const { t } = this.props;
        const nowViewingLength = this.props.viewState.terria.workbench.items !== undefined
            ? this.props.viewState.terria.workbench.items.length
            : 0;
        return (React.createElement("div", { className: Styles.ui },
            React.createElement(Box, { justifySpaceBetween: true, fullWidth: true, fullHeight: true, paddedRatio: 1, backgroundColor: this.props.theme.dark },
                React.createElement(Choose, null,
                    React.createElement(When, { condition: !searchState.showMobileLocationSearch &&
                            !searchState.showMobileCatalogSearch },
                        React.createElement(Box, { position: "absolute", css: `
                  left: 5px;
                ` },
                            React.createElement(HamburgerButton, { type: "button", onClick: this.props.viewState.toggleMobileMenu.bind(this.props.viewState), title: t("mobile.toggleNavigation") },
                                React.createElement(StyledIcon, { light: true, glyph: Icon.GLYPHS.menu, styledWidth: "20px", styledHeight: "20px" })),
                            React.createElement(Branding, { terria: this.props.viewState.terria, viewState: this.props.viewState, version: this.props.version })),
                        React.createElement("div", { className: Styles.groupRight, css: `
                  background-color: ${(p) => p.theme.dark};
                ` },
                            React.createElement("button", { type: "button", className: Styles.btnAdd, onClick: this.onMobileDataCatalogClicked.bind(this) },
                                t("mobile.addDataBtnText"),
                                React.createElement(StyledIcon, { glyph: Icon.GLYPHS.increase, styledWidth: "20px", styledHeight: "20px" })),
                            React.createElement(If, { condition: nowViewingLength > 0 },
                                React.createElement("button", { type: "button", className: Styles.btnNowViewing, onClick: this.onMobileNowViewingClicked.bind(this) },
                                    React.createElement(Icon, { glyph: Icon.GLYPHS.eye }),
                                    React.createElement("span", { className: classNames(Styles.nowViewingCount, {
                                            [Styles.doubleDigit]: nowViewingLength > 9
                                        }) }, nowViewingLength))),
                            React.createElement("button", { className: Styles.btnSearch, type: "button", onClick: this.showSearch.bind(this) },
                                React.createElement(StyledIcon, { glyph: Icon.GLYPHS.search, styledWidth: "20px", styledHeight: "20px" })))),
                    React.createElement(Otherwise, null,
                        React.createElement("div", { className: Styles.formSearchData },
                            React.createElement(Choose, null,
                                React.createElement(When, { condition: searchState.showMobileLocationSearch },
                                    React.createElement(SearchBox, { searchText: searchState.locationSearchText, onSearchTextChanged: this.changeLocationSearchText.bind(this), onDoSearch: this.searchLocations.bind(this), placeholder: t("search.placeholder"), alwaysShowClear: true, onClear: this.closeLocationSearch.bind(this), autoFocus: true })),
                                React.createElement(When, { condition: searchState.showMobileCatalogSearch },
                                    React.createElement(SearchBox, { searchText: searchState.catalogSearchText, onSearchTextChanged: this.changeCatalogSearchText.bind(this), onDoSearch: this.searchCatalog.bind(this), placeholder: t("search.searchCatalogue"), onClear: this.closeCatalogSearch.bind(this), autoFocus: true }))))))),
            React.createElement(MobileMenu, { menuItems: this.props.menuItems, menuLeftItems: this.props.menuLeftItems, viewState: this.props.viewState, allBaseMaps: this.props.allBaseMaps, terria: this.props.viewState.terria, showFeedback: !!this.props.viewState.terria.configParameters.feedbackUrl }),
            !this.props.viewState.isMapInteractionActive && (React.createElement(MobileModalWindow, { terria: this.props.viewState.terria, viewState: this.props.viewState }))));
    }
};
MobileHeader.displayName = "MobileHeader";
MobileHeader = __decorate([
    observer
], MobileHeader);
const HamburgerButton = styled(RawButton) `
  border-radius: 4px;
  padding: 0 5px;
  margin-right: 3px;
  background: ${(p) => p.theme.darkLighter};
  width: 50px;
  height: 38px;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover,
  &:focus,
  & {
    border: 1px solid ${(p) => p.theme.textLightTranslucent};
  }
`;
MobileHeader.propTypes = {
    viewState: PropTypes.object.isRequired,
    allBaseMaps: PropTypes.array,
    version: PropTypes.string,
    menuLeftItems: PropTypes.array,
    menuItems: PropTypes.array,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
};
export default withTranslation()(withTheme(withViewState(MobileHeader)));
//# sourceMappingURL=MobileHeader.js.map