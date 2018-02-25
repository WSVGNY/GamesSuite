import { AbstractLightingConfig } from "./abstractConfig";

export class DefaultConfig extends AbstractLightingConfig {
    public readonly AMBIENT_LIGHT_INTENSITY: number = 0.5;
    public readonly DIRECTIONAL_LIGHT_INTENSITY: number = 1;
}
