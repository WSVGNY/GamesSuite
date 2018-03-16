import { DEFAULT_SKYBOX, ATMOSPHERE_SKYBOX } from "../constants";
import { TrackType } from "../../../../../common/racing/trackType";

export class SkyBox {
    public static getPath(trackType: TrackType): string {
        switch (trackType) {
            case TrackType.Night:
                return ATMOSPHERE_SKYBOX;
            case TrackType.Default:
            default:
                return DEFAULT_SKYBOX;
        }
    }
}
