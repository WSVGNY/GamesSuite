import { AbstractLightingConfig } from "./abstractConfig";

export class NightConfig extends AbstractLightingConfig {
    public readonly AMBIENT_LIGHT_INTENSITY: number = 0.1;
    public readonly DIRECTIONAL_LIGHT_INTENSITY: number = 0.3;
    public readonly AMBIENT_LIGHT_INTENSITY_TOP_VIEW: number = 0.3;
    public readonly DIRECTIONAL_LIGHT_INTENSITY_TOP_VIEW: number = 0;

    public readonly DIRECTIONAL_LIGHT_HUE: number = 0.1;
    public readonly DIRECTIONAL_LIGHT_SATURATION: number = 1;
    public readonly DIRECTIONAL_LIGHT_LUMINANCE: number = 0.95;

    public readonly DIRECTIONAL_LIGHT_POSITION_X: number = -1;
    public readonly DIRECTIONAL_LIGHT_POSITION_Y: number = 0.8;
    public readonly DIRECTIONAL_LIGHT_POSITION_Z: number = 1;
}
