var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import Box from "../../../../Styled/Box";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import { canShorten } from "./BuildShareLink";
import Styles from "./share-panel.scss";
import { SharePanelContent } from "./SharePanelContent";
import { ShareUrl } from "./ShareUrl";
const MenuPanel = require("../../../StandardUserInterface/customizable/MenuPanel").default;
const StorySharePanel = require("./StorySharePanel").default;
let SharePanel = class SharePanel extends React.Component {
    constructor(props) {
        super(props);
        this.changeOpenState = this.changeOpenState.bind(this);
        this.closePanel = this.closePanel.bind(this);
        this.state = {
            isOpen: false
        };
    }
    changeOpenState(open) {
        this.setState({
            isOpen: open
        });
        if (open) {
            if (this.props.catalogShare || this.props.storyShare) {
                this.props.viewState.shareModalIsVisible = true;
            }
        }
    }
    closePanel() {
        this.setState({
            isOpen: false
        });
    }
    renderContent() {
        const { terria, viewState, t } = this.props;
        if (this.props.catalogShare) {
            return (React.createElement(Box, { fullWidth: true, column: true, paddedRatio: 3 },
                React.createElement(Text, { medium: true, textDark: true }, t("clipboard.shareURL")),
                React.createElement(Spacing, { bottom: 1 }),
                React.createElement(ShareUrl, { terria: terria, viewState: viewState, includeStories: true, shouldShorten: shouldShorten(terria), theme: "light", inputTheme: "light" })));
        }
        else if (this.props.storyShare) {
            return (React.createElement(Box, { fullWidth: true, column: true, paddedRatio: 3 },
                React.createElement(Text, { medium: true }, t("clipboard.shareURL")),
                React.createElement(Spacing, { bottom: 1 }),
                React.createElement(ShareUrl, { terria: terria, viewState: viewState, includeStories: true, shouldShorten: shouldShorten(terria), theme: "dark", inputTheme: "light", rounded: true })));
        }
        else {
            return (React.createElement(SharePanelContent, { terria: terria, viewState: viewState, closePanel: this.closePanel }));
        }
    }
    render() {
        const { t } = this.props;
        const { catalogShare, storyShare, catalogShareWithoutText, modalWidth } = this.props;
        const dropdownTheme = {
            btn: classNames({
                [Styles.btnCatalogShare]: catalogShare,
                [Styles.btnWithoutText]: catalogShareWithoutText
            }),
            outer: classNames(Styles.sharePanel, {
                [Styles.catalogShare]: catalogShare,
                [Styles.storyShare]: storyShare
            }),
            inner: classNames(Styles.dropdownInner, {
                [Styles.catalogShareInner]: catalogShare,
                [Styles.storyShareInner]: storyShare
            }),
            icon: "share"
        };
        const btnText = catalogShare
            ? t("share.btnCatalogShareText")
            : storyShare
                ? t("share.btnStoryShareText")
                : t("share.btnMapShareText");
        const btnTitle = catalogShare
            ? t("share.btnCatalogShareTitle")
            : storyShare
                ? t("share.btnStoryShareTitle")
                : t("share.btnMapShareTitle");
        return !storyShare ? (React.createElement(MenuPanel, { theme: dropdownTheme, btnText: catalogShareWithoutText ? null : btnText, viewState: this.props.viewState, btnTitle: btnTitle, isOpen: this.state.isOpen, onOpenChanged: this.changeOpenState, showDropdownAsModal: catalogShare, modalWidth: modalWidth, smallScreen: this.props.viewState.useSmallScreenInterface, onDismissed: () => {
                if (catalogShare)
                    this.props.viewState.shareModalIsVisible = false;
            }, onUserClick: this.props.onUserClick, disableCloseOnFocusLoss: this.props.viewState.retainSharePanel }, this.state.isOpen && this.renderContent())) : (React.createElement(StorySharePanel, { btnText: catalogShareWithoutText ? null : btnText, viewState: this.props.viewState, btnTitle: btnTitle, isOpen: this.state.isOpen, onOpenChanged: this.changeOpenState, showDropdownAsModal: storyShare, modalWidth: modalWidth, smallScreen: this.props.viewState.useSmallScreenInterface, btnDisabled: this.props.btnDisabled, onDismissed: () => {
                if (storyShare)
                    this.props.viewState.shareModalIsVisible = false;
            }, onUserClick: this.props.onUserClick }, this.state.isOpen && this.renderContent()));
    }
};
SharePanel.displayName = "SharePanel";
SharePanel = __decorate([
    observer
], SharePanel);
export default withTranslation()(SharePanel);
export function shouldShorten(terria) {
    var _a;
    return ((_a = stringToBool(terria.getLocalProperty("shortenShareUrls"))) !== null && _a !== void 0 ? _a : !!canShorten(terria));
}
function stringToBool(s) {
    if (s === true)
        return true;
    if (s === false)
        return false;
    if (s === "true")
        return true;
    if (s === "false")
        return false;
    return undefined;
}
//# sourceMappingURL=SharePanel.js.map