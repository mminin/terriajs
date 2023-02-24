import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "../../../../Styled/Box";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import { useCallbackRef } from "../../../useCallbackRef";
import { AdvancedOptions } from "./AdvancedOptions";
import { canShorten } from "./BuildShareLink";
import { PrintSection } from "./Print/PrintSection";
import { shouldShorten as shouldShortenDefault } from "./SharePanel";
import { ShareUrl, ShareUrlBookmark } from "./ShareUrl";
import { StyledHr } from "./StyledHr";
export const SharePanelContent = ({ terria, viewState, closePanel }) => {
    const { t } = useTranslation();
    const canShortenUrl = useMemo(() => !!canShorten(terria), [terria]);
    const [includeStoryInShare, setIncludeStoryInShare] = useState(true);
    const [shouldShorten, setShouldShorten] = useState(shouldShortenDefault(terria));
    const [_, update] = useState();
    const shareUrlRef = useCallbackRef(null, () => update({}));
    const includeStoryInShareOnChange = useCallback(() => {
        setIncludeStoryInShare((prevState) => !prevState);
    }, []);
    const shouldShortenOnChange = useCallback(() => {
        setShouldShorten((prevState) => {
            terria.setLocalProperty("shortenShareUrls", !prevState);
            return !prevState;
        });
    }, [terria]);
    return (React.createElement(Box, { paddedRatio: 2, column: true },
        React.createElement(Text, { medium: true }, t("clipboard.shareURL")),
        React.createElement(Spacing, { bottom: 1 }),
        React.createElement(ShareUrl, { theme: "dark", inputTheme: "dark", terria: terria, viewState: viewState, includeStories: includeStoryInShare, shouldShorten: shouldShorten, ref: shareUrlRef, callback: closePanel },
            React.createElement(ShareUrlBookmark, { viewState: viewState })),
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(PrintSection, { viewState: viewState }),
        React.createElement(StyledHr, null),
        React.createElement(AdvancedOptions, { canShortenUrl: canShortenUrl, shouldShorten: shouldShorten, shouldShortenOnChange: shouldShortenOnChange, includeStoryInShare: includeStoryInShare, includeStoryInShareOnChange: includeStoryInShareOnChange, shareUrl: shareUrlRef })));
};
//# sourceMappingURL=SharePanelContent.js.map