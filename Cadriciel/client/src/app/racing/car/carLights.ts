import { Group, SpotLight, BoxGeometry, MeshBasicMaterial, Mesh, Object3D, Vector3 } from "three";
import { WHITE, RED, YELLOW } from "../constants";
import { CarLightConfig } from "./carLightsConfig";

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
                CarLightConfig.FRONT_INTENSITY,
                CarLightConfig.FRONT_MAX_DISTANCE,
                CarLightConfig.FRONT_ANGLE,
                CarLightConfig.FRONT_PENUMBRA, 1);
        } else {
            spotLight = new SpotLight(
                RED,
                CarLightConfig.BACK_INTENSITY_HIGH,
                CarLightConfig.BACK_MAX_DISTANCE,
                CarLightConfig.BACK_ANGLE,
                CarLightConfig.BACK_PENUMBRA, 1);
        }

        spotLight.position.add(this.positionSpotLight(lightIsLeft, lightIsFront));
        spotLight.target = this.attachTarget(lightIsFront ?
            -CarLightConfig.TARGET_DISTANCE_FROM_CAR : CarLightConfig.TARGET_DISTANCE_FROM_CAR);
        this.add(spotLight);
        this._spotlights.push(spotLight);
    }

    private positionSpotLight(lightIsLeft: boolean, lightIsFront: boolean): Vector3 {
        const position: Vector3 = new Vector3();
        position.setY(CarLightConfig.POSITION_Y);
        position.setX(lightIsLeft ? CarLightConfig.POSITION_LEFT : CarLightConfig.POSITION_RIGHT);
        position.setZ(lightIsFront ? CarLightConfig.POSITION_FRONT : CarLightConfig.POSITION_BACK);

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
        this._spotlights[CarLightConfig.BACK_LEFT_INDEX]
            .intensity = CarLightConfig.BACK_INTENSITY_HIGH;
        this._spotlights[CarLightConfig.BACK_RIGHT_INDEX]
            .intensity = CarLightConfig.BACK_INTENSITY_HIGH;
    }

    public turnBackLightsOff(): void {
        this._spotlights[CarLightConfig.BACK_LEFT_INDEX]
            .intensity = CarLightConfig.BACK_INTENSITY_LOW;
        this._spotlights[CarLightConfig.BACK_RIGHT_INDEX]
            .intensity = CarLightConfig.BACK_INTENSITY_LOW;
    }
}
