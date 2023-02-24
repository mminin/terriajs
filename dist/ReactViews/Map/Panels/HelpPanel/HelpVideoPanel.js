var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Icon from "../../../../Styled/Icon";
import Styles from "./help-panel.scss";
import Spacing from "../../../../Styled/Spacing";
import Box from "../../../../Styled/Box";
import VideoGuide from "./VideoGuide";
import TrainerPane from "./TrainerPane";
import StyledHtml from "./StyledHtml";
import SatelliteGuide from "../../../Guide/SatelliteGuide";
const HELP_VIDEO_NAME = "helpVideo";
let HelpVideoPanel = class HelpVideoPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const helpItemType = this.props.paneMode || "videoAndContent"; // default is video panel
        const itemSelected = this.props.viewState.selectedHelpMenuItem === this.props.itemString;
        const isExpanded = this.props.viewState.selectedHelpMenuItem !== "";
        const className = classNames({
            [Styles.videoPanel]: true,
            [Styles.isVisible]: isExpanded,
            // when the help entire video panel is invisible (hidden away to the right)
            [Styles.shiftedToRight]: !isExpanded ||
                !this.props.viewState.showHelpMenu ||
                this.props.viewState.topElement !== "HelpPanel"
        });
        return (itemSelected && (React.createElement("div", { className: className },
            React.createElement(VideoGuide, { viewState: this.props.viewState, videoLink: this.props.videoUrl, background: this.props.placeholderImage, backgroundOpacity: this.props.videoCoverImageOpacity, videoName: HELP_VIDEO_NAME }),
            React.createElement(Box, { centered: true, fullWidth: true, fullHeight: true, displayInlineBlock: true, paddedHorizontally: 4, paddedVertically: 18, css: `
              overflow: auto;
              overflow-x: hidden;
              overflow-y: auto;
            `, scroll: true },
                React.createElement(If, { condition: helpItemType === "videoAndContent" },
                    this.props.videoUrl && this.props.placeholderImage && (React.createElement("div", { key: "image" },
                        React.createElement("div", { className: Styles.videoLink, style: {
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)), url(${this.props.placeholderImage})`
                            } },
                            React.createElement("button", { className: Styles.videoBtn, onClick: () => this.props.viewState.setVideoGuideVisible(HELP_VIDEO_NAME) },
                                React.createElement(Icon, { glyph: Icon.GLYPHS.play }))),
                        React.createElement(Spacing, { bottom: 5 }))),
                    this.props.markdownContent && (React.createElement(StyledHtml, { key: "markdownContent", viewState: this.props.viewState, markdown: this.props.markdownContent }))),
                React.createElement(If, { condition: helpItemType === "slider" },
                    React.createElement(SatelliteGuide, { terria: this.props.terria, viewState: this.props.viewState })),
                React.createElement(If, { condition: helpItemType === "trainer" },
                    React.createElement(TrainerPane, { content: this.props.content, terria: this.props.terria, viewState: this.props.viewState }))))));
    }
};
HelpVideoPanel.displayName = "HelpVideoPanel";
HelpVideoPanel.propTypes = {
    terria: PropTypes.object.isRequired,
    viewState: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
    itemString: PropTypes.string,
    paneMode: PropTypes.string,
    markdownContent: PropTypes.string,
    videoUrl: PropTypes.string,
    placeholderImage: PropTypes.string,
    videoCoverImageOpacity: PropTypes.number,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
};
HelpVideoPanel = __decorate([
    observer
], HelpVideoPanel);
export default withTranslation()(withTheme(HelpVideoPanel));
//# sourceMappingURL=HelpVideoPanel.js.map