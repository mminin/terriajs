import { observer } from "mobx-react";
import Mustache from "mustache";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useVirtual } from "react-virtual";
import styled from "styled-components";
import Box from "../../../Styled/Box";
import Button from "../../../Styled/Button";
import parseCustomMarkdownToReact from "../../Custom/parseCustomMarkdownToReact";
import MapEffects from "./MapEffects";
const SearchResults = (props) => {
    const { item, results } = props;
    const [currentMapEffect, setCurrentMapEffect] = useState({
        is: "highlightAll"
    });
    const selectedResult = currentMapEffect.is === "highlightSingleResult"
        ? currentMapEffect.result
        : undefined;
    const parentRef = React.createRef();
    const list = useVirtual({
        size: results.length,
        parentRef,
        estimateSize: React.useCallback(() => 50, [])
    });
    const [t] = useTranslation();
    const toggleSelection = (newSelection) => {
        currentMapEffect.is === newSelection.is &&
            currentMapEffect.result === newSelection.result
            ? setCurrentMapEffect({ is: "none" })
            : setCurrentMapEffect(newSelection);
    };
    return (React.createElement(Wrapper, null,
        React.createElement(ResultsCount, { count: results.length }),
        React.createElement(ActionMenu, null,
            React.createElement(ActionButton, { selected: currentMapEffect.is === "highlightAll", onClick: () => toggleSelection({ is: "highlightAll" }) }, t("itemSearchTool.actions.highlightAll")),
            React.createElement(ActionButton, { selected: currentMapEffect.is === "showMatchingOnly", onClick: () => toggleSelection({ is: "showMatchingOnly" }) }, t("itemSearchTool.actions.showMatchingOnly"))),
        React.createElement(List, { ref: parentRef, height: `250px` },
            React.createElement(ListInner, { height: `${list.totalSize}px` }, list.virtualItems.map(({ index, ...row }) => (React.createElement(Result, { key: results[index].id, result: results[index], isSelected: results[index].id === (selectedResult === null || selectedResult === void 0 ? void 0 : selectedResult.id), isEven: index % 2 === 0, onClick: () => toggleSelection({
                    is: "highlightSingleResult",
                    result: results[index]
                }), template: props.template, style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${row.size}px`,
                    transform: `translateY(${row.start}px)`
                } }))))),
        React.createElement(MapEffects, { effect: currentMapEffect, item: item, results: results })));
};
export const Result = observer((props) => {
    const { result, template, isEven, isSelected, style } = props;
    const content = template
        ? parseCustomMarkdownToReact(Mustache.render(template, result.properties))
        : result.id;
    const onClick = (e) => {
        try {
            props.onClick(result);
        }
        finally {
            e.preventDefault();
        }
    };
    return (React.createElement(ClickableItem, { role: "button", isEven: isEven, isSelected: isSelected, onClick: onClick, style: style }, content));
});
const ClickableItem = styled.a `
  display: block;
  box-sizing: border-box;
  padding: 5px 10px;
  cursor: pointer;
  ${(p) => `background-color: ${p.isSelected
    ? p.theme.toolPrimaryColor
    : p.isEven
        ? p.theme.dark
        : p.theme.darkLighter};`}
`;
const List = styled.div `
  ${(p) => `height: ${p.height}`};
  width: 100%;
  overflow: auto;
`;
const ListInner = styled.div `
  ${(p) => `height: ${p.height}`};
  width: 100%;
  position: relative;
`;
const Wrapper = styled(Box).attrs({ column: true, flex: 1 }) `
  > :only-child {
    flex: 1;
    align-self: center;
    align-items: center;
  }
`;
export const ResultsCount = ({ count }) => {
    const [t] = useTranslation();
    return (React.createElement(Box, { css: `
        margin-bottom: 1em;
        ${count === 0 ? "align-self: center;" : ""}
      ` }, t(`itemSearchTool.resultsCount`, { count })));
};
const ActionButton = styled(Button).attrs((props) => ({
    primary: props.selected,
    secondary: !props.selected,
    textProps: { medium: true }
})) `
  min-height: 20px;
  padding: 1em;
  padding-top: 2px;
  padding-bottom: 2px;
  border: 0px;
  border-radius: 5px;
`;
const ActionMenu = styled.div `
  display: flex;
  justify-content: flex-end;
  padding: 0.5em;
  background-color: ${(p) => p.theme.charcoalGrey};

  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  > ${ActionButton}:first-child {
    margin-right: 1em;
  }
`;
export default SearchResults;
//# sourceMappingURL=SearchResults.js.map