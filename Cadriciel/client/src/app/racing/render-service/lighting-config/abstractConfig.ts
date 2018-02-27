export abstract class AbstractLightingConfig {
    public readonly AMBIENT_LIGHT_INTENSITY: number;
    public readonly DIRECTIONAL_LIGHT_INTENSITY: number;

    public readonly DIRECTIONAL_LIGHT_HUE: number;
    public readonly DIRECTIONAL_LIGHT_SATURATION: number;
    public readonly DIRECTIONAL_LIGHT_LUMINANCE: number;

    public readonly DIRECTIONAL_LIGHT_POSITION_X: number;
    public readonly DIRECTIONAL_LIGHT_POSITION_Y: number;
    public readonly DIRECTIONAL_LIGHT_POSITION_Z: number;
}
