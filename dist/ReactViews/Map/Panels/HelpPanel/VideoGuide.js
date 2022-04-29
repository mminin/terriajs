var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { withTheme } from "styled-components";
import Box from "../../../../Styled/Box";
import FadeIn from "../../../Transitions/FadeIn/FadeIn";
import Loader from "../../../Loader";
import { useKeyPress } from "../../../Hooks/useKeyPress.js";
import { RawButton } from "../../../../Styled/Button";
import Icon, { StyledIcon } from "../../../../Styled/Icon";
const VideoWrapperBox = props => {
    const { viewState } = props;
    const handleClose = () => viewState.setVideoGuideVisible("");
    useKeyPress("Escape", () => {
        handleClose();
    });
    return (React.createElement(Box, { centered: true, onClick: e => {
            e.stopPropagation();
            handleClose();
        }, css: `
        position: fixed;
        z-index: 99999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
      ` },
        React.createElement(Box, { paddedRatio: 4, position: "absolute", topRight: true },
            React.createElement(RawButton, { onClick: handleClose.bind(null) },
                React.createElement(StyledIcon, { styledWidth: "22px", light: true, glyph: Icon.GLYPHS.closeLight }))),
        props.children));
};
VideoWrapperBox.propTypes = {
    viewState: PropTypes.object.isRequired,
    children: PropTypes.node
};
let VideoGuide = class VideoGuide extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(FadeIn, { isVisible: this.props.viewState.videoGuideVisible === this.props.videoName },
            React.createElement(VideoWrapperBox, { viewState: this.props.viewState },
                React.createElement(Box, { centered: true, col11: true, styledHeight: "87%", backgroundImage: this.props.background, css: `
              svg {
                fill: #fff;
                width: 60px;
                height: 60px;
                top: -30px;
                left: -30px;
              }
            `, onClick: e => e.stopPropagation() },
                    React.createElement(Loader, { message: ` ` }),
                    React.createElement("iframe", { src: this.props.videoLink, allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture", css: `
                border: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              ` })))));
    }
};
VideoGuide.displayName = "VideoGuide";
VideoGuide.propTypes = {
    viewState: PropTypes.object.isRequired,
    videoName: PropTypes.string.isRequired,
    videoLink: PropTypes.string,
    background: PropTypes.string,
    theme: PropTypes.object,
    t: PropTypes.func
};
VideoGuide = __decorate([
    observer
], VideoGuide);
export default withTranslation()(withTheme(VideoGuide));
//# sourceMappingURL=VideoGuide.js.map