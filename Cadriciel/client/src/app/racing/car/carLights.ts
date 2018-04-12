import { Group, SpotLight, BoxGeometry, MeshBasicMaterial, Mesh, Object3D, Vector3 } from "three";
import { WHITE, RED, YELLOW } from "../constants/color.constants";
import { DEG_TO_RAD } from "../constants/math.constants";

export const FRONT_LEFT_INDEX: number = 0;
export const FRONT_RIGHT_INDEX: number = 1;
export const BACK_LEFT_INDEX: number = 2;
export const BACK_RIGHT_INDEX: number = 3;

export const POSITION_Y: number = -0.4;
export const POSITION_RIGHT: number = 0.5;
export const POSITION_LEFT: number = -POSITION_RIGHT;
export const POSITION_FRONT: number = -1.5;
export const POSITION_BACK: number = 1.5;

export const TARGET_DISTANCE_FROM_CAR: number = 30;

export const FRONT_INTENSITY: number = 1;

export const FRONT_MAX_DISTANCE: number = 70;
export const FRONT_OPENING: number = 30;
export const FRONT_ANGLE: number = FRONT_OPENING * DEG_TO_RAD;
export const FRONT_PENUMBRA: number = 0.5;

export const BACK_INTENSITY_HIGH: number = 0.5;
export const BACK_INTENSITY_LOW: number = 0.2;

export const BACK_MAX_DISTANCE: number = 35;
export const BACK_OPENING: number = 30;
export const BACK_ANGLE: number = BACK_OPENING * DEG_TO_RAD;
export const BACK_PENUMBRA: number = 0.2;

export class CarLights extends Group {

    private _spotlights: SpotLight[];

    public constructor() {
        super();
        this._spotlights = [];
        this.createSpotlight(true, true);
        this.createSpotlight(false, true);
        this.createSpotlight(true, false);
        this.createSpotlight(false, false);
    }

    private createSpotlight(lightIsLeft: boolean, lightIsFront: boolean): void {
        let spotLight: SpotLight;
        if (lightIsFront) {
            spotLight = new SpotLight(
                WHITE,
                FRONT_INTENSITY,
                FRONT_MAX_DISTANCE,
                FRONT_ANGLE,
                FRONT_PENUMBRA, 1);
        } else {
            spotLight = new SpotLight(
                RED,
                BACK_INTENSITY_HIGH,
                BACK_MAX_DISTANCE,
                BACK_ANGLE,
                BACK_PENUMBRA, 1);
        }

        spotLight.position.add(this.positionSpotLight(lightIsLeft, lightIsFront));
        spotLight.target = this.attachTarget(lightIsFront ?
            - TARGET_DISTANCE_FROM_CAR : TARGET_DISTANCE_FROM_CAR);
        this.add(spotLight);
        this._spotlights.push(spotLight);
    }

    private positionSpotLight(lightIsLeft: boolean, lightIsFront: boolean): Vector3 {
        const position: Vector3 = new Vector3();
        position.setY(POSITION_Y);
        position.setX(lightIsLeft ? POSITION_LEFT : POSITION_RIGHT);
        position.setZ(lightIsFront ? POSITION_FRONT : POSITION_BACK);

        return position;
    }

    public attachTarget(distance: number): Mesh {
        const geometry: BoxGeometry = new BoxGeometry(0, 0, 0);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: YELLOW });
        const cube: Mesh = new Mesh(geometry, material);
        cube.position.set(0, 0, distance);
        this.add(cube);

        return cube;
    }

    public attachCube(cube: Object3D): void {
        this.add(cube);
    }

    public turnOn(): void {
        this._spotlights.forEach((light: SpotLight) => {
            light.intensity = 1;
        });
    }

    public turnOff(): void {
        this._spotlights.forEach((light: SpotLight) => {
            light.intensity = 0;
        });
    }

    public turnBackLightsOn(): void {
        this._spotlights[BACK_LEFT_INDEX]
            .intensity = BACK_INTENSITY_HIGH;
        this._spotlights[BACK_RIGHT_INDEX]
            .intensity = BACK_INTENSITY_HIGH;
    }

    public turnBackLightsOff(): void {
        this._spotlights[BACK_LEFT_INDEX]
            .intensity = BACK_INTENSITY_LOW;
        this._spotlights[BACK_RIGHT_INDEX]
            .intensity = BACK_INTENSITY_LOW;
    }
}
