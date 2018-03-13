import { Group, SpotLight, BoxGeometry, MeshBasicMaterial, Mesh, Object3D } from "three";
import { CarConfig } from "./carConfig";
import { WHITE, RED, YELLOW } from "../constants";

export class CarLights extends Group {

    private _spotlights: SpotLight[] = new Array();

    public constructor() {
        super();
        this.createSpotlight(WHITE, -1, 1, -1, -CarConfig.TARGET_DISTANCE_FROM_CAR);
        this.createSpotlight(WHITE, 1, 1, -1, -CarConfig.TARGET_DISTANCE_FROM_CAR);
        this.createSpotlight(RED, -1, 1, 1, CarConfig.TARGET_DISTANCE_FROM_CAR);
        this.createSpotlight(RED, 1, 1, 1, CarConfig.TARGET_DISTANCE_FROM_CAR);
    }

    private createSpotlight(color: number, positionX: number, positionY: number, positionZ: number, targetDistance: number): void {
        const spotLight: SpotLight = new SpotLight(
            color, 1, CarConfig.SPOTLIGHT_MAX_DISTANCE,
            CarConfig.SPOTLIGHT_ANGLE, CarConfig.SPOTLIGHT_PENUMBRA, 1);
        spotLight.position.set(positionX, positionY, positionZ);
        spotLight.target = this.attachTarget(targetDistance);
        this._spotlights.push(spotLight);
        this.add(this._spotlights[this._spotlights.length - 1]);
    }

    public turnBackLightsOn(): void {
        this.add(this._spotlights[CarConfig.SPOTLIGHT_BACK_LEFT]);
        this.add(this._spotlights[CarConfig.SPOTLIGHT_BACK_RIGHT]);
    }

    public turnBackLightsOff(): void {
        this.remove(this._spotlights[CarConfig.SPOTLIGHT_BACK_LEFT]);
        this.remove(this._spotlights[CarConfig.SPOTLIGHT_BACK_RIGHT]);
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
}
