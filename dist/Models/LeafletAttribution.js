var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction, observable } from "mobx";
import L from "leaflet";
export class LeafletAttribution extends L.Control.Attribution {
    constructor(terria) {
        const options = {
            position: "bottomleft"
        };
        if (terria.configParameters.leafletAttributionPrefix) {
            options.prefix = terria.configParameters.leafletAttributionPrefix;
        }
        super(options);
        this._attributions = {};
        this.dataAttributions = observable([]);
    }
    onAdd(map) {
        map.attributionControl = this;
        this.map = map;
        this._container = L.DomUtil.create("div", "leaflet-control-attribution");
        L.DomEvent.disableClickPropagation(this._container);
        map.eachLayer((layer) => {
            if (layer.getAttribution) {
                const att = layer.getAttribution();
                if (att)
                    this.addAttribution(att);
            }
        });
        return this._container;
    }
    onRemove() {
        this.map = undefined;
    }
    _update() {
        if (!this.map) {
            return;
        }
        const attribs = [];
        const attributions = this._attributions;
        for (const i in attributions) {
            if (attributions[i]) {
                attribs.push(i);
            }
        }
    }
    addAttribution(text) {
        super.addAttribution(text);
        if (this.map) {
            runInAction(() => {
                this.dataAttributions.push(text);
            });
        }
        return this;
    }
    removeAttribution(text) {
        super.removeAttribution(text);
        if (this.map) {
            runInAction(() => {
                this.dataAttributions.remove(text);
            });
        }
        return this;
    }
    get attributions() {
        const attributionsList = [];
        const attributions = this._attributions;
        for (const i in attributions) {
            if (attributions[i]) {
                attributionsList.push(i);
            }
        }
        return attributionsList;
    }
    get prefix() {
        if (!this.options.prefix)
            return undefined;
        return `${this.options.prefix}`;
    }
}
__decorate([
    observable
], LeafletAttribution.prototype, "dataAttributions", void 0);
//# sourceMappingURL=LeafletAttribution.js.map