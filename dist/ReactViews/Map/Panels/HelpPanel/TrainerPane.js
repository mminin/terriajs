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
import styled from "styled-components";
import StyledHtml from "./StyledHtml";
import Box, { BoxSpan } from "../../../../Styled/Box";
import Button from "../../../../Styled/Button";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import { applyTranslationIfExists } from "../../../../Language/languageHelpers";
const UlTrainerItems = styled(Box).attrs({
    as: "ul"
}) `
  ${(p) => p.theme.removeListStyles()}
`;
const TrainerButton = styled(Button) ``;
let TrainerPane = class TrainerPane extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { content, i18n, viewState } = this.props;
        const { trainerItems, markdownText } = content;
        return (React.createElement(Text, { textDark: true, noFontSize: true },
            React.createElement(Box, { column: true },
                markdownText && (React.createElement(StyledHtml, { viewState: viewState, markdown: markdownText })),
                (trainerItems === null || trainerItems === void 0 ? void 0 : trainerItems.map) && (React.createElement(UlTrainerItems, { column: true, fullWidth: true, justifySpaceBetween: true }, trainerItems.map((item, index) => (React.createElement("li", { key: index },
                    React.createElement(TrainerButton, { secondary: true, fullWidth: true, onClick: () => {
                            viewState.hideHelpPanel();
                            viewState.setSelectedTrainerItem(content.itemName);
                            viewState.setCurrentTrainerItemIndex(index);
                            viewState.setTrainerBarVisible(true);
                        } },
                        React.createElement(BoxSpan, { centered: true },
                            React.createElement(BoxSpan, { centered: true }, applyTranslationIfExists(item.title, i18n)))),
                    React.createElement(Spacing, { bottom: 2 })))))))));
    }
};
TrainerPane.displayName = "TrainerPane";
TrainerPane.propTypes = {
    viewState: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
    t: PropTypes.func,
    i18n: PropTypes.object.isRequired
};
TrainerPane = __decorate([
    observer
], TrainerPane);
export default withTranslation()(withTheme(TrainerPane));
//# sourceMappingURL=TrainerPane.js.map