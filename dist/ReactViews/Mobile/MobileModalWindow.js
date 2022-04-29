import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import classNames from "classnames";
import { observer } from "mobx-react";
import DataCatalog from "../DataCatalog/DataCatalog";
import DataPreview from "../Preview/DataPreview";
import MobileSearch from "./MobileSearch";
import WorkbenchList from "../Workbench/WorkbenchList";
import Icon from "../../Styled/Icon";
import Styles from "./mobile-modal-window.scss";
import { runInAction } from "mobx";
import { withTranslation } from "react-i18next";
const MobileModalWindow = observer(createReactClass({
    displayName: "MobileModalWindow",
    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    renderModalContent() {
        const viewState = this.props.viewState;
        const searchState = viewState.searchState;
        if (viewState.mobileView !== viewState.mobileViewOptions.data &&
            viewState.mobileView !== viewState.mobileViewOptions.preview &&
            searchState.showMobileLocationSearch &&
            searchState.locationSearchText.length > 0) {
            return (React.createElement(MobileSearch, { terria: this.props.terria, viewState: this.props.viewState }));
        }
        switch (viewState.mobileView) {
            case viewState.mobileViewOptions.data:
                // No multiple catalogue tabs in mobile
                return (React.createElement(DataCatalog, { terria: this.props.terria, viewState: this.props.viewState, items: this.props.terria.catalog.group.memberModels }));
            case viewState.mobileViewOptions.preview:
                return (React.createElement(DataPreview, { terria: this.props.terria, viewState: this.props.viewState, previewed: this.props.viewState.previewedItem }));
            case viewState.mobileViewOptions.nowViewing:
                return (React.createElement(WorkbenchList, { viewState: this.props.viewState, terria: this.props.terria }));
            default:
                return null;
        }
    },
    onClearMobileUI() {
        runInAction(() => {
            this.props.viewState.switchMobileView(null);
            this.props.viewState.explorerPanelIsVisible = false;
            this.props.viewState.searchState.showMobileLocationSearch = false;
            this.props.viewState.searchState.showMobileCatalogSearch = false;
            this.props.viewState.searchState.catalogSearchText = "";
        });
    },
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillReceiveProps() {
        const numItems = this.props.terria.workbench.items.length;
        if ((numItems === undefined || numItems === 0) &&
            this.props.viewState.mobileView ===
                this.props.viewState.mobileViewOptions.nowViewing) {
            runInAction(() => {
                this.props.viewState.switchMobileView(null);
                this.props.viewState.explorerPanelIsVisible = false;
            });
        }
    },
    goBack() {
        this.props.viewState.switchMobileView(this.props.viewState.mobileViewOptions.data);
    },
    render() {
        const modalClass = classNames(Styles.mobileModal, {
            [Styles.isOpen]: this.props.viewState.explorerPanelIsVisible &&
                this.props.viewState.mobileView
        });
        const mobileView = this.props.viewState.mobileView;
        const { t } = this.props;
        return (React.createElement("div", { className: modalClass },
            React.createElement("div", { className: Styles.modalBg },
                React.createElement("div", { className: Styles.modalTop },
                    React.createElement(If, { condition: this.props.viewState.explorerPanelIsVisible && mobileView },
                        React.createElement("button", { type: "button", className: Styles.doneButton, onClick: this.onClearMobileUI }, t("mobile.doneBtnText"))),
                    React.createElement("button", { type: "button", disabled: mobileView !== this.props.viewState.mobileViewOptions.preview, className: classNames(Styles.backButton, {
                            [Styles.backButtonInactive]: mobileView !==
                                this.props.viewState.mobileViewOptions.preview
                        }), onClick: this.goBack },
                        React.createElement(Icon, { className: Styles.iconBack, glyph: Icon.GLYPHS.left }))),
                this.renderModalContent())));
    }
}));
module.exports = withTranslation()(MobileModalWindow);
//# sourceMappingURL=MobileModalWindow.js.map