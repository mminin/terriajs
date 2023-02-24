import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import createReactClass from "create-react-class";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import classNames from "classnames";
import MobileMenuItem from "./MobileMenuItem";
import SettingPanel from "../Map/Panels/SettingPanel";
import SharePanel from "../Map/Panels/SharePanel/SharePanel";
import { withTranslation } from "react-i18next";
import Styles from "./mobile-menu.scss";
import { runInAction } from "mobx";
import LangPanel from "../Map/Panels/LangPanel/LangPanel";
import { applyTranslationIfExists } from "../../Language/languageHelpers";
import { Category, HelpAction } from "../../Core/AnalyticEvents/analyticEvents";
const MobileMenu = observer(createReactClass({
    displayName: "MobileMenu",
    propTypes: {
        menuItems: PropTypes.arrayOf(PropTypes.element),
        menuLeftItems: PropTypes.arrayOf(PropTypes.element),
        viewState: PropTypes.object.isRequired,
        showFeedback: PropTypes.bool,
        terria: PropTypes.object.isRequired,
        i18n: PropTypes.object,
        allBaseMaps: PropTypes.array.isRequired,
        t: PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            menuItems: [],
            showFeedback: false
        };
    },
    toggleMenu() {
        runInAction(() => {
            this.props.viewState.mobileMenuVisible =
                !this.props.viewState.mobileMenuVisible;
        });
    },
    getInitialState() {
        return {};
    },
    onFeedbackFormClick() {
        runInAction(() => {
            this.props.viewState.feedbackFormIsVisible = true;
            this.props.viewState.mobileMenuVisible = false;
        });
    },
    hideMenu() {
        runInAction(() => {
            this.props.viewState.mobileMenuVisible = false;
        });
    },
    runStories() {
        this.props.viewState.runStories();
    },
    dismissSatelliteGuidanceAction() {
        this.props.viewState.toggleFeaturePrompt("mapGuidesLocation", true, true);
    },
    /**
     * If the help configuration defines an item named `mapuserguide`, this
     * method returns props for showing it in the mobile menu.
     */
    mapUserGuide() {
        const helpItems = this.props.terria.configParameters.helpContent;
        const mapUserGuideItem = helpItems === null || helpItems === void 0 ? void 0 : helpItems.find(({ itemName }) => itemName === "mapuserguide");
        if (!mapUserGuideItem) {
            return undefined;
        }
        const title = applyTranslationIfExists(mapUserGuideItem.title, this.props.i18n);
        return {
            href: mapUserGuideItem.url,
            caption: title,
            onClick: () => {
                var _a;
                (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.help, HelpAction.itemSelected, title);
            }
        };
    },
    render() {
        var _a;
        const { t } = this.props;
        const hasStories = this.props.terria.configParameters.storyEnabled &&
            defined(this.props.terria.stories) &&
            this.props.terria.stories.length > 0;
        const mapUserGuide = this.mapUserGuide();
        // return this.props.viewState.mobileMenuVisible ? (
        return (React.createElement("div", null,
            React.createElement(If, { condition: this.props.viewState.mobileMenuVisible },
                React.createElement("div", { className: Styles.overlay, onClick: this.toggleMenu })),
            React.createElement("div", { className: classNames(Styles.mobileNav, {
                    [Styles.mobileNavHidden]: !this.props.viewState.mobileMenuVisible
                }) },
                React.createElement(For, { each: "menuItem", of: this.props.menuLeftItems },
                    React.createElement("div", { onClick: this.hideMenu, key: menuItem ? menuItem.key : undefined }, menuItem)),
                React.createElement("div", { onClick: this.hideMenu },
                    React.createElement(SettingPanel, { terria: this.props.terria, viewState: this.props.viewState })),
                React.createElement("div", { onClick: this.hideMenu },
                    React.createElement(SharePanel, { terria: this.props.terria, viewState: this.props.viewState })),
                React.createElement(For, { each: "menuItem", of: this.props.menuItems },
                    React.createElement("div", { onClick: this.hideMenu, key: menuItem ? menuItem.key : undefined }, menuItem)),
                mapUserGuide && React.createElement(MobileMenuItem, Object.assign({}, mapUserGuide)),
                React.createElement(If, { condition: this.props.showFeedback },
                    React.createElement(MobileMenuItem, { onClick: this.onFeedbackFormClick, caption: t("feedback.feedbackBtnText") })),
                React.createElement(If, { condition: hasStories },
                    React.createElement(MobileMenuItem, { onClick: this.runStories, caption: t("story.mobileViewStory", {
                            storiesLength: this.props.terria.stories.length
                        }) })),
                React.createElement(If, { condition: (_a = this.props.terria.configParameters.languageConfiguration) === null || _a === void 0 ? void 0 : _a.enabled },
                    React.createElement("div", { onClick: this.hideMenu },
                        React.createElement(LangPanel, { terria: this.props.terria, smallScreen: this.props.viewState.useSmallScreenInterface }))))));
    }
}));
export default withTranslation()(MobileMenu);
//# sourceMappingURL=MobileMenu.js.map