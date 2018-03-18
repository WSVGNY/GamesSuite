import { DEFAULT_SKYBOX, NIGHT_SKYBOX } from "../constants";
import { TrackType } from "../../../../../common/racing/trackType";

export class SkyBox {
    public static getPath(trackType: TrackType): string {
        switch (trackType) {
            case TrackType.Night:
                return NIGHT_SKYBOX;
            case TrackType.Default:
            default:
                return DEFAULT_SKYBOX;
        }
    }
}
