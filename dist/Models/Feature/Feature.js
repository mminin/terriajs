var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable } from "mobx";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
const customProperties = ["entityCollection", "properties", "data"];
/** Terria wrapper around Cesium Entity
 * Adds a few extra properties
 * -
 */
export default class TerriaFeature extends Entity {
    constructor(options) {
        super(options);
        /** Flag if loading featureInfoUrl (see `FeatureInfoUrlTemplateMixin.getFeaturesFromPickResult`) */
        this.loadingFeatureInfoUrl = false;
        addCustomFeatureProperties(this);
    }
    /**
     * Creates a new Feature from an Entity.
     * Note the custom properties are also copied into the new Feature properly.
     */
    static fromEntity(entity) {
        const feature = new TerriaFeature({ id: entity.id });
        feature.merge(entity);
        for (let i = 0; i < customProperties.length; i++) {
            if (entity.propertyNames.indexOf(customProperties[i]) === -1) {
                feature[customProperties[i]] = entity[customProperties[i]]; // Assume no merging or cloning needed.
            }
        }
        feature.cesiumEntity = entity;
        return feature;
    }
    /**
     * If the given entity is part of an entityCollection, and those entities are themselves features,
     * then return the matching feature from the collection.
     * Otherwise, return a new Feature from this entity.
     */
    static fromEntityCollectionOrEntity(entity) {
        // If this entity is part of a collection, get the feature with this id from that collection.
        let feature;
        if (entity.entityCollection) {
            feature = entity.entityCollection.getById(entity.id);
        }
        if (!feature || !(feature instanceof TerriaFeature)) {
            feature = TerriaFeature.fromEntity(entity);
        }
        return feature;
    }
}
__decorate([
    observable
], TerriaFeature.prototype, "loadingFeatureInfoUrl", void 0);
// Features have 'entityCollection', 'properties' and 'data' properties, which we must add to the entity's property list,
// if they're not already there. (In case they are added in a future version of Cesium.)
function addCustomFeatureProperties(entity) {
    for (let i = 0; i < customProperties.length; i++) {
        if (entity.propertyNames.indexOf(customProperties[i]) === -1) {
            entity.addProperty(customProperties[i]);
        }
    }
}
module.exports = TerriaFeature;
//# sourceMappingURL=Feature.js.map