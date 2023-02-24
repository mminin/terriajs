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
import Box from "../../Styled/Box";
import { getParentGroups } from "../../Core/getPath";
import Text, { TextSpan } from "../../Styled/Text";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import { RawButton } from "../../Styled/Button";
import styled from "styled-components";
import getAncestors from "../../Models/getAncestors";
import getDereferencedIfExists from "../../Core/getDereferencedIfExists";
import { runInAction } from "mobx";
import CommonStrata from "../../Models/Definition/CommonStrata";
const RawButtonAndUnderline = styled(RawButton) `
  ${(props) => `
  &:hover, &:focus {
    text-decoration: underline ${props.theme.textDark};
  }`}
`;
let Breadcrumbs = class Breadcrumbs extends React.Component {
    async openInCatalog(items) {
        items.forEach((item) => {
            runInAction(() => {
                item.setTrait(CommonStrata.user, "isOpen", true);
            });
        });
        (await this.props.viewState.viewCatalogMember(items[0])).raiseError(this.props.viewState.terria);
        this.props.viewState.changeSearchState("");
    }
    render() {
        const parentGroups = this.props.previewed
            ? getParentGroups(this.props.previewed)
            : undefined;
        const ancestors = getAncestors(this.props.previewed).map((ancestor) => getDereferencedIfExists(ancestor));
        return (
        // Note: should it reset the text if a person deletes current search and starts a new search?
        React.createElement(Box, { left: true, styledMinHeight: "32px", fullWidth: true, backgroundColor: this.props.theme.greyLighter, paddedHorizontally: 2.4, paddedVertically: 1, wordBreak: "break-all" },
            React.createElement(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textDark, glyph: Icon.GLYPHS.globe }),
            React.createElement(Spacing, { right: 1.2 }),
            React.createElement(Box, { flexWrap: true }, parentGroups && (React.createElement(For, { each: "parent", index: "i", of: parentGroups },
                React.createElement(Choose, null,
                    React.createElement(When, { condition: i === parentGroups.length - 1 },
                        React.createElement(Text, { small: true, textDark: true }, parent)),
                    React.createElement(When, { condition: i <= 1 || i >= parentGroups.length - 2 },
                        React.createElement(RawButtonAndUnderline, { type: "button", onClick: () => this.openInCatalog(ancestors.slice(i, i + 1)) },
                            React.createElement(TextSpan, { small: true, textDark: true }, parent))),
                    React.createElement(When, { condition: i > 1 && i < parentGroups.length - 2 },
                        React.createElement(Text, { small: true, textDark: true }, "..."))),
                React.createElement(If, { condition: i !== parentGroups.length - 1 },
                    React.createElement(Box, { paddedHorizontally: 1 },
                        React.createElement(Text, { small: true, textDark: true }, ">"))))))));
    }
};
Breadcrumbs.propTypes = {
    terria: PropTypes.object,
    viewState: PropTypes.object,
    previewed: PropTypes.object,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
};
Breadcrumbs = __decorate([
    observer
], Breadcrumbs);
export default withTranslation()(withTheme(Breadcrumbs));
//# sourceMappingURL=Breadcrumbs.js.map