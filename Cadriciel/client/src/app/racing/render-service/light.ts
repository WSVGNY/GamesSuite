import { Group, AmbientLight, DirectionalLight } from "three";
import { WHITE } from "../constants";
import { AbstractLightingConfig } from "./lighting-config/abstractConfig";
import { TrackType } from "../../../../../common/racing/trackType";
import { NightConfig } from "./lighting-config/nightConfig";
import { DefaultConfig } from "./lighting-config/defaultConfig";

export class TrackLights extends Group {
    private _lightingConfig: AbstractLightingConfig;
    private _ambiantLight: AmbientLight;
    private _directionalLight: DirectionalLight;
    private _isPerspectiveView: boolean;

    public constructor(trackType: TrackType) {
        super();
        this._isPerspectiveView = true;
        this.updateLightsToTrackType(trackType);
    }

    public updateLightsToTrackType(trackType: TrackType): void {
        this.chooseConfig(trackType);
        this.setAmbiantLight();
        this.setDirectionalLight();
    }

    private setAmbiantLight(): void {
        if (this._ambiantLight === undefined) {
            this._ambiantLight = new AmbientLight(WHITE, this._lightingConfig.AMBIENT_LIGHT_INTENSITY);
            this.add(this._ambiantLight);
        }

        this._isPerspectiveView ?
            this._ambiantLight.intensity = this._lightingConfig.AMBIENT_LIGHT_INTENSITY :
            this._ambiantLight.intensity = this._lightingConfig.AMBIENT_LIGHT_INTENSITY_TOP_VIEW;
    }

    private setDirectionalLight(): void {
        if (this._directionalLight === undefined) {
            this._directionalLight = new DirectionalLight(WHITE, this._lightingConfig.DIRECTIONAL_LIGHT_INTENSITY);
            this.add(this._directionalLight);
        }
        this._directionalLight.color.setHSL(
            this._lightingConfig.DIRECTIONAL_LIGHT_HUE,
            this._lightingConfig.DIRECTIONAL_LIGHT_SATURATION,
            this._lightingConfig.DIRECTIONAL_LIGHT_LUMINANCE
        );
        this._directionalLight.position.set(
            this._lightingConfig.DIRECTIONAL_LIGHT_POSITION_X,
            this._lightingConfig.DIRECTIONAL_LIGHT_POSITION_Y,
            this._lightingConfig.DIRECTIONAL_LIGHT_POSITION_Z
        );
        this._isPerspectiveView ?
            this._directionalLight.intensity = this._lightingConfig.DIRECTIONAL_LIGHT_INTENSITY :
            this._directionalLight.intensity = this._lightingConfig.DIRECTIONAL_LIGHT_INTENSITY_TOP_VIEW;
    }

    public changePerspective(): void {
        this._isPerspectiveView = !this._isPerspectiveView;
        this._isPerspectiveView ?
            this._directionalLight.intensity = this._lightingConfig.DIRECTIONAL_LIGHT_INTENSITY :
            this._directionalLight.intensity = this._lightingConfig.DIRECTIONAL_LIGHT_INTENSITY_TOP_VIEW;
        this._isPerspectiveView ?
            this._ambiantLight.intensity = this._lightingConfig.AMBIENT_LIGHT_INTENSITY :
            this._ambiantLight.intensity = this._lightingConfig.AMBIENT_LIGHT_INTENSITY_TOP_VIEW;
    }

    private chooseConfig(trackType: TrackType): void {
        switch (trackType) {
            case TrackType.Night:
                this._lightingConfig = new NightConfig();
                break;
            case TrackType.Default:
            default:
                this._lightingConfig = new DefaultConfig();
                break;
        }
    }

}
