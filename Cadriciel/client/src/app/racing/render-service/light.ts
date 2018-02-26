import { Group, AmbientLight, DirectionalLight } from "three";
import { WHITE } from "../constants";
import { AbstractLightingConfig } from "./lighting-config/abstractConfig";
import { TrackType } from "../../../../../common/racing/trackType";
import { NightConfig } from "./lighting-config/nightConfig";
import { DefaultConfig } from "./lighting-config/defaultConfig";

const DIRECTIONAL_LIGHT_HUE: number = 0.1;
const DIRECTIONAL_LIGHT_SATURATION: number = 1;
const DIRECTIONAL_LIGHT_LUMINANCE: number = 0.95;

const DIRECTIONAL_LIGHT_POSITION_X: number = -1;
const DIRECTIONAL_LIGHT_POSITION_Y: number = 0.8;
const DIRECTIONAL_LIGHT_POSITION_Z: number = 1;

export class TrackLights extends Group {
    private lightingConfig: AbstractLightingConfig;
    private ambiantLight: AmbientLight;
    private directionalLight: DirectionalLight;

    public constructor(trackType: TrackType) {
        super();
        this.updateLightsToTrackType(trackType);
    }

    public updateLightsToTrackType(trackType: TrackType): void {
        this.chooseConfig(trackType);

        this.setAmbiantLight();
        this.setDirectionalLight();
    }

    private setAmbiantLight(): void {
        if (this.ambiantLight !== undefined) {
            this.remove(this.ambiantLight);
        }
        this.ambiantLight = new AmbientLight(WHITE, this.lightingConfig.AMBIENT_LIGHT_INTENSITY);
        this.add(this.ambiantLight);
    }

    private setDirectionalLight(): void {
        if (this.directionalLight !== undefined) {
            this.remove(this.directionalLight);
        }
        this.directionalLight = new DirectionalLight(WHITE, this.lightingConfig.DIRECTIONAL_LIGHT_INTENSITY);
        this.directionalLight.color.setHSL(DIRECTIONAL_LIGHT_HUE, DIRECTIONAL_LIGHT_SATURATION, DIRECTIONAL_LIGHT_LUMINANCE);
        this.directionalLight.position.set(DIRECTIONAL_LIGHT_POSITION_X, DIRECTIONAL_LIGHT_POSITION_Y, DIRECTIONAL_LIGHT_POSITION_Z);
        this.add(this.directionalLight);
    }

    private chooseConfig(trackType: TrackType): void {
        switch (trackType) {
            case TrackType.Night:
                this.lightingConfig = new NightConfig();
                break;
            case TrackType.Default:
            default:
                this.lightingConfig = new DefaultConfig();
                break;
        }
    }
}
