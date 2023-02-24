import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getName } from "../../ModelMixins/CatalogMemberMixin";
import Styles from "./feature-info-catalog-item.scss";
import FeatureInfoSection from "./FeatureInfoSection";
export default observer((props) => {
    var _a;
    const { t } = useTranslation();
    const features = props.features;
    const catalogItem = props.catalogItem;
    const terria = props.viewState.terria;
    const maximumShownFeatureInfos = (_a = catalogItem.maximumShownFeatureInfos) !== null && _a !== void 0 ? _a : terria.configParameters.defaultMaximumShownFeatureInfos;
    const hiddenNumber = features.length - maximumShownFeatureInfos; // A positive hiddenNumber => some are hidden; negative means none are.
    return (React.createElement("li", null,
        React.createElement("ul", { className: Styles.sections },
            hiddenNumber === 1 ? (React.createElement("li", { className: Styles.messageItem },
                React.createElement("strong", null, t("featureInfo.catalogItem.moreThanMax", {
                    maximum: maximumShownFeatureInfos,
                    catalogItemName: getName(catalogItem)
                })),
                React.createElement("br", null),
                t("featureInfo.catalogItem.featureInfoShown", {
                    maximum: maximumShownFeatureInfos
                }))) : null,
            hiddenNumber > 1 ? (React.createElement("li", { className: Styles.messageItem },
                React.createElement("strong", null, t("featureInfo.catalogItem.featuresFound", {
                    featCount: features.length,
                    catalogItemName: getName(catalogItem)
                })),
                React.createElement("br", null),
                t("featureInfo.catalogItem.featureInfoShown", {
                    maximum: maximumShownFeatureInfos
                }))) : null,
            features.slice(0, maximumShownFeatureInfos).map((feature, i) => {
                var _a;
                return (React.createElement(FeatureInfoSection, { key: i, catalogItem: catalogItem, feature: feature, position: (_a = terria.pickedFeatures) === null || _a === void 0 ? void 0 : _a.pickPosition, isOpen: !!(feature === terria.selectedFeature || props.printView), onClickHeader: props.onToggleOpen, printView: props.printView }));
            }))));
});
//# sourceMappingURL=FeatureInfoCatalogItem.js.map