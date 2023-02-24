import BoundingSphere from "terriajs-cesium/Source/Core/BoundingSphere";
import BoundingSphereState from "terriajs-cesium/Source/DataSources/BoundingSphereState";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import DataSource from "terriajs-cesium/Source/DataSources/DataSource";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import EventHelper from "terriajs-cesium/Source/Core/EventHelper";
import isDefined from "../../Core/isDefined";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import L from "leaflet";
const createGuid = require("terriajs-cesium/Source/Core/createGuid").default;
const destroyObject = require("terriajs-cesium/Source/Core/destroyObject").default;
class LeafletDataSource extends DataSource {
}
/**
 * Visualizes a collection of {@link DataSource} instances in Leaflet.
 */
export default class LeafletDataSourceDisplay {
    constructor(options) {
        this._displayID = createGuid();
        this._scene = options.scene;
        this._dataSourceCollection = options.dataSourceCollection;
        this._visualizersCallback = defaultValue(options.visualizersCallback, LeafletDataSourceDisplay.defaultVisualizersCallback);
        this._eventHelper = new EventHelper();
        this._eventHelper.add(this._dataSourceCollection.dataSourceAdded, this._onDataSourceAdded, this);
        this._eventHelper.add(this._dataSourceCollection.dataSourceRemoved, this._onDataSourceRemoved, this);
        for (let i = 0, len = this._dataSourceCollection.length; i < len; i++) {
            this._onDataSourceAdded(this._dataSourceCollection, this._dataSourceCollection.get(i));
        }
        const defaultDataSource = new CustomDataSource();
        this._onDataSourceAdded(undefined, defaultDataSource);
        this._defaultDataSource = defaultDataSource;
        this._ready = false;
        this._lastTime = JulianDate.now();
    }
    /**
     * Gets or sets the default function which creates an array of visualizers used for visualization.
     * By default, this function uses all standard visualizers.
     *
     */
    static defaultVisualizersCallback(_leafletScene, _entityCluster, _dataSource) {
        return [];
    }
    /**
     * Updates the display to the provided time.
     *
     */
    update(time) {
        let result = true;
        let x;
        let visualizers;
        let vLength;
        const dataSources = this._dataSourceCollection;
        const length = dataSources.length;
        for (let i = 0; i < length; i++) {
            const dataSource = dataSources.get(i);
            if (isDefined(dataSource.update)) {
                result = dataSource.update(time) && result;
            }
            visualizers = this._getVisualizersForDataSource(dataSource);
            if (isDefined(visualizers)) {
                vLength = visualizers.length;
                for (x = 0; x < vLength; x++) {
                    result = visualizers[x].update(time) && result;
                }
            }
        }
        visualizers = this._getVisualizersForDataSource(this._defaultDataSource);
        if (isDefined(visualizers)) {
            vLength = visualizers.length;
            for (x = 0; x < vLength; x++) {
                result = visualizers[x].update(time) && result;
            }
        }
        this._ready = result;
        this._lastTime = JulianDate.clone(time, this._lastTime);
        return result;
    }
    destroy() {
        this._eventHelper.removeAll();
        const dataSourceCollection = this._dataSourceCollection;
        for (let i = 0, length = dataSourceCollection.length; i < length; ++i) {
            this._onDataSourceRemoved(this._dataSourceCollection, dataSourceCollection.get(i));
        }
        this._onDataSourceRemoved(undefined, this._defaultDataSource);
        return destroyObject(this);
    }
    _onDataSourceAdded(_dataSourceCollection, dataSource) {
        const visualizers = this._visualizersCallback(this._scene, undefined, dataSource);
        dataSource.visualizersByDisplayID = dataSource.visualizersByDisplayID || {};
        dataSource.visualizersByDisplayID[this._displayID] = visualizers;
        dataSource.visualizers = dataSource.visualizers || [];
        dataSource.visualizers = dataSource.visualizers.concat(visualizers);
    }
    _onDataSourceRemoved(_dataSourceCollection, dataSource) {
        const visualizers = this._getVisualizersForDataSource(dataSource);
        if (!isDefined(visualizers)) {
            return;
        }
        const length = visualizers.length;
        for (let i = 0; i < length; i++) {
            const visualizer = visualizers[i];
            visualizer.destroy();
            if (isDefined(dataSource.visualizers)) {
                const index = dataSource.visualizers.indexOf(visualizer);
                dataSource.visualizers.splice(index, 1);
            }
        }
        if (isDefined(dataSource.visualizersByDisplayID)) {
            delete dataSource.visualizersByDisplayID[this._displayID];
        }
    }
    _getVisualizersForDataSource(dataSource) {
        const visualizersByDisplayID = dataSource.visualizersByDisplayID;
        if (isDefined(visualizersByDisplayID) &&
            isDefined(visualizersByDisplayID[this._displayID])) {
            return visualizersByDisplayID[this._displayID];
        }
    }
    /**
     * Computes the rectangular bounds which encloses the visualization
     * produced for the given entities.
     */
    getLatLngBounds(dataSource) {
        this.update(this._lastTime);
        const visualizers = this._getVisualizersForDataSource(dataSource);
        if (!isDefined(visualizers)) {
            return;
        }
        let result;
        for (let j = 0, vLength = visualizers.length; j < vLength; j++) {
            const visualizer = visualizers[j];
            const bounds = visualizer.getLatLngBounds();
            if (bounds === undefined) {
                continue;
            }
            result =
                result === undefined
                    ? L.latLngBounds(bounds.getSouthWest(), bounds.getNorthEast())
                    : result.extend(bounds);
        }
        return result;
    }
    /**
     * Computes a bounding sphere which encloses the visualization produced for the specified entity.
     * The bounding sphere is in the fixed frame of the scene's globe.
     */
    getBoundingSphere(entity, allowPartial, result) {
        if (!this._ready) {
            return BoundingSphereState.PENDING;
        }
        let length;
        let dataSource = this._defaultDataSource;
        if (!dataSource.entities.contains(entity)) {
            dataSource = undefined;
            const dataSources = this._dataSourceCollection;
            length = dataSources.length;
            for (let i = 0; i < length; i++) {
                const d = dataSources.get(i);
                if (d.entities.contains(entity)) {
                    dataSource = d;
                    break;
                }
            }
        }
        if (!isDefined(dataSource) || !isDefined(dataSource.visualizers)) {
            return BoundingSphereState.FAILED;
        }
        const boundingSpheres = [];
        const tmp = new BoundingSphere();
        let count = 0;
        let state = BoundingSphereState.DONE;
        const visualizers = dataSource.visualizers;
        const visualizersLength = visualizers.length;
        for (let i = 0; i < visualizersLength; i++) {
            const visualizer = visualizers[i];
            if (isDefined(visualizer.getBoundingSphere)) {
                state = visualizer.getBoundingSphere(entity, tmp);
                if (!allowPartial && state === BoundingSphereState.PENDING) {
                    return BoundingSphereState.PENDING;
                }
                else if (state === BoundingSphereState.DONE) {
                    boundingSpheres[count] = BoundingSphere.clone(tmp, boundingSpheres[count]);
                    count++;
                }
            }
        }
        if (count === 0) {
            return BoundingSphereState.FAILED;
        }
        boundingSpheres.length = count;
        BoundingSphere.fromBoundingSpheres(boundingSpheres, result);
        return BoundingSphereState.DONE;
    }
}
//# sourceMappingURL=LeafletDataSourceDisplay.js.map