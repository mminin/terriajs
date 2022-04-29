var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action } from "mobx";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import EllipsoidTerrainProvider from "terriajs-cesium/Source/Core/EllipsoidTerrainProvider";
import KeyboardEventModifier from "terriajs-cesium/Source/Core/KeyboardEventModifier";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Matrix3 from "terriajs-cesium/Source/Core/Matrix3";
import Quaternion from "terriajs-cesium/Source/Core/Quaternion";
import sampleTerrainMostDetailed from "terriajs-cesium/Source/Core/sampleTerrainMostDetailed";
import ScreenSpaceEventHandler from "terriajs-cesium/Source/Core/ScreenSpaceEventHandler";
import ScreenSpaceEventType from "terriajs-cesium/Source/Core/ScreenSpaceEventType";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import makeRealPromise from "../../../Core/makeRealPromise";
const KeyMap = {
    KeyW: "forward",
    KeyA: "left",
    KeyS: "backward",
    KeyD: "right",
    Space: "up",
    ShiftLeft: "down",
    ShiftRight: "down"
};
export default class MovementsController {
    constructor(cesium, onMove, pedestrianHeight, maxVerticalLookAngle) {
        this.cesium = cesium;
        this.onMove = onMove;
        this.pedestrianHeight = pedestrianHeight;
        this.maxVerticalLookAngle = maxVerticalLookAngle;
        // Current mode
        this.mode = "walk";
        // Current active movements
        this.activeMovements = new Set();
        // True if we are currently updating surface height estimate
        this.isUpdatingSurfaceHeightEstimate = false;
        // True if we are currently animating surface height change
        this.isAnimatingSurfaceHeightChange = false;
        this.currentSurfaceHeightEstimate = this.camera.positionCartographic.height;
        this.updateSurfaceHeightEstimate();
    }
    get scene() {
        return this.cesium.scene;
    }
    get camera() {
        return this.scene.camera;
    }
    get currentPedestrianHeightFromSurface() {
        return (this.camera.positionCartographic.height -
            this.currentSurfaceHeightEstimate);
    }
    /**
     * moveAmount decides the motion speed.
     */
    get moveAmount() {
        // A higher value means more speed.
        // High speed at lower heights and fastly changing terrain
        // can cause jittery, unpleasant movement.
        const baseAmount = 0.2;
        return this.mode === "walk"
            ? baseAmount
            : // In fly mode we want higher speeds as greater heights
                Math.max(baseAmount, this.currentPedestrianHeightFromSurface / 100);
    }
    /**
     * Moves the camera forward and parallel to the surface by moveAmount
     */
    moveForward() {
        const direction = projectVectorToSurface(this.camera.direction, this.camera.position, this.scene.globe.ellipsoid);
        this.camera.move(direction, this.moveAmount);
    }
    /**
     * Moves the camera backward and parallel to the surface by moveAmount
     */
    moveBackward() {
        const direction = projectVectorToSurface(this.camera.direction, this.camera.position, this.scene.globe.ellipsoid);
        this.camera.move(direction, -this.moveAmount);
    }
    /**
     * Moves the camera left and parallel to the surface by moveAmount/4
     */
    moveLeft() {
        const direction = projectVectorToSurface(this.camera.right, this.camera.position, this.scene.globe.ellipsoid);
        this.camera.move(direction, -this.moveAmount / 4);
    }
    /**
     * Moves the camera right and parallel to the surface by moveAmount/4
     */
    moveRight() {
        const direction = projectVectorToSurface(this.camera.right, this.camera.position, this.scene.globe.ellipsoid);
        this.camera.move(direction, this.moveAmount / 4);
    }
    /**
     * Moves the camera up and perpendicular to the surface by moveAmount
     */
    moveUp() {
        const surfaceNormal = this.scene.globe.ellipsoid.geodeticSurfaceNormal(this.camera.position, new Cartesian3());
        this.camera.move(surfaceNormal, this.moveAmount);
    }
    /**
     * Moves the camera up and perpendicular to the surface by moveAmount
     */
    moveDown() {
        const surfaceNormal = this.scene.globe.ellipsoid.geodeticSurfaceNormal(this.camera.position, new Cartesian3());
        this.camera.move(surfaceNormal, -this.moveAmount);
    }
    look() {
        if (this.startMousePosition === undefined ||
            this.currentMousePosition === undefined)
            return;
        const startMousePosition = this.startMousePosition;
        const currentMousePosition = this.currentMousePosition;
        const camera = this.scene.camera;
        const canvas = this.scene.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const x = (currentMousePosition.x - startMousePosition.x) / width;
        const y = (currentMousePosition.y - startMousePosition.y) / height;
        const lookFactor = 0.1;
        const ellipsoid = this.scene.globe.ellipsoid;
        const surfaceNormal = ellipsoid.geodeticSurfaceNormal(camera.position, new Cartesian3());
        const surfaceTangent = projectVectorToSurface(camera.right, camera.position, this.scene.globe.ellipsoid);
        // Look left/right about the surface normal
        camera.look(surfaceNormal, x * lookFactor);
        // Look up/down about the surface tangent
        this.lookVertical(surfaceTangent, surfaceNormal, y * lookFactor);
    }
    /**
     * Look up/down limiting the maximum look angle to {@maxLookangle}
     *
     */
    lookVertical(lookAxis, surfaceNormal, lookAmount) {
        const camera = this.camera;
        const currentAngle = CesiumMath.toDegrees(Cartesian3.angleBetween(surfaceNormal, camera.up));
        const upAfterLook = rotateVectorAboutAxis(camera.up, lookAxis, lookAmount);
        const angleAfterLook = CesiumMath.toDegrees(Cartesian3.angleBetween(surfaceNormal, upAfterLook));
        // We apply NO friction when the camera angle with surface normal is decreasing
        // When the camera angle is increasing, we apply a friction which peaks as we approach
        // the maxLookAngle
        const maxLookAngle = this.maxVerticalLookAngle;
        const friction = angleAfterLook < currentAngle
            ? 1
            : (maxLookAngle - currentAngle) / maxLookAngle;
        camera.look(lookAxis, lookAmount * friction);
    }
    /**
     * Perform a move step
     */
    move(movement) {
        switch (movement) {
            case "forward":
                return this.moveForward();
            case "backward":
                return this.moveBackward();
            case "left":
                return this.moveLeft();
            case "right":
                return this.moveRight();
            case "up":
                return this.moveUp();
            case "down":
                return this.moveDown();
            case "look":
                return this.look();
        }
    }
    async updateSurfaceHeightEstimate() {
        if (this.isUpdatingSurfaceHeightEstimate) {
            // avoid concurrent queries
            return false;
        }
        this.isUpdatingSurfaceHeightEstimate = true;
        // In fly mode we sample only the terrain height
        // In walk mode we sample the terrain & scene height and
        // take the maximum of both
        const position = this.camera.position;
        try {
            const samples = await Promise.all([
                sampleTerrainHeight(this.scene, position),
                this.mode === "walk"
                    ? sampleSceneHeight(this.scene, position)
                    : undefined
            ]);
            const heights = filterOutUndefined(samples);
            if (heights.length > 0) {
                this.currentSurfaceHeightEstimate = Math.max(...heights);
                // trigger surface height change animation
                this.isAnimatingSurfaceHeightChange = true;
            }
        }
        catch {
            /* nothing to do */
        }
        finally {
            this.isUpdatingSurfaceHeightEstimate = false;
        }
    }
    /**
     * Animate pedestrian height to match the change in surface height
     */
    animateSurfaceHeightChange() {
        // round to 3 decimal places so that we converge to a stable height sooner
        const heightFromSurface = Math.round(this.currentPedestrianHeightFromSurface * 1000) / 1000;
        const hasReachedDesiredHeight = this.mode === "walk"
            ? heightFromSurface === this.pedestrianHeight
            : heightFromSurface >= this.pedestrianHeight;
        if (hasReachedDesiredHeight) {
            this.isAnimatingSurfaceHeightChange = false;
            return;
        }
        const gapHeight = this.pedestrianHeight - heightFromSurface;
        // If climbRate is atleast equal to moveAmount
        // we can ensure that going up an inclined slope of 45deg will
        // not result in the camera going underground.
        // When getting close to a building edge, we want the user
        // to be transported to the top, but very smoothly. To ensure smooth motion
        // we special case it by taking moveAmount / 4, if gapHeight is above 5metres.
        const climbRate = this.moveAmount / (Math.abs(gapHeight) > 5 ? 4 : 1);
        const climbHeight = gapHeight * climbRate;
        const surfaceNormal = this.scene.globe.ellipsoid.geodeticSurfaceNormal(this.camera.position, new Cartesian3());
        this.camera.move(surfaceNormal, climbHeight);
    }
    animate() {
        if (this.activeMovements.size > 0) {
            [...this.activeMovements].forEach(movement => this.move(movement));
            this.updateSurfaceHeightEstimate();
            this.onMove();
            if (this.activeMovements.has("down") &&
                this.currentPedestrianHeightFromSurface < this.pedestrianHeight &&
                this.mode !== "walk") {
                // Switch to walk mode when moving down and height is below the pedestrian height
                this.mode = "walk";
            }
            else if (this.activeMovements.has("up") && this.mode !== "fly") {
                // Switch to fly mode when moving up
                this.mode = "fly";
            }
        }
        if (this.isAnimatingSurfaceHeightChange) {
            this.animateSurfaceHeightChange();
        }
    }
    /**
     * Map keyboard events to movements
     */
    setupKeyMap() {
        const onKeyDown = (ev) => {
            if (
            // do not match if any modifiers are pressed so that we do not hijack window shortcuts.
            ev.ctrlKey === false &&
                ev.altKey === false &&
                KeyMap[ev.code] !== undefined)
                this.activeMovements.add(KeyMap[ev.code]);
        };
        const onKeyUp = (ev) => {
            if (KeyMap[ev.code] !== undefined)
                this.activeMovements.delete(KeyMap[ev.code]);
        };
        document.addEventListener("keydown", excludeInputEvents(onKeyDown), true);
        document.addEventListener("keyup", excludeInputEvents(onKeyUp), true);
        const keyMapDestroyer = () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        };
        return keyMapDestroyer;
    }
    /**
     * Map mouse events to movements
     */
    setupMouseMap() {
        const eventHandler = new ScreenSpaceEventHandler(this.scene.canvas);
        const startLook = (click) => {
            this.currentMousePosition = this.startMousePosition = click.position.clone();
            this.activeMovements.add("look");
        };
        const look = (movement) => {
            this.currentMousePosition = movement.endPosition.clone();
        };
        const stopLook = () => {
            this.activeMovements.delete("look");
            this.currentMousePosition = this.startMousePosition = undefined;
        };
        // User might try to turn while moving down (by pressing SHIFT)
        // so trigger look event even when SHIFT is pressed.
        eventHandler.setInputAction(startLook, ScreenSpaceEventType.LEFT_DOWN);
        eventHandler.setInputAction(startLook, ScreenSpaceEventType.LEFT_DOWN, KeyboardEventModifier.SHIFT);
        eventHandler.setInputAction(look, ScreenSpaceEventType.MOUSE_MOVE);
        eventHandler.setInputAction(look, ScreenSpaceEventType.MOUSE_MOVE, KeyboardEventModifier.SHIFT);
        eventHandler.setInputAction(stopLook, ScreenSpaceEventType.LEFT_UP);
        eventHandler.setInputAction(stopLook, ScreenSpaceEventType.LEFT_UP, KeyboardEventModifier.SHIFT);
        const mouseMapDestroyer = () => eventHandler.destroy();
        return mouseMapDestroyer;
    }
    /**
     * Animate on each clock tick
     */
    startAnimating() {
        const stopAnimating = this.cesium.cesiumWidget.clock.onTick.addEventListener(this.animate.bind(this));
        return stopAnimating;
    }
    /**
     * Activates MovementsController
     *
     * 1. Disables default map interactions.
     * 2. Sets up keyboard, mouse & animation event handlers.
     *
     * @returns A function to de-activate the movements controller
     */
    activate() {
        // Disable other map controls
        this.scene.screenSpaceCameraController.enableTranslate = false;
        this.scene.screenSpaceCameraController.enableRotate = false;
        this.scene.screenSpaceCameraController.enableLook = false;
        this.scene.screenSpaceCameraController.enableTilt = false;
        this.scene.screenSpaceCameraController.enableZoom = false;
        this.cesium.isFeaturePickingPaused = true;
        const destroyKeyMap = this.setupKeyMap();
        const destroyMouseMap = this.setupMouseMap();
        const stopAnimating = this.startAnimating();
        const deactivate = action(() => {
            destroyKeyMap();
            destroyMouseMap();
            stopAnimating();
            const screenSpaceCameraController = this.scene
                .screenSpaceCameraController;
            // screenSpaceCameraController will be undefined if the cesium map is already destroyed
            if (screenSpaceCameraController !== undefined) {
                screenSpaceCameraController.enableTranslate = true;
                screenSpaceCameraController.enableRotate = true;
                screenSpaceCameraController.enableLook = true;
                screenSpaceCameraController.enableTilt = true;
                screenSpaceCameraController.enableZoom = true;
            }
            this.cesium.isFeaturePickingPaused = false;
        });
        return deactivate;
    }
}
__decorate([
    action
], MovementsController.prototype, "activate", null);
const sampleScratch = new Cartographic();
/**
 * Sample the terrain height at the given position
 */
async function sampleTerrainHeight(scene, position) {
    const terrainProvider = scene.terrainProvider;
    if (terrainProvider instanceof EllipsoidTerrainProvider)
        return 0;
    const [sample] = await makeRealPromise(sampleTerrainMostDetailed(terrainProvider, [
        Cartographic.fromCartesian(position, scene.globe.ellipsoid, sampleScratch)
    ]));
    return sample.height;
}
/**
 * Sample the scene height at the given position
 *
 * Scene height is the maximum height of a tileset feature or any other entity
 * at the given position.
 */
function sampleSceneHeight(scene, position) {
    if (scene.sampleHeightSupported === false)
        return;
    return scene.sampleHeight(Cartographic.fromCartesian(position, undefined, sampleScratch));
}
/**
 * Projects the {@vector} to the surface plane containing {@position}
 *
 * @param vector The input vector to project
 * @param position The position used to determine the surface plane
 * @param ellipsoid The ellipsoid used to compute the surface plane
 * @returns The projection of {@vector} on the surface plane at the given {@position}
 */
function projectVectorToSurface(vector, position, ellipsoid) {
    const surfaceNormal = ellipsoid.geodeticSurfaceNormal(position, new Cartesian3());
    const magnitudeOfProjectionOnSurfaceNormal = Cartesian3.dot(vector, surfaceNormal);
    const projectionOnSurfaceNormal = Cartesian3.multiplyByScalar(surfaceNormal, magnitudeOfProjectionOnSurfaceNormal, new Cartesian3());
    const projectionOnSurface = Cartesian3.subtract(vector, projectionOnSurfaceNormal, new Cartesian3());
    return projectionOnSurface;
}
const rotateScratchQuaternion = new Quaternion();
const rotateScratchMatrix = new Matrix3();
/**
 * Rotates a vector about rotateAxis by rotateAmount
 */
function rotateVectorAboutAxis(vector, rotateAxis, rotateAmount) {
    const quaternion = Quaternion.fromAxisAngle(rotateAxis, -rotateAmount, rotateScratchQuaternion);
    const rotation = Matrix3.fromQuaternion(quaternion, rotateScratchMatrix);
    const rotatedVector = Matrix3.multiplyByVector(rotation, vector, vector.clone());
    return rotatedVector;
}
// A regex matching input tag names
const inputNodeRe = /input|textarea|select/i;
function excludeInputEvents(handler) {
    return ev => {
        var _a, _b;
        const target = ev.target;
        if (target !== null) {
            const nodeName = target.nodeName;
            const isContentEditable = (_b = (_a = target).getAttribute) === null || _b === void 0 ? void 0 : _b.call(_a, "contenteditable");
            if (isContentEditable || inputNodeRe.test(nodeName)) {
                return;
            }
        }
        handler(ev);
    };
}
//# sourceMappingURL=MovementsController.js.map