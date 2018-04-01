import { TrackMesh } from "../track-service/track";

export class WallCollisionManager {
    private static _track: TrackMesh;

    public static set track(track: TrackMesh) {
        this._track = track;
    }
}
