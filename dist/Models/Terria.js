var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, observable, runInAction, toJS, when } from "mobx";
import { createTransformer } from "mobx-utils";
import buildModuleUrl from "terriajs-cesium/Source/Core/buildModuleUrl";
import Clock from "terriajs-cesium/Source/Core/Clock";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import defined from "terriajs-cesium/Source/Core/defined";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CesiumEvent from "terriajs-cesium/Source/Core/Event";
import queryToObject from "terriajs-cesium/Source/Core/queryToObject";
import RequestScheduler from "terriajs-cesium/Source/Core/RequestScheduler";
import RuntimeError from "terriajs-cesium/Source/Core/RuntimeError";
import SplitDirection from "terriajs-cesium/Source/Scene/SplitDirection";
import URI from "urijs";
import { Category, LaunchAction, DataSourceAction } from "../Core/AnalyticEvents/analyticEvents";
import AsyncLoader from "../Core/AsyncLoader";
import ConsoleAnalytics from "../Core/ConsoleAnalytics";
import CorsProxy from "../Core/CorsProxy";
import ensureSuffix from "../Core/ensureSuffix";
import filterOutUndefined from "../Core/filterOutUndefined";
import getDereferencedIfExists from "../Core/getDereferencedIfExists";
import getPath from "../Core/getPath";
import GoogleAnalytics from "../Core/GoogleAnalytics";
import hashEntity from "../Core/hashEntity";
import instanceOf from "../Core/instanceOf";
import isDefined from "../Core/isDefined";
import { isJsonBoolean, isJsonNumber, isJsonObject, isJsonString } from "../Core/Json";
import { isLatLonHeight } from "../Core/LatLonHeight";
import loadJson from "../Core/loadJson";
import loadJson5 from "../Core/loadJson5";
import Result from "../Core/Result";
import ServerConfig from "../Core/ServerConfig";
import TerriaError, { TerriaErrorSeverity } from "../Core/TerriaError";
import { getUriWithoutPath } from "../Core/uriHelpers";
import { featureBelongsToCatalogItem, isProviderCoordsMap } from "../Map/PickedFeatures/PickedFeatures";
import CatalogMemberMixin, { getName } from "../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../ModelMixins/GroupMixin";
import MappableMixin, { isDataSource } from "../ModelMixins/MappableMixin";
import ReferenceMixin from "../ModelMixins/ReferenceMixin";
import { defaultTerms } from "../ReactViewModels/defaultTerms";
import NotificationState from "../ReactViewModels/NotificationState";
import { SHARE_VERSION } from "../ReactViews/Map/Panels/SharePanel/BuildShareLink";
import { shareConvertNotification } from "../ReactViews/Notification/shareConvertNotification";
import MappableTraits from "../Traits/TraitsClasses/MappableTraits";
import MapNavigationModel from "../ViewModels/MapNavigation/MapNavigationModel";
import TerriaViewer from "../ViewModels/TerriaViewer";
import { BaseMapsModel } from "./BaseMaps/BaseMapsModel";
import CameraView from "./CameraView";
import Catalog from "./Catalog/Catalog";
import CatalogGroup from "./Catalog/CatalogGroup";
import CatalogMemberFactory from "./Catalog/CatalogMemberFactory";
import MagdaReference from "./Catalog/CatalogReferences/MagdaReference";
import SplitItemReference from "./Catalog/CatalogReferences/SplitItemReference";
import CommonStrata from "./Definition/CommonStrata";
import hasTraits from "./Definition/hasTraits";
import { BaseModel } from "./Definition/Model";
import updateModelFromJson from "./Definition/updateModelFromJson";
import upsertModelFromJson from "./Definition/upsertModelFromJson";
import { initializeErrorServiceProvider } from "./ErrorServiceProviders/ErrorService";
import StubErrorServiceProvider from "./ErrorServiceProviders/StubErrorServiceProvider";
import TerriaFeature from "./Feature/Feature";
import { isInitFromData, isInitFromDataPromise, isInitFromOptions, isInitFromUrl } from "./InitSource";
import Internationalization from "./Internationalization";
import NoViewer from "./NoViewer";
import { defaultRelatedMaps } from "./RelatedMaps";
import CatalogIndex from "./SearchProviders/CatalogIndex";
import TimelineStack from "./TimelineStack";
import { isViewerMode, setViewerMode } from "./ViewerMode";
import Workbench from "./Workbench";
export default class Terria {
    constructor(options = {}) {
        var _a, _b;
        this.models = observable.map();
        /** Map from share key -> id */
        this.shareKeysMap = observable.map();
        /** Map from id -> share keys */
        this.modelIdShareKeysMap = observable.map();
        /** Base URL for the Terria app. Used for SPA routes */
        this.appBaseHref = typeof document !== "undefined" ? document.baseURI : "/";
        /** Base URL to Terria resources */
        this.baseUrl = "build/TerriaJS/";
        this.tileLoadProgressEvent = new CesiumEvent();
        this.indeterminateTileLoadProgressEvent = new CesiumEvent();
        this.workbench = new Workbench();
        this.overlays = new Workbench();
        this.catalog = new Catalog(this);
        this.baseMapsModel = new BaseMapsModel("basemaps", this);
        this.timelineClock = new Clock({ shouldAnimate: false });
        this.elements = observable.map();
        this.mainViewer = new TerriaViewer(this, computed(() => filterOutUndefined(this.overlays.items
            .map((item) => (MappableMixin.isMixedInto(item) ? item : undefined))
            .concat(this.workbench.items.map((item) => MappableMixin.isMixedInto(item) ? item : undefined)))));
        this.appName = "TerriaJS App";
        this.supportEmail = "info@terria.io";
        /**
         * Gets or sets the {@link this.corsProxy} used to determine if a URL needs to be proxied and to proxy it if necessary.
         * @type {CorsProxy}
         */
        this.corsProxy = new CorsProxy();
        /**
         * Gets the stack of layers active on the timeline.
         */
        this.timelineStack = new TimelineStack(this, this.timelineClock);
        this.configParameters = {
            appName: "TerriaJS App",
            supportEmail: "info@terria.io",
            defaultMaximumShownFeatureInfos: 100,
            catalogIndexUrl: undefined,
            regionMappingDefinitionsUrl: undefined,
            regionMappingDefinitionsUrls: ["build/TerriaJS/data/regionMapping.json"],
            proj4ServiceBaseUrl: "proj4def/",
            corsProxyBaseUrl: "proxy/",
            proxyableDomainsUrl: "proxyabledomains/",
            serverConfigUrl: "serverconfig/",
            shareUrl: "share",
            feedbackUrl: undefined,
            initFragmentPaths: ["init/"],
            storyEnabled: true,
            interceptBrowserPrint: true,
            tabbedCatalog: false,
            useCesiumIonTerrain: true,
            cesiumTerrainUrl: undefined,
            cesiumTerrainAssetId: undefined,
            cesiumIonAccessToken: undefined,
            useCesiumIonBingImagery: undefined,
            bingMapsKey: undefined,
            hideTerriaLogo: false,
            brandBarElements: undefined,
            brandBarSmallElements: undefined,
            displayOneBrand: 0,
            disableMyLocation: undefined,
            disableSplitter: undefined,
            disablePedestrianMode: false,
            experimentalFeatures: undefined,
            magdaReferenceHeaders: undefined,
            locationSearchBoundingBox: undefined,
            googleAnalyticsKey: undefined,
            errorService: undefined,
            globalDisclaimer: undefined,
            theme: {},
            showWelcomeMessage: false,
            welcomeMessageVideo: {
                videoTitle: "Getting started with the map",
                videoUrl: "https://www.youtube-nocookie.com/embed/FjSxaviSLhc",
                placeholderImage: "https://img.youtube.com/vi/FjSxaviSLhc/maxresdefault.jpg"
            },
            storyVideo: {
                videoUrl: "https://www.youtube-nocookie.com/embed/fbiQawV8IYY"
            },
            showInAppGuides: false,
            helpContent: [],
            helpContentTerms: defaultTerms,
            languageConfiguration: undefined,
            customRequestSchedulerLimits: undefined,
            persistViewerMode: true,
            openAddData: false,
            feedbackPreamble: "translate#feedback.feedbackPreamble",
            feedbackPostamble: undefined,
            feedbackMinLength: 0,
            leafletAttributionPrefix: undefined,
            extraCreditLinks: [
                // Default credit links (shown at the bottom of the Cesium map)
                {
                    text: "map.extraCreditLinks.dataAttribution",
                    url: "about.html#data-attribution"
                },
                { text: "map.extraCreditLinks.disclaimer", url: "about.html#disclaimer" }
            ],
            printDisclaimer: undefined,
            storyRouteUrlPrefix: undefined,
            enableConsoleAnalytics: undefined,
            googleAnalyticsOptions: undefined,
            relatedMaps: defaultRelatedMaps,
            aboutButtonHrefUrl: "about.html",
            plugins: undefined
        };
        this.allowFeatureInfoRequests = true;
        /**
         * Gets or sets the stack of map interactions modes.  The mode at the top of the stack
         * (highest index) handles click interactions with the map
         */
        this.mapInteractionModeStack = [];
        this.isWorkflowPanelActive = false;
        this.userProperties = new Map();
        this.initSources = [];
        this._initSourceLoader = new AsyncLoader(this.forceLoadInitSources.bind(this));
        /* Splitter controls */
        this.showSplitter = false;
        this.splitPosition = 0.5;
        this.splitPositionVertical = 0.5;
        this.terrainSplitDirection = SplitDirection.NONE;
        this.depthTestAgainstTerrainEnabled = false;
        this.stories = [];
        this.storyPromptShown = 0; // Story Prompt modal will be rendered when this property changes. See StandardUserInterface, section regarding sui.notifications. Ideally move this to ViewState.
        /**
         * Base ratio for maximumScreenSpaceError
         * @type {number}
         */
        this.baseMaximumScreenSpaceError = 2;
        /**
         * Model to use for map navigation
         */
        this.mapNavigationModel = new MapNavigationModel(this);
        /**
         * Gets or sets whether to use the device's native resolution (sets cesium.viewer.resolutionScale to a ratio of devicePixelRatio)
         * @type {boolean}
         */
        this.useNativeResolution = false;
        /**
         * Whether we think all references in the catalog have been loaded
         * @type {boolean}
         */
        this.catalogReferencesLoaded = false;
        this.notificationState = new NotificationState();
        this.developmentEnv = ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) === "development";
        /**
         * An error service instance. The instance can be configured by setting the
         * `errorService` config parameter. Here we initialize it to stub provider so
         * that the `terria.errorService` always exists.
         */
        this.errorService = new StubErrorServiceProvider();
        if (options.appBaseHref) {
            this.appBaseHref = new URL(options.appBaseHref, typeof document !== "undefined" ? document.baseURI : "/").toString();
        }
        if (options.baseUrl) {
            this.baseUrl = ensureSuffix(options.baseUrl, "/");
        }
        this.cesiumBaseUrl = ensureSuffix((_b = options.cesiumBaseUrl) !== null && _b !== void 0 ? _b : `${this.baseUrl}build/Cesium/build/`, "/");
        // Casting to `any` as `setBaseUrl` method is not part of the Cesiums' type definitions
        buildModuleUrl.setBaseUrl(this.cesiumBaseUrl);
        this.analytics = options.analytics;
        if (!defined(this.analytics)) {
            if (typeof window !== "undefined" && defined(window.ga)) {
                this.analytics = new GoogleAnalytics();
            }
            else {
                this.analytics = new ConsoleAnalytics();
            }
        }
    }
    get baseMapContrastColor() {
        var _a, _b;
        return ((_b = (_a = this.baseMapsModel.baseMapItems.find((basemap) => {
            var _a, _b, _c;
            return isDefined((_a = basemap.item) === null || _a === void 0 ? void 0 : _a.uniqueId) &&
                ((_b = basemap.item) === null || _b === void 0 ? void 0 : _b.uniqueId) === ((_c = this.mainViewer.baseMap) === null || _c === void 0 ? void 0 : _c.uniqueId);
        })) === null || _a === void 0 ? void 0 : _a.contrastColor) !== null && _b !== void 0 ? _b : "#ffffff");
    }
    get previewedItemId() {
        return this._previewedItemId;
    }
    /** Raise error to user.
     *
     * This accepts same arguments as `TerriaError.from` - but also has:
     *
     * @param forceRaiseToUser - which can be used to force raise the error
     */
    raiseErrorToUser(error, overrides, forceRaiseToUser = false) {
        const terriaError = TerriaError.from(error, overrides);
        // Set shouldRaiseToUser true if forceRaiseToUser agrument is true
        if (forceRaiseToUser)
            terriaError.overrideRaiseToUser = true;
        // Log error to error service
        this.errorService.error(terriaError);
        // Only show error to user if `ignoreError` flag hasn't been set to "1"
        // Note: this will take precedence over forceRaiseToUser/overrideRaiseToUser
        if (this.userProperties.get("ignoreErrors") !== "1")
            this.notificationState.addNotificationToQueue(terriaError.toNotification());
        terriaError.log();
    }
    get currentViewer() {
        return this.mainViewer.currentViewer;
    }
    get cesium() {
        if (isDefined(this.mainViewer) &&
            this.mainViewer.currentViewer.type === "Cesium") {
            return this.mainViewer.currentViewer;
        }
    }
    /**
     * @returns The currently active `TerrainProvider` or `undefined`.
     */
    get terrainProvider() {
        var _a;
        return (_a = this.cesium) === null || _a === void 0 ? void 0 : _a.terrainProvider;
    }
    get leaflet() {
        if (isDefined(this.mainViewer) &&
            this.mainViewer.currentViewer.type === "Leaflet") {
            return this.mainViewer.currentViewer;
        }
    }
    get modelValues() {
        return Array.from(this.models.values());
    }
    get modelIds() {
        return Array.from(this.models.keys());
    }
    getModelById(type, id) {
        const model = this.models.get(id);
        if (instanceOf(type, model)) {
            return model;
        }
        // Model does not have the requested type.
        return undefined;
    }
    addModel(model, shareKeys) {
        if (model.uniqueId === undefined) {
            throw new DeveloperError("A model without a `uniqueId` cannot be added.");
        }
        if (this.models.has(model.uniqueId)) {
            throw new RuntimeError(`A model with the specified ID already exists: \`${model.uniqueId}\``);
        }
        this.models.set(model.uniqueId, model);
        shareKeys === null || shareKeys === void 0 ? void 0 : shareKeys.forEach((shareKey) => this.addShareKey(model.uniqueId, shareKey));
    }
    /**
     * Remove references to a model from Terria.
     */
    removeModelReferences(model) {
        this.removeSelectedFeaturesForModel(model);
        this.workbench.remove(model);
        if (model.uniqueId) {
            this.models.delete(model.uniqueId);
        }
    }
    removeSelectedFeaturesForModel(model) {
        const pickedFeatures = this.pickedFeatures;
        if (pickedFeatures) {
            // Remove picked features that belong to the catalog item
            pickedFeatures.features.forEach((feature, i) => {
                if (featureBelongsToCatalogItem(feature, model)) {
                    pickedFeatures === null || pickedFeatures === void 0 ? void 0 : pickedFeatures.features.splice(i, 1);
                    if (this.selectedFeature === feature)
                        this.selectedFeature = undefined;
                }
            });
        }
    }
    getModelIdByShareKey(shareKey) {
        return this.shareKeysMap.get(shareKey);
    }
    getModelByIdOrShareKey(type, id) {
        let model = this.getModelById(type, id);
        if (model) {
            return model;
        }
        else {
            const idFromShareKey = this.getModelIdByShareKey(id);
            return idFromShareKey !== undefined
                ? this.getModelById(type, idFromShareKey)
                : undefined;
        }
    }
    async getModelByIdShareKeyOrCatalogIndex(id) {
        try {
            // See if model exists by ID of sharekey
            const model = this.getModelByIdOrShareKey(BaseModel, id);
            // If no model exists, try to find it through Terria model sharekeys or CatalogIndex sharekeys
            if ((model === null || model === void 0 ? void 0 : model.uniqueId) !== undefined) {
                return new Result(model);
            }
            else if (this.catalogIndex) {
                try {
                    await this.catalogIndex.load();
                }
                catch (e) {
                    throw TerriaError.from(e, `Failed to load CatalogIndex while trying to load model \`${id}\``);
                }
                const indexModel = this.catalogIndex.getModelByIdOrShareKey(id);
                if (indexModel) {
                    (await indexModel.loadReference()).throwIfError();
                    return new Result(indexModel.target);
                }
            }
        }
        catch (e) {
            return Result.error(e);
        }
        return new Result(undefined);
    }
    addShareKey(id, shareKey) {
        var _a, _b;
        if (id === shareKey || this.shareKeysMap.has(shareKey))
            return;
        this.shareKeysMap.set(shareKey, id);
        (_b = (_a = this.modelIdShareKeysMap.get(id)) === null || _a === void 0 ? void 0 : _a.push(shareKey)) !== null && _b !== void 0 ? _b : this.modelIdShareKeysMap.set(id, [shareKey]);
    }
    /**
     * Initialize errorService from config parameters.
     */
    setupErrorServiceProvider(errorService) {
        initializeErrorServiceProvider(errorService)
            .then((errorService) => {
            this.errorService = errorService;
        })
            .catch((e) => {
            console.error("Failed to initialize error service", e);
        });
    }
    setupInitializationUrls(baseUri, config) {
        const initializationUrls = (config === null || config === void 0 ? void 0 : config.initializationUrls) || [];
        const initSources = initializationUrls.map((url) => ({
            name: `Init URL from config ${url}`,
            errorSeverity: TerriaErrorSeverity.Error,
            ...generateInitializationUrl(baseUri, this.configParameters.initFragmentPaths, url)
        }));
        // look for v7 catalogs -> push v7-v8 conversion to initSources
        if (Array.isArray(config === null || config === void 0 ? void 0 : config.v7initializationUrls)) {
            initSources.push(...config.v7initializationUrls
                .filter(isJsonString)
                .map((v7initUrl) => ({
                name: `V7 Init URL from config ${v7initUrl}`,
                errorSeverity: TerriaErrorSeverity.Error,
                data: (async () => {
                    try {
                        const [{ convertCatalog }, catalog] = await Promise.all([
                            import("catalog-converter"),
                            loadJson5(v7initUrl)
                        ]);
                        const convert = convertCatalog(catalog, { generateIds: false });
                        console.log(`WARNING: ${v7initUrl} is a v7 catalog - it has been upgraded to v8\nMessages:\n`);
                        convert.messages.forEach((message) => console.log(`- ${message.path.join(".")}: ${message.message}`));
                        return new Result({
                            data: convert.result || {}
                        });
                    }
                    catch (error) {
                        return Result.error(error, {
                            title: { key: "models.catalog.convertErrorTitle" },
                            message: {
                                key: "models.catalog.convertErrorMessage",
                                parameters: { url: v7initUrl }
                            }
                        });
                    }
                })()
            })));
        }
        this.initSources.push(...initSources);
    }
    async start(options) {
        var _a, _b, _c, _d;
        // Some hashProperties need to be set before anything else happens
        const hashProperties = queryToObject(new URI(window.location).fragment());
        if (isDefined(hashProperties["ignoreErrors"])) {
            this.userProperties.set("ignoreErrors", hashProperties["ignoreErrors"]);
        }
        this.shareDataService = options.shareDataService;
        // If in development environment, allow usage of #configUrl to set Terria config URL
        if (this.developmentEnv) {
            if (isDefined(hashProperties["configUrl"]) &&
                hashProperties["configUrl"] !== "")
                options.configUrl = hashProperties["configUrl"];
        }
        const baseUri = new URI(options.configUrl).filename("");
        const launchUrlForAnalytics = ((_a = options.applicationUrl) === null || _a === void 0 ? void 0 : _a.href) || getUriWithoutPath(baseUri);
        try {
            const config = await loadJson5(options.configUrl, options.configUrlHeaders);
            // If it's a magda config, we only load magda config and parameters should never be a property on the direct
            // config aspect (it would be under the `terria-config` aspect)
            if (isJsonObject(config) && config.aspects) {
                await this.loadMagdaConfig(options.configUrl, config, baseUri);
            }
            runInAction(() => {
                if (isJsonObject(config) && isJsonObject(config.parameters)) {
                    this.updateParameters(config.parameters);
                }
                if (this.configParameters.errorService) {
                    this.setupErrorServiceProvider(this.configParameters.errorService);
                }
                this.setupInitializationUrls(baseUri, config);
            });
        }
        catch (error) {
            this.raiseErrorToUser(error, {
                sender: this,
                title: { key: "models.terria.loadConfigErrorTitle" },
                message: `Couldn't load ${options.configUrl}`,
                severity: TerriaErrorSeverity.Error
            });
        }
        finally {
            if (!((_b = options.i18nOptions) === null || _b === void 0 ? void 0 : _b.skipInit)) {
                await Internationalization.initLanguage(this.configParameters.languageConfiguration, options.i18nOptions, this.baseUrl);
            }
        }
        setCustomRequestSchedulerDomainLimits(this.configParameters.customRequestSchedulerLimits);
        (_c = this.analytics) === null || _c === void 0 ? void 0 : _c.start(this.configParameters);
        (_d = this.analytics) === null || _d === void 0 ? void 0 : _d.logEvent(Category.launch, LaunchAction.url, launchUrlForAnalytics);
        this.serverConfig = new ServerConfig();
        const serverConfig = await this.serverConfig.init(this.configParameters.serverConfigUrl);
        await this.initCorsProxy(this.configParameters, serverConfig);
        if (this.shareDataService && this.serverConfig.config) {
            this.shareDataService.init(this.serverConfig.config);
        }
        // Create catalog index if catalogIndexUrl is set
        // Note: this isn't loaded now, it is loaded in first CatalogSearchProvider.doSearch()
        if (this.configParameters.catalogIndexUrl && !this.catalogIndex) {
            this.catalogIndex = new CatalogIndex(this, this.configParameters.catalogIndexUrl);
        }
        this.baseMapsModel
            .initializeDefaultBaseMaps()
            .catchError((error) => this.raiseErrorToUser(TerriaError.from(error, "Failed to load default basemaps")));
        if (typeof options.beforeRestoreAppState === "function") {
            try {
                await options.beforeRestoreAppState();
            }
            catch (error) {
                console.log(error);
            }
        }
        await this.restoreAppState(options);
    }
    async restoreAppState(options) {
        if (options.applicationUrl) {
            (await this.updateApplicationUrl(options.applicationUrl.href)).raiseError(this);
        }
        this.loadPersistedMapSettings();
    }
    loadPersistedMapSettings() {
        var _a;
        const persistViewerMode = this.configParameters.persistViewerMode;
        const hashViewerMode = this.userProperties.get("map");
        if (hashViewerMode && isViewerMode(hashViewerMode)) {
            setViewerMode(hashViewerMode, this.mainViewer);
        }
        else if (persistViewerMode) {
            const viewerMode = this.getLocalProperty("viewermode");
            if (isDefined(viewerMode) && isViewerMode(viewerMode)) {
                setViewerMode(viewerMode, this.mainViewer);
            }
        }
        const useNativeResolution = this.getLocalProperty("useNativeResolution");
        if (typeof useNativeResolution === "boolean") {
            this.setUseNativeResolution(useNativeResolution);
        }
        const baseMaximumScreenSpaceError = parseFloat(((_a = this.getLocalProperty("baseMaximumScreenSpaceError")) === null || _a === void 0 ? void 0 : _a.toString()) || "");
        if (!isNaN(baseMaximumScreenSpaceError)) {
            this.setBaseMaximumScreenSpaceError(baseMaximumScreenSpaceError);
        }
    }
    setUseNativeResolution(useNativeResolution) {
        this.useNativeResolution = useNativeResolution;
    }
    setBaseMaximumScreenSpaceError(baseMaximumScreenSpaceError) {
        this.baseMaximumScreenSpaceError = baseMaximumScreenSpaceError;
    }
    async loadPersistedOrInitBaseMap() {
        var _a;
        const baseMapItems = this.baseMapsModel.baseMapItems;
        // Set baseMap fallback to first option
        let baseMap = baseMapItems[0];
        const persistedBaseMapId = this.getLocalProperty("basemap");
        const baseMapSearch = baseMapItems.find((baseMapItem) => { var _a; return ((_a = baseMapItem.item) === null || _a === void 0 ? void 0 : _a.uniqueId) === persistedBaseMapId; });
        if ((baseMapSearch === null || baseMapSearch === void 0 ? void 0 : baseMapSearch.item) && MappableMixin.isMixedInto(baseMapSearch.item)) {
            baseMap = baseMapSearch;
        }
        else {
            // Try to find basemap using defaultBaseMapId and defaultBaseMapName
            const baseMapSearch = (_a = baseMapItems.find((baseMapItem) => { var _a; return ((_a = baseMapItem.item) === null || _a === void 0 ? void 0 : _a.uniqueId) === this.baseMapsModel.defaultBaseMapId; })) !== null && _a !== void 0 ? _a : baseMapItems.find((baseMapItem) => CatalogMemberMixin.isMixedInto(baseMapItem) &&
                baseMapItem.item.name ===
                    this.baseMapsModel.defaultBaseMapName);
            if ((baseMapSearch === null || baseMapSearch === void 0 ? void 0 : baseMapSearch.item) &&
                MappableMixin.isMixedInto(baseMapSearch.item)) {
                baseMap = baseMapSearch;
            }
        }
        await this.mainViewer.setBaseMap(baseMap.item);
    }
    get isLoadingInitSources() {
        return this._initSourceLoader.isLoading;
    }
    /**
     * Asynchronously loads init sources
     */
    loadInitSources() {
        return this._initSourceLoader.load();
    }
    dispose() {
        this._initSourceLoader.dispose();
    }
    async updateFromStartData(startData, 
    /** Name for startData initSources - this is only used for debugging purposes */
    name = "Application start data", 
    /** Error severity to use for loading startData init sources - default will be `TerriaErrorSeverity.Error` */
    errorSeverity) {
        try {
            await interpretStartData(this, startData, name, errorSeverity);
        }
        catch (e) {
            return Result.error(e);
        }
        return await this.loadInitSources();
    }
    async updateApplicationUrl(newUrl) {
        const uri = new URI(newUrl);
        const hash = uri.fragment();
        const hashProperties = queryToObject(hash);
        try {
            await interpretHash(this, hashProperties, this.userProperties, new URI(newUrl).filename("").query("").hash(""));
            if (!this.appBaseHref.endsWith("/")) {
                console.warn(`Terria expected appBaseHref to end with a "/" but appBaseHref is "${this.appBaseHref}". Routes may not work as intended. To fix this, try setting the "--baseHref" parameter to a URL with a trailing slash while building your map, or constructing the Terria object with an appropriate appBaseHref (with trailing slash).`);
            }
            // /catalog/ and /story/ routes
            if (newUrl.startsWith(this.appBaseHref)) {
                function checkSegments(urlSegments, customRoute) {
                    // Accept /${customRoute}/:some-id/ or /${customRoute}/:some-id
                    return (((urlSegments.length === 3 && urlSegments[2] === "") ||
                        urlSegments.length === 2) &&
                        urlSegments[0] === customRoute &&
                        urlSegments[1].length > 0);
                }
                const pageUrl = new URL(newUrl);
                // Find relative path from baseURI to documentURI excluding query and hash
                // then split into url segments
                // e.g. "http://ci.terria.io/main/story/1#map=2d" -> ["story", "1"]
                const segments = (pageUrl.origin + pageUrl.pathname)
                    .slice(this.appBaseHref.length)
                    .split("/");
                if (checkSegments(segments, "catalog")) {
                    this.initSources.push({
                        name: `Go to ${pageUrl.pathname}`,
                        errorSeverity: TerriaErrorSeverity.Error,
                        data: {
                            previewedItemId: decodeURIComponent(segments[1])
                        }
                    });
                    const replaceUrl = new URL(newUrl);
                    replaceUrl.pathname = new URL(this.appBaseHref).pathname;
                    history.replaceState({}, "", replaceUrl.href);
                }
                else if (checkSegments(segments, "story") &&
                    isDefined(this.configParameters.storyRouteUrlPrefix)) {
                    let storyJson;
                    try {
                        storyJson = await loadJson(`${this.configParameters.storyRouteUrlPrefix}${segments[1]}`);
                    }
                    catch (e) {
                        throw TerriaError.from(e, {
                            message: `Failed to fetch story \`"${this.appName}/${segments[1]}"\``
                        });
                    }
                    await interpretStartData(this, storyJson, `Start data from story \`"${this.appName}/${segments[1]}"\``);
                    runInAction(() => this.userProperties.set("playStory", "1"));
                }
            }
        }
        catch (e) {
            this.raiseErrorToUser(e);
        }
        return await this.loadInitSources();
    }
    updateParameters(parameters) {
        Object.entries(parameters).forEach(([key, value]) => {
            if (this.configParameters.hasOwnProperty(key)) {
                this.configParameters[key] = value;
            }
        });
        this.appName = defaultValue(this.configParameters.appName, this.appName);
        this.supportEmail = defaultValue(this.configParameters.supportEmail, this.supportEmail);
    }
    async forceLoadInitSources() {
        var _a;
        const loadInitSource = createTransformer(async (initSource) => {
            var _a;
            let initSourceData;
            if (isInitFromUrl(initSource)) {
                try {
                    const json = await loadJson5(initSource.initUrl);
                    if (isJsonObject(json, false)) {
                        initSourceData = json;
                    }
                }
                catch (e) {
                    throw TerriaError.from(e, {
                        message: {
                            key: "models.terria.loadingInitJsonMessage",
                            parameters: { url: initSource.initUrl }
                        }
                    });
                }
            }
            else if (isInitFromOptions(initSource)) {
                let error;
                for (const option of initSource.options) {
                    try {
                        initSourceData = await loadInitSource(option);
                        if (initSourceData !== undefined)
                            break;
                    }
                    catch (err) {
                        error = err;
                    }
                }
                if (initSourceData === undefined && error !== undefined)
                    throw error;
            }
            else if (isInitFromData(initSource)) {
                initSourceData = initSource.data;
            }
            else if (isInitFromDataPromise(initSource)) {
                initSourceData = (_a = (await initSource.data).throwIfError()) === null || _a === void 0 ? void 0 : _a.data;
            }
            return initSourceData;
        });
        const errors = [];
        // Load all init sources
        // Converts them to InitSourceFromData
        const loadedInitSources = await Promise.all(this.initSources.map(async (initSource) => {
            var _a;
            try {
                return {
                    name: initSource.name,
                    errorSeverity: initSource.errorSeverity,
                    data: await loadInitSource(initSource)
                };
            }
            catch (e) {
                errors.push(TerriaError.from(e, {
                    severity: initSource.errorSeverity,
                    message: {
                        key: "models.terria.loadingInitSourceError2Message",
                        parameters: { loadSource: (_a = initSource.name) !== null && _a !== void 0 ? _a : "Unknown source" }
                    }
                }));
            }
        }));
        // Sequentially apply all InitSources
        for (let i = 0; i < loadedInitSources.length; i++) {
            const initSource = loadedInitSources[i];
            if (!isDefined(initSource === null || initSource === void 0 ? void 0 : initSource.data))
                continue;
            try {
                await this.applyInitData({
                    initData: initSource.data
                });
            }
            catch (e) {
                errors.push(TerriaError.from(e, {
                    severity: initSource === null || initSource === void 0 ? void 0 : initSource.errorSeverity,
                    message: {
                        key: "models.terria.loadingInitSourceError2Message",
                        parameters: {
                            loadSource: (_a = initSource.name) !== null && _a !== void 0 ? _a : "Unknown source"
                        }
                    }
                }));
            }
        }
        // Load basemap
        runInAction(() => {
            if (!this.mainViewer.baseMap) {
                // Note: there is no "await" here - as basemaps can take a while to load and there is no need to wait for them to load before rendering Terria
                this.loadPersistedOrInitBaseMap();
            }
        });
        if (errors.length > 0) {
            // Note - this will get wrapped up in a Result object because it is called in AsyncLoader
            throw TerriaError.combine(errors, {
                title: { key: "models.terria.loadingInitSourcesErrorTitle" },
                message: {
                    key: "models.terria.loadingInitSourcesErrorMessage",
                    parameters: { appName: this.appName, email: this.supportEmail }
                }
            });
        }
    }
    async loadModelStratum(modelId, stratumId, allModelStratumData, replaceStratum) {
        const thisModelStratumData = allModelStratumData[modelId] || {};
        if (!isJsonObject(thisModelStratumData)) {
            throw new TerriaError({
                sender: this,
                title: "Invalid model traits",
                message: "The traits of a model must be a JSON object."
            });
        }
        const cleanStratumData = { ...thisModelStratumData };
        delete cleanStratumData.dereferenced;
        delete cleanStratumData.knownContainerUniqueIds;
        const errors = [];
        const containerIds = thisModelStratumData.knownContainerUniqueIds;
        if (Array.isArray(containerIds)) {
            // Groups that contain this item must be loaded before this item.
            await Promise.all(containerIds.map(async (containerId) => {
                if (typeof containerId !== "string") {
                    return;
                }
                const container = (await this.loadModelStratum(containerId, stratumId, allModelStratumData, replaceStratum)).pushErrorTo(errors, `Failed to load container ${containerId}`);
                if (container) {
                    const dereferenced = ReferenceMixin.isMixedInto(container)
                        ? container.target
                        : container;
                    if (GroupMixin.isMixedInto(dereferenced)) {
                        (await dereferenced.loadMembers()).pushErrorTo(errors, `Failed to load group ${dereferenced.uniqueId}`);
                    }
                }
            }));
        }
        const model = (await this.getModelByIdShareKeyOrCatalogIndex(modelId)).pushErrorTo(errors);
        if ((model === null || model === void 0 ? void 0 : model.uniqueId) !== undefined) {
            // Update modelId from model sharekeys or CatalogIndex sharekeys
            modelId = model.uniqueId;
        }
        // If this model is a `SplitItemReference` we must load the source item first
        const splitSourceId = cleanStratumData.splitSourceItemId;
        if (cleanStratumData.type === SplitItemReference.type &&
            typeof splitSourceId === "string") {
            (await this.loadModelStratum(splitSourceId, stratumId, allModelStratumData, replaceStratum)).pushErrorTo(errors, `Failed to load SplitItemReference ${splitSourceId}`);
        }
        const loadedModel = upsertModelFromJson(CatalogMemberFactory, this, "/", stratumId, {
            ...cleanStratumData,
            id: modelId
        }, {
            replaceStratum
        }).pushErrorTo(errors);
        if (loadedModel && Array.isArray(containerIds)) {
            containerIds.forEach((containerId) => {
                if (typeof containerId === "string" &&
                    loadedModel.knownContainerUniqueIds.indexOf(containerId) < 0) {
                    loadedModel.knownContainerUniqueIds.push(containerId);
                }
            });
        }
        // If we're replacing the stratum and the existing model is already
        // dereferenced, we need to replace the dereferenced stratum, too,
        // even if there's no trace of it in the load data.
        let dereferenced = isJsonObject(thisModelStratumData.dereferenced)
            ? thisModelStratumData.dereferenced
            : undefined;
        if (loadedModel &&
            replaceStratum &&
            dereferenced === undefined &&
            ReferenceMixin.isMixedInto(loadedModel) &&
            loadedModel.target !== undefined) {
            dereferenced = {};
        }
        if (loadedModel && ReferenceMixin.isMixedInto(loadedModel)) {
            (await loadedModel.loadReference()).pushErrorTo(errors, `Failed to load reference ${loadedModel.uniqueId}`);
            if (isDefined(loadedModel.target)) {
                updateModelFromJson(loadedModel.target, stratumId, dereferenced || {}, replaceStratum).pushErrorTo(errors, `Failed to update model from JSON: ${loadedModel.target.uniqueId}`);
            }
        }
        else if (dereferenced) {
            throw new TerriaError({
                sender: this,
                title: "Model cannot be dereferenced",
                message: `Model ${getName(loadedModel)} has a \`dereferenced\` property, but the model cannot be dereferenced.`
            });
        }
        if (loadedModel) {
            const dereferencedGroup = getDereferencedIfExists(loadedModel);
            if (GroupMixin.isMixedInto(dereferencedGroup)) {
                if (dereferencedGroup.isOpen) {
                    (await dereferencedGroup.loadMembers()).pushErrorTo(errors, `Failed to open group ${dereferencedGroup.uniqueId}`);
                }
            }
        }
        return new Result(loadedModel, TerriaError.combine(errors, {
            // This will set TerriaErrorSeverity to Error if the model which FAILED to load is in the workbench.
            severity: () => this.workbench.items.find((workbenchItem) => workbenchItem.uniqueId === modelId)
                ? TerriaErrorSeverity.Error
                : TerriaErrorSeverity.Warning,
            message: {
                key: "models.terria.loadModelErrorMessage",
                parameters: { model: modelId }
            }
        }));
    }
    async pushAndLoadMapItems(model, newItems, errors) {
        if (ReferenceMixin.isMixedInto(model)) {
            (await model.loadReference()).pushErrorTo(errors);
            if (model.target !== undefined) {
                await this.pushAndLoadMapItems(model.target, newItems, errors);
            }
            else {
                errors.push(TerriaError.from("Reference model has no target. Model Id: " + model.uniqueId));
            }
        }
        else if (GroupMixin.isMixedInto(model)) {
            (await model.loadMembers()).pushErrorTo(errors);
            model.memberModels.map(async (m) => {
                await this.pushAndLoadMapItems(m, newItems, errors);
            });
        }
        else if (MappableMixin.isMixedInto(model)) {
            newItems.push(model);
            (await model.loadMapItems()).pushErrorTo(errors);
        }
        else {
            errors.push(TerriaError.from("Can not load an un-mappable item to the map. Item Id: " +
                model.uniqueId));
        }
    }
    async applyInitData({ initData, replaceStratum = false, canUnsetFeaturePickingState = false }) {
        var _a;
        const errors = [];
        initData = toJS(initData);
        const stratumId = typeof initData.stratum === "string"
            ? initData.stratum
            : CommonStrata.definition;
        // Extract the list of CORS-ready domains.
        if (Array.isArray(initData.corsDomains)) {
            this.corsProxy.corsDomains.push(...initData.corsDomains);
        }
        // Add catalog members
        if (initData.catalog !== undefined) {
            this.catalog.group
                .addMembersFromJson(stratumId, initData.catalog)
                .pushErrorTo(errors);
        }
        // Show/hide elements in mapNavigationModel
        if (isJsonObject(initData.elements)) {
            this.elements.merge(initData.elements);
            // we don't want to go through all elements unless they are added.
            if (this.mapNavigationModel.items.length > 0) {
                this.elements.forEach((element, key) => {
                    if (isDefined(element.visible)) {
                        if (element.visible) {
                            this.mapNavigationModel.show(key);
                        }
                        else {
                            this.mapNavigationModel.hide(key);
                        }
                    }
                });
            }
        }
        // Add stories
        if (Array.isArray(initData.stories)) {
            this.stories = initData.stories;
            this.storyPromptShown++;
        }
        // Add map settings
        if (isJsonString(initData.viewerMode)) {
            const viewerMode = initData.viewerMode.toLowerCase();
            if (isViewerMode(viewerMode))
                setViewerMode(viewerMode, this.mainViewer);
        }
        if (isJsonObject(initData.baseMaps)) {
            this.baseMapsModel
                .loadFromJson(CommonStrata.definition, initData.baseMaps)
                .pushErrorTo(errors, "Failed to load basemaps");
        }
        if (isJsonObject(initData.homeCamera)) {
            this.loadHomeCamera(initData.homeCamera);
        }
        if (isJsonObject(initData.initialCamera)) {
            const initialCamera = CameraView.fromJson(initData.initialCamera);
            this.currentViewer.zoomTo(initialCamera, 2.0);
        }
        if (isJsonBoolean(initData.showSplitter)) {
            this.showSplitter = initData.showSplitter;
        }
        if (isJsonNumber(initData.splitPosition)) {
            this.splitPosition = initData.splitPosition;
        }
        if (isJsonObject(initData.settings)) {
            if (isJsonNumber(initData.settings.baseMaximumScreenSpaceError)) {
                this.setBaseMaximumScreenSpaceError(initData.settings.baseMaximumScreenSpaceError);
            }
            if (isJsonBoolean(initData.settings.useNativeResolution)) {
                this.setUseNativeResolution(initData.settings.useNativeResolution);
            }
            if (isJsonBoolean(initData.settings.alwaysShowTimeline)) {
                this.timelineStack.setAlwaysShowTimeline(initData.settings.alwaysShowTimeline);
            }
            if (isJsonString(initData.settings.baseMapId)) {
                this.mainViewer.setBaseMap((_a = this.baseMapsModel.baseMapItems.find((item) => item.item.uniqueId === initData.settings.baseMapId)) === null || _a === void 0 ? void 0 : _a.item);
            }
            if (isJsonNumber(initData.settings.terrainSplitDirection)) {
                this.terrainSplitDirection = initData.settings.terrainSplitDirection;
            }
            if (isJsonBoolean(initData.settings.depthTestAgainstTerrainEnabled)) {
                this.depthTestAgainstTerrainEnabled =
                    initData.settings.depthTestAgainstTerrainEnabled;
            }
        }
        // Copy but don't yet load the workbench.
        const workbench = Array.isArray(initData.workbench)
            ? initData.workbench.slice()
            : [];
        const timeline = Array.isArray(initData.timeline)
            ? initData.timeline.slice()
            : [];
        // NOTE: after this Promise, this function is no longer an `@action`
        const models = initData.models;
        if (isJsonObject(models, false)) {
            await Promise.all(Object.keys(models).map(async (modelId) => {
                (await this.loadModelStratum(modelId, stratumId, models, replaceStratum)).pushErrorTo(errors);
            }));
        }
        runInAction(() => {
            if (isJsonString(initData.previewedItemId)) {
                this._previewedItemId = initData.previewedItemId;
            }
        });
        // Set the new contents of the workbench.
        const newItemsRaw = filterOutUndefined(workbench.map((modelId) => {
            if (typeof modelId !== "string") {
                errors.push(new TerriaError({
                    sender: this,
                    title: "Invalid model ID in workbench",
                    message: "A model ID in the workbench list is not a string."
                }));
            }
            else {
                return this.getModelByIdOrShareKey(BaseModel, modelId);
            }
        }));
        const newItems = [];
        // Maintain the model order in the workbench.
        while (true) {
            const model = newItemsRaw.shift();
            if (model) {
                await this.pushAndLoadMapItems(model, newItems, errors);
            }
            else {
                break;
            }
        }
        newItems.forEach((item) => {
            var _a;
            // fire the google analytics event
            (_a = this.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.dataSource, DataSourceAction.addFromShareOrInit, getPath(item));
        });
        runInAction(() => (this.workbench.items = newItems));
        // For ids that don't correspond to models resolve an id by share keys
        const timelineWithShareKeysResolved = new Set(filterOutUndefined(timeline.map((modelId) => {
            if (typeof modelId !== "string") {
                errors.push(new TerriaError({
                    sender: this,
                    title: "Invalid model ID in timeline",
                    message: "A model ID in the timneline list is not a string."
                }));
            }
            else {
                if (this.getModelById(BaseModel, modelId) !== undefined) {
                    return modelId;
                }
                else {
                    return this.getModelIdByShareKey(modelId);
                }
            }
        })));
        // TODO: the timelineStack should be populated from the `timeline` property,
        // not from the workbench.
        runInAction(() => (this.timelineStack.items = this.workbench.items
            .filter((item) => {
            return (item.uniqueId && timelineWithShareKeysResolved.has(item.uniqueId));
            // && TODO: what is a good way to test if an item is of type TimeVarying.
        })
            .map((item) => item)));
        if (isJsonObject(initData.pickedFeatures)) {
            when(() => !(this.currentViewer instanceof NoViewer)).then(() => {
                if (isJsonObject(initData.pickedFeatures)) {
                    this.loadPickedFeatures(initData.pickedFeatures);
                }
            });
        }
        else if (canUnsetFeaturePickingState) {
            runInAction(() => {
                this.pickedFeatures = undefined;
                this.selectedFeature = undefined;
            });
        }
        if (errors.length > 0)
            throw TerriaError.combine(errors, {
                message: {
                    key: "models.terria.loadingInitSourceErrorTitle"
                }
            });
    }
    loadHomeCamera(homeCameraInit) {
        this.mainViewer.homeCamera = CameraView.fromJson(homeCameraInit);
    }
    /**
     * This method can be used to refresh magda based catalogue configuration. Useful if the catalogue
     * has items that are only available to authorised users.
     *
     * @param magdaCatalogConfigUrl URL of magda based catalogue configuration
     * @param config Optional. If present, use this magda based catalogue config instead of reloading.
     * @param configUrlHeaders  Optional. If present, the headers are added to above URL request.
     */
    async refreshCatalogMembersFromMagda(magdaCatalogConfigUrl, config, configUrlHeaders) {
        var _a, _b;
        const theConfig = config
            ? config
            : await loadJson5(magdaCatalogConfigUrl, configUrlHeaders);
        // force config (root group) id to be `/`
        const id = "/";
        this.removeModelReferences(this.catalog.group);
        let existingReference = this.getModelById(MagdaReference, id);
        if (existingReference === undefined) {
            existingReference = new MagdaReference(id, this);
            // Add model with terria aspects shareKeys
            this.addModel(existingReference, (_b = (_a = theConfig.aspects) === null || _a === void 0 ? void 0 : _a.terria) === null || _b === void 0 ? void 0 : _b.shareKeys);
        }
        const reference = existingReference;
        const magdaRoot = new URI(magdaCatalogConfigUrl)
            .path("")
            .query("")
            .toString();
        reference.setTrait(CommonStrata.definition, "url", magdaRoot);
        reference.setTrait(CommonStrata.definition, "recordId", id);
        reference.setTrait(CommonStrata.definition, "magdaRecord", theConfig);
        (await reference.loadReference(true)).raiseError(this, `Failed to load MagdaReference for record ${id}`);
        if (reference.target instanceof CatalogGroup) {
            runInAction(() => {
                this.catalog.group = reference.target;
            });
        }
    }
    async loadMagdaConfig(configUrl, config, baseUri) {
        var _a, _b, _c;
        const aspects = config.aspects;
        const configParams = (_a = aspects["terria-config"]) === null || _a === void 0 ? void 0 : _a.parameters;
        if (configParams) {
            this.updateParameters(configParams);
        }
        const initObj = aspects["terria-init"];
        if (isJsonObject(initObj)) {
            const { catalog, ...initObjWithoutCatalog } = initObj;
            /** Load the init data without the catalog yet, as we'll push the catalog
             * source up as an init source later */
            try {
                await this.applyInitData({
                    initData: initObjWithoutCatalog
                });
            }
            catch (e) {
                this.raiseErrorToUser(e, {
                    title: { key: "models.terria.loadingMagdaInitSourceErrorMessage" },
                    message: {
                        key: "models.terria.loadingMagdaInitSourceErrorMessage",
                        parameters: { url: configUrl }
                    }
                });
            }
        }
        if (aspects.group && aspects.group.members) {
            await this.refreshCatalogMembersFromMagda(configUrl, config);
        }
        this.setupInitializationUrls(baseUri, (_b = config.aspects) === null || _b === void 0 ? void 0 : _b["terria-config"]);
        /** Load up rest of terria catalog if one is inlined in terria-init */
        if ((_c = config.aspects) === null || _c === void 0 ? void 0 : _c["terria-init"]) {
            const { catalog, ...rest } = initObj;
            this.initSources.push({
                name: `Magda map-config aspect terria-init from ${configUrl}`,
                errorSeverity: TerriaErrorSeverity.Error,
                data: {
                    catalog: catalog
                }
            });
        }
    }
    async loadPickedFeatures(pickedFeatures) {
        var _a, _b;
        let vectorFeatures = [];
        let featureIndex = {};
        if (Array.isArray(pickedFeatures.entities)) {
            // Build index of terria features by a hash of their properties.
            const relevantItems = this.workbench.items.filter((item) => hasTraits(item, MappableTraits, "show") &&
                item.show &&
                MappableMixin.isMixedInto(item));
            relevantItems.forEach((item) => {
                const entities = item.mapItems
                    .filter(isDataSource)
                    .reduce((arr, ds) => arr.concat(ds.entities.values), []);
                entities.forEach((entity) => {
                    const feature = TerriaFeature.fromEntityCollectionOrEntity(entity);
                    const hash = hashEntity(feature, this);
                    featureIndex[hash] = (featureIndex[hash] || []).concat([feature]);
                });
            });
            // Go through the features we've got from terria match them up to the id/name info we got from the
            // share link, filtering out any without a match.
            vectorFeatures = filterOutUndefined(pickedFeatures.entities.map((e) => {
                if (isJsonObject(e) && typeof e.hash === "number") {
                    const features = featureIndex[e.hash] || [];
                    const match = features.find((f) => f.name === e.name);
                    return match;
                }
            }));
        }
        // Set the current pick location, if we have a valid coord
        const maybeCoords = pickedFeatures.pickCoords;
        const pickCoords = {
            latitude: maybeCoords === null || maybeCoords === void 0 ? void 0 : maybeCoords.lat,
            longitude: maybeCoords === null || maybeCoords === void 0 ? void 0 : maybeCoords.lng,
            height: maybeCoords === null || maybeCoords === void 0 ? void 0 : maybeCoords.height
        };
        if (isLatLonHeight(pickCoords) &&
            isProviderCoordsMap(pickedFeatures.providerCoords)) {
            this.currentViewer.pickFromLocation(pickCoords, pickedFeatures.providerCoords, vectorFeatures);
        }
        if ((_a = this.pickedFeatures) === null || _a === void 0 ? void 0 : _a.allFeaturesAvailablePromise) {
            // When feature picking is done, set the selected feature
            await ((_b = this.pickedFeatures) === null || _b === void 0 ? void 0 : _b.allFeaturesAvailablePromise);
        }
        runInAction(() => {
            var _a, _b, _c;
            (_a = this.pickedFeatures) === null || _a === void 0 ? void 0 : _a.features.forEach((feature) => {
                const hash = hashEntity(feature, this);
                featureIndex[hash] = (featureIndex[hash] || []).concat([feature]);
            });
            // Find picked feature by matching feature hash
            // Also try to match name if defined
            const current = pickedFeatures.current;
            if (isJsonObject(current) && typeof current.hash === "number") {
                const selectedFeature = (_b = (featureIndex[current.hash] || []).find((feature) => feature.name === current.name)) !== null && _b !== void 0 ? _b : (_c = featureIndex[current.hash]) === null || _c === void 0 ? void 0 : _c[0];
                if (selectedFeature) {
                    this.selectedFeature = selectedFeature;
                }
            }
        });
    }
    async initCorsProxy(config, serverConfig) {
        if (config.proxyableDomainsUrl) {
            console.warn(i18next.t("models.terria.proxyableDomainsDeprecation"));
        }
        this.corsProxy.init(serverConfig, this.configParameters.corsProxyBaseUrl, []);
    }
    getLocalProperty(key) {
        try {
            if (!defined(window.localStorage)) {
                return null;
            }
        }
        catch (e) {
            // SecurityError can arise if 3rd party cookies are blocked in Chrome and we're served in an iFrame
            return null;
        }
        var v = window.localStorage.getItem(this.appName + "." + key);
        if (v === "true") {
            return true;
        }
        else if (v === "false") {
            return false;
        }
        return v;
    }
    setLocalProperty(key, value) {
        try {
            if (!defined(window.localStorage)) {
                return false;
            }
        }
        catch (e) {
            return false;
        }
        window.localStorage.setItem(this.appName + "." + key, value.toString());
        return true;
    }
}
__decorate([
    observable
], Terria.prototype, "mainViewer", void 0);
__decorate([
    observable
], Terria.prototype, "configParameters", void 0);
__decorate([
    observable
], Terria.prototype, "pickedFeatures", void 0);
__decorate([
    observable
], Terria.prototype, "selectedFeature", void 0);
__decorate([
    observable
], Terria.prototype, "allowFeatureInfoRequests", void 0);
__decorate([
    observable
], Terria.prototype, "mapInteractionModeStack", void 0);
__decorate([
    observable
], Terria.prototype, "isWorkflowPanelActive", void 0);
__decorate([
    observable
], Terria.prototype, "selectableDimensionWorkflow", void 0);
__decorate([
    computed
], Terria.prototype, "baseMapContrastColor", null);
__decorate([
    observable
], Terria.prototype, "userProperties", void 0);
__decorate([
    observable
], Terria.prototype, "initSources", void 0);
__decorate([
    observable
], Terria.prototype, "serverConfig", void 0);
__decorate([
    observable
], Terria.prototype, "shareDataService", void 0);
__decorate([
    observable
], Terria.prototype, "showSplitter", void 0);
__decorate([
    observable
], Terria.prototype, "splitPosition", void 0);
__decorate([
    observable
], Terria.prototype, "splitPositionVertical", void 0);
__decorate([
    observable
], Terria.prototype, "terrainSplitDirection", void 0);
__decorate([
    observable
], Terria.prototype, "depthTestAgainstTerrainEnabled", void 0);
__decorate([
    observable
], Terria.prototype, "stories", void 0);
__decorate([
    observable
], Terria.prototype, "storyPromptShown", void 0);
__decorate([
    observable
], Terria.prototype, "_previewedItemId", void 0);
__decorate([
    observable
], Terria.prototype, "baseMaximumScreenSpaceError", void 0);
__decorate([
    observable
], Terria.prototype, "mapNavigationModel", void 0);
__decorate([
    observable
], Terria.prototype, "useNativeResolution", void 0);
__decorate([
    observable
], Terria.prototype, "catalogReferencesLoaded", void 0);
__decorate([
    computed
], Terria.prototype, "currentViewer", null);
__decorate([
    computed
], Terria.prototype, "cesium", null);
__decorate([
    computed
], Terria.prototype, "terrainProvider", null);
__decorate([
    computed
], Terria.prototype, "leaflet", null);
__decorate([
    computed
], Terria.prototype, "modelValues", null);
__decorate([
    computed
], Terria.prototype, "modelIds", null);
__decorate([
    action
], Terria.prototype, "addModel", null);
__decorate([
    action
], Terria.prototype, "removeModelReferences", null);
__decorate([
    action
], Terria.prototype, "removeSelectedFeaturesForModel", null);
__decorate([
    action
], Terria.prototype, "addShareKey", null);
__decorate([
    action
], Terria.prototype, "setUseNativeResolution", null);
__decorate([
    action
], Terria.prototype, "setBaseMaximumScreenSpaceError", null);
__decorate([
    action
], Terria.prototype, "updateParameters", null);
__decorate([
    action
], Terria.prototype, "applyInitData", null);
__decorate([
    action
], Terria.prototype, "loadHomeCamera", null);
__decorate([
    action
], Terria.prototype, "loadPickedFeatures", null);
function generateInitializationUrl(baseUri, initFragmentPaths, url) {
    if (url.toLowerCase().substring(url.length - 5) !== ".json") {
        return {
            options: initFragmentPaths.map((fragmentPath) => {
                return {
                    initUrl: new URI(fragmentPath)
                        .segment(url)
                        .suffix("json")
                        .absoluteTo(baseUri)
                        .toString()
                };
            })
        };
    }
    return {
        initUrl: new URI(url).absoluteTo(baseUri).toString()
    };
}
async function interpretHash(terria, hashProperties, userProperties, baseUri) {
    if (isDefined(hashProperties.clean)) {
        runInAction(() => {
            terria.initSources.splice(0, terria.initSources.length);
        });
    }
    runInAction(() => {
        Object.keys(hashProperties).forEach(function (property) {
            if (["clean", "hideWelcomeMessage", "start", "share"].includes(property))
                return;
            const propertyValue = hashProperties[property];
            if (defined(propertyValue) && propertyValue.length > 0) {
                userProperties.set(property, propertyValue);
            }
            else {
                const initSourceFile = generateInitializationUrl(baseUri, terria.configParameters.initFragmentPaths, property);
                terria.initSources.push({
                    name: `InitUrl from applicationURL hash ${property}`,
                    errorSeverity: TerriaErrorSeverity.Error,
                    ...initSourceFile
                });
            }
        });
    });
    if (isDefined(hashProperties.hideWelcomeMessage)) {
        terria.configParameters.showWelcomeMessage = false;
    }
    // a share link that hasn't been shortened: JSON embedded in URL (only works for small quantities of JSON)
    if (isDefined(hashProperties.start)) {
        try {
            const startData = JSON.parse(hashProperties.start);
            await interpretStartData(terria, startData, 'Start data from hash `"#start"` value', TerriaErrorSeverity.Error, false // Hide conversion warning message - as we assume that people using #start are embedding terria.
            );
        }
        catch (e) {
            throw TerriaError.from(e, {
                message: { key: "models.terria.parsingStartDataErrorMessage" },
                importance: -1
            });
        }
    }
    // Resolve #share=xyz with the share data service.
    if (hashProperties.share !== undefined &&
        terria.shareDataService !== undefined) {
        const shareProps = await terria.shareDataService.resolveData(hashProperties.share);
        await interpretStartData(terria, shareProps, `Start data from sharelink \`"${hashProperties.share}"\``);
    }
}
async function interpretStartData(terria, startData, 
/** Name for startData initSources - this is only used for debugging purposes */
name, 
/** Error severity to use for loading startData init sources - if not set, TerriaError will be propagated normally */
errorSeverity, showConversionWarning = true) {
    if (isJsonObject(startData, false)) {
        // Convert startData to v8 if necessary
        let startDataV8;
        try {
            if (
            // If startData.version has version 0.x.x - user catalog-converter to convert startData
            "version" in startData &&
                typeof startData.version === "string" &&
                startData.version.startsWith("0")) {
                const { convertShare } = await import("catalog-converter");
                const result = convertShare(startData);
                // Show warning messages if converted
                if (result.converted && showConversionWarning) {
                    terria.notificationState.addNotificationToQueue({
                        title: i18next.t("share.convertNotificationTitle"),
                        message: shareConvertNotification(result.messages)
                    });
                }
                startDataV8 = result.result;
            }
            else {
                startDataV8 = {
                    ...startData,
                    version: isJsonString(startData.version)
                        ? startData.version
                        : SHARE_VERSION,
                    initSources: Array.isArray(startData.initSources)
                        ? startData.initSources.filter((initSource) => isJsonString(initSource) || isJsonObject(initSource))
                        : []
                };
            }
            if (startDataV8 !== null && Array.isArray(startDataV8.initSources)) {
                // Push startData.initSources to terria.initSources array
                // Note startData.initSources can be an initUrl (string) or initData (InitDataSource/JsonObject)
                // Terria.initSources are different to startData.initSources
                // They need to be transformed into appropriate `InitSource`
                runInAction(() => {
                    terria.initSources.push(...startDataV8.initSources.map((initSource) => isJsonString(initSource)
                        ? // InitSourceFromUrl if string
                            {
                                name,
                                initUrl: initSource,
                                errorSeverity
                            }
                        : // InitSourceFromData if Json Object
                            {
                                name,
                                data: initSource,
                                errorSeverity
                            }));
                });
                // If initSources contain story - we disable the welcome message so there aren't too many modals/popups
                // We only check JSON share initSources - as URLs will be loaded in `forceLoadInitSources`
                if (startDataV8.initSources.some((initSource) => isJsonObject(initSource) &&
                    Array.isArray(initSource.stories) &&
                    initSource.stories.length)) {
                    terria.configParameters.showWelcomeMessage = false;
                }
            }
        }
        catch (error) {
            throw TerriaError.from(error, {
                title: { key: "share.convertErrorTitle" },
                message: { key: "share.convertErrorMessage" }
            });
        }
    }
}
function setCustomRequestSchedulerDomainLimits(customDomainLimits) {
    if (isDefined(customDomainLimits)) {
        Object.entries(customDomainLimits).forEach(([domain, limit]) => {
            RequestScheduler.requestsByServer[domain] = limit;
        });
    }
}
//# sourceMappingURL=Terria.js.map