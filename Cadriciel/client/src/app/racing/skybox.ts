import { TrackType } from "../../../../common/racing/trackType";
import { NIGHT_SKYBOX, DEFAULT_SKYBOX } from "./constants";

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
