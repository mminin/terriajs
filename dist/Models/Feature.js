var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import { observable } from "mobx";
const customProperties = ["entityCollection", "properties", "data"];
/**
 * A feature is just a Cesium Entity, with observable (ie. knockout-tracked) properties added for
 * currentDescription and currentProperties. These are tracked so that the feature info updates as the clock time changes,
 * because the properties and description themselves do not change (they are functions of the time, whose values change).
 * Set these if needed from an event listener on the terria clock, eg.
 *       terria.clock.onTick.addEventListener(function(clock) {
 *           if (typeof feature.description.getValue === 'function') {
 *               feature.currentDescription = feature.description.getValue(clock.currentTime);
 *           };
 *           if (typeof feature.properties.getValue === 'function') {
 *               feature.currentProperties = feature.properties.getValue(clock.currentTime);
 *           };
 *       });
 *
 * @alias Feature
 * @constructor
 * @param {Object} [options] Object with the same properties as Cesium's Entity.
 * @extends Entity
 */
export default class Feature extends Entity {
    constructor(options) {
        super(options);
        /**
         * Gets or sets the current properties. This property is observable.
         */
        this.currentProperties = undefined;
        /**
         * Gets or sets the current description. This property is observable.
         */
        this.currentDescription = undefined;
        /**
         * Gets or sets counter objects used to trigger an update of the Feature Info Section,
         * to allow custom components to self-update. The object keys are timeoutIds, and values are
         * {reactComponent: ReactComponent, counter: Integer}.
         * This property is observable.
         */
        this.updateCounters = undefined;
        addCustomFeatureProperties(this);
    }
    /**
     * Creates a new Feature from an Entity.
     * Note the custom properties are also copied into the new Feature properly.
     */
    static fromEntity(entity) {
        const feature = new Feature({ id: entity.id });
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
        if (!feature || !(feature instanceof Feature)) {
            feature = Feature.fromEntity(entity);
        }
        return feature;
    }
}
__decorate([
    observable
], Feature.prototype, "currentProperties", void 0);
__decorate([
    observable
], Feature.prototype, "currentDescription", void 0);
__decorate([
    observable
], Feature.prototype, "updateCounters", void 0);
// Features have 'entityCollection', 'properties' and 'data' properties, which we must add to the entity's property list,
// if they're not already there. (In case they are added in a future version of Cesium.)
function addCustomFeatureProperties(entity) {
    for (let i = 0; i < customProperties.length; i++) {
        if (entity.propertyNames.indexOf(customProperties[i]) === -1) {
            entity.addProperty(customProperties[i]);
        }
    }
}
module.exports = Feature;
//# sourceMappingURL=Feature.js.map