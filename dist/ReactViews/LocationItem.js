import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import prettifyCoordinates from "../Map/prettifyCoordinates";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Styles from "./location-item.scss";
export default function LocationItem(props) {
    let latitude = "";
    let longitude = "";
    if (props.position) {
        const cartesianPosition = props.position;
        const catographic = Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);
        const latitudeRaw = CesiumMath.toDegrees(catographic.latitude);
        const longitudeRaw = CesiumMath.toDegrees(catographic.longitude);
        const pretty = prettifyCoordinates(longitudeRaw, latitudeRaw);
        latitude = pretty.latitude;
        longitude = pretty.longitude;
    }
    const { t } = useTranslation();
    return (React.createElement("div", { className: Styles.location },
        React.createElement("span", null, t("featureInfo.latLon")),
        React.createElement("span", null, latitude + ", " + longitude)));
}
LocationItem.propTypes = {
    position: PropTypes.object
};
//# sourceMappingURL=LocationItem.js.map