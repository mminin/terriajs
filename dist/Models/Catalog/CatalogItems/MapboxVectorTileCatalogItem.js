var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import bbox from "@turf/bbox";
import i18next from "i18next";
import { clone } from "lodash-es";
import { action, computed, observable, runInAction } from "mobx";
import ImageryLayerFeatureInfo from "terriajs-cesium/Source/Scene/ImageryLayerFeatureInfo";
import { json_style, LineSymbolizer, PolygonSymbolizer } from "terriajs-protomaps";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import TerriaError from "../../../Core/TerriaError";
import ProtomapsImageryProvider, { GeojsonSource } from "../../../Map/ProtomapsImageryProvider";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import LegendTraits, { LegendItemTraits } from "../../../Traits/TraitsClasses/LegendTraits";
import MapboxVectorTileCatalogItemTraits from "../../../Traits/TraitsClasses/MapboxVectorTileCatalogItemTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
class MapboxVectorTileLoadableStratum extends LoadableStratum(MapboxVectorTileCatalogItemTraits) {
    constructor(item, styleJson) {
        super();
        this.item = item;
        this.styleJson = styleJson;
    }
    duplicateLoadableStratum(newModel) {
        return new MapboxVectorTileLoadableStratum(newModel, this.styleJson);
    }
    static async load(item) {
        let styleJson;
        if (item.styleUrl) {
            try {
                styleJson = await loadJson(proxyCatalogItemUrl(item, item.styleUrl));
            }
            catch (e) {
                throw TerriaError.from(e, `Failed to load style JSON from url ${item.styleUrl}`);
            }
        }
        return new MapboxVectorTileLoadableStratum(item, styleJson);
    }
    get style() {
        return this.styleJson;
    }
    get opacity() {
        return 1;
    }
    get legends() {
        if (!this.item.fillColor && !this.item.lineColor)
            return [];
        return [
            createStratumInstance(LegendTraits, {
                items: [
                    createStratumInstance(LegendItemTraits, {
                        color: this.item.fillColor,
                        outlineColor: this.item.lineColor,
                        title: this.item.name
                    })
                ]
            })
        ];
    }
    get rectangle() {
        var _a;
        if (((_a = this.item.imageryProvider) === null || _a === void 0 ? void 0 : _a.source) instanceof GeojsonSource &&
            this.item.imageryProvider.source.geojsonObject) {
            const geojsonBbox = bbox(this.item.imageryProvider.source.geojsonObject);
            return createStratumInstance(RectangleTraits, {
                west: geojsonBbox[0],
                south: geojsonBbox[1],
                east: geojsonBbox[2],
                north: geojsonBbox[3]
            });
        }
    }
}
MapboxVectorTileLoadableStratum.stratumName = "MapboxVectorTileLoadable";
__decorate([
    computed
], MapboxVectorTileLoadableStratum.prototype, "legends", null);
__decorate([
    computed
], MapboxVectorTileLoadableStratum.prototype, "rectangle", null);
StratumOrder.addLoadStratum(MapboxVectorTileLoadableStratum.stratumName);
class MapboxVectorTileCatalogItem extends MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(MapboxVectorTileCatalogItemTraits)))) {
    constructor() {
        super(...arguments);
        this.forceProxy = true;
    }
    get type() {
        return MapboxVectorTileCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.mapboxVectorTile.name");
    }
    async forceLoadMetadata() {
        const stratum = await MapboxVectorTileLoadableStratum.load(this);
        runInAction(() => {
            this.strata.set(MapboxVectorTileLoadableStratum.stratumName, stratum);
        });
    }
    get parsedJsonStyle() {
        if (this.style) {
            return json_style(this.style, new Map());
        }
    }
    get paintRules() {
        let rules = [];
        if (this.layer) {
            if (this.fillColor) {
                rules.push({
                    dataLayer: this.layer,
                    symbolizer: new PolygonSymbolizer({ fill: this.fillColor }),
                    minzoom: this.minimumZoom,
                    maxzoom: this.maximumZoom
                });
            }
            if (this.lineColor) {
                rules.push({
                    dataLayer: this.layer,
                    symbolizer: new LineSymbolizer({ color: this.lineColor }),
                    minzoom: this.minimumZoom,
                    maxzoom: this.maximumZoom
                });
            }
        }
        if (this.parsedJsonStyle) {
            rules.push(...this.parsedJsonStyle.paint_rules);
        }
        return rules;
    }
    get labelRules() {
        if (this.parsedJsonStyle) {
            return this.parsedJsonStyle.label_rules;
        }
        return [];
    }
    get imageryProvider() {
        if (this.url === undefined) {
            return;
        }
        return new ProtomapsImageryProvider({
            terria: this.terria,
            data: this.url,
            minimumZoom: this.minimumZoom,
            maximumNativeZoom: this.maximumNativeZoom,
            maximumZoom: this.maximumZoom,
            credit: this.attribution,
            paintRules: this.paintRules,
            labelRules: this.labelRules
            // featureInfoFunc: this.featureInfoFromFeature,
        });
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        if (this.isLoadingMapItems || this.imageryProvider === undefined) {
            return [];
        }
        return [
            {
                imageryProvider: this.imageryProvider,
                show: this.show,
                alpha: this.opacity,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            }
        ];
    }
    featureInfoFromFeature(feature) {
        const featureInfo = new ImageryLayerFeatureInfo();
        if (isDefined(this.nameProperty)) {
            featureInfo.name = feature.properties[this.nameProperty];
        }
        featureInfo.properties = clone(feature.properties);
        featureInfo.data = {
            id: feature.properties[this.idProperty]
        }; // For highlight
        return featureInfo;
    }
}
MapboxVectorTileCatalogItem.type = "mvt";
__decorate([
    observable
], MapboxVectorTileCatalogItem.prototype, "forceProxy", void 0);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "parsedJsonStyle", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "paintRules", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "labelRules", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "imageryProvider", null);
__decorate([
    computed
], MapboxVectorTileCatalogItem.prototype, "mapItems", null);
__decorate([
    action.bound
], MapboxVectorTileCatalogItem.prototype, "featureInfoFromFeature", null);
export default MapboxVectorTileCatalogItem;
//# sourceMappingURL=MapboxVectorTileCatalogItem.js.map