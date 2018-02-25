import { Group, AmbientLight, DirectionalLight } from "three";
import { WHITE } from "../constants";
import { AbstractLightingConfig } from "./lighting-config/abstractConfig";
import { TrackType } from "../../../../../common/racing/trackType";
import { NightConfig } from "./lighting-config/nightConfig";
import { DefaultConfig } from "./lighting-config/defaultConfig";

export class TrackLights extends Group {
    private lightingConfig: AbstractLightingConfig;
    private ambiantLight: AmbientLight;
    private directionalLight: DirectionalLight;

    public constructor(trackType: TrackType) {
        super();
        this.update(trackType);
    }

    public update(trackType: TrackType): void {
        this.chooseConfig(trackType);
        if (this.ambiantLight !== undefined) {
            this.remove(this.ambiantLight);
            this.remove(this.directionalLight);
        }
        this.ambiantLight = new AmbientLight(WHITE, this.lightingConfig.AMBIENT_LIGHT_INTENSITY);
        this.directionalLight = new DirectionalLight(WHITE, this.lightingConfig.DIRECTIONAL_LIGHT_INTENSITY);

        this.add(this.ambiantLight);
        this.add(this.directionalLight);
        this.directionalLight.color.setHSL(0.1, 1, 0.95);
        this.directionalLight.position.set(-1, 0.8, 1);
        this.directionalLight.position.multiplyScalar(30);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        const d: number = 50;
        this.directionalLight.shadow.camera.left = -d;
        this.directionalLight.shadow.camera.right = d;
        this.directionalLight.shadow.camera.top = d;
        this.directionalLight.shadow.camera.bottom = -d;
        this.directionalLight.shadow.camera.far = 3500;
        this.directionalLight.shadow.bias = -0.0001;
        // const dirLightHeper: DirectionalLightHelper = new DirectionalLightHelper(this.directionalLight, 10);
        // this.add(dirLightHeper);
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
