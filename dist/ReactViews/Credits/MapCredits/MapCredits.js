import { reaction } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Credits } from "../Credits";
import { CreditsContainer } from "../CreditsContainer";
import { DataAttributionModal } from "../DataAttribution/DataAttributionModal";
import { Spacer } from "../Spacer";
import { TerriaLogo } from "../TerriaLogo";
import { MapCreditLogo } from "./MapCreditLogo";
export const MapCredits = observer(({ currentViewer, hideTerriaLogo, credits }) => {
    const { t } = useTranslation();
    const [dataAttributionVisible, setDataAttributionVisible] = useState(false);
    const showDataAttribution = useCallback(() => {
        setDataAttributionVisible(true);
    }, [setDataAttributionVisible]);
    const hideDataAttribution = useCallback(() => {
        setDataAttributionVisible(false);
    }, [setDataAttributionVisible]);
    useEffect(() => {
        return reaction(() => currentViewer.attributions.length, () => {
            if (currentViewer.attributions &&
                currentViewer.attributions.length === 0) {
                hideDataAttribution();
            }
        });
    }, [currentViewer]);
    if (currentViewer.type === "none") {
        return React.createElement(CreditsContainer, null);
    }
    return (React.createElement(CreditsContainer, null,
        !hideTerriaLogo ? React.createElement(TerriaLogo, null) : null,
        React.createElement(MapCreditLogo, { currentViewer: currentViewer }),
        React.createElement(Credits, { credits: credits }),
        React.createElement(Spacer, null),
        currentViewer.attributions && currentViewer.attributions.length > 0 ? (React.createElement("a", { onClick: showDataAttribution }, t("map.extraCreditLinks.basemap"))) : null,
        dataAttributionVisible ? (React.createElement(DataAttributionModal, { closeModal: hideDataAttribution, attributions: currentViewer.attributions })) : null));
});
//# sourceMappingURL=MapCredits.js.map