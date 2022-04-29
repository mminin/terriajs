var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import createStratumInstance from "../../../Models/Definition/createStratumInstance";
import GeoJsonCatalogItem from "../../../Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import StyleTraits from "../../../Traits/TraitsClasses/StyleTraits";
let PointOnMap = class PointOnMap extends React.Component {
    componentDidMount() {
        const props = this.props;
        const pointItem = new GeoJsonCatalogItem(createGuid(), props.terria);
        pointItem.setTrait(CommonStrata.user, "style", createStratumInstance(StyleTraits, {
            "stroke-width": 3,
            "marker-size": "30",
            stroke: "#ffffff",
            "marker-color": props.color,
            "marker-opacity": 1
        }));
        pointItem.setTrait(CommonStrata.user, "geoJsonData", {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Point",
                coordinates: [props.point.longitude, props.point.latitude]
            }
        });
        props.terria.addModel(pointItem);
        props.terria.overlays.add(pointItem);
        this.pointItem = pointItem;
    }
    componentWillUnmount() {
        if (this.pointItem) {
            this.props.terria.overlays.remove(this.pointItem);
            this.props.terria.removeModelReferences(this.pointItem);
        }
    }
    render() {
        return null;
    }
};
__decorate([
    observable
], PointOnMap.prototype, "pointItem", void 0);
__decorate([
    action
], PointOnMap.prototype, "componentDidMount", null);
__decorate([
    action
], PointOnMap.prototype, "componentWillUnmount", null);
PointOnMap = __decorate([
    observer
], PointOnMap);
export default PointOnMap;
//# sourceMappingURL=PointOnMap.js.map