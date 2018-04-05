import { AbstractScene } from "./abstractRacingScene";
import { Group, Mesh } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { TrackLights } from "../render-service/light";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track-service/track";
import { ASPHALT_TEXTURE, ASPHALT_TEXTURE_FACTOR } from "../constants";

export class PreviewScene extends AbstractScene {

    private _trackType: TrackType;
    private _track: Mesh;
    private _group: Group;

    public constructor() {
        super();
        this._group = new Group();
        this._roadTexture = this.loadRepeatingTexture(ASPHALT_TEXTURE, ASPHALT_TEXTURE_FACTOR);
        this.addGround();
        this._group.add(new TrackLights(TrackType.Default));
        this.add(this._group);
        this._skyBoxTextures = new Map();
    }

    public loadTrack(track: Track): void {
        if (this._track !== undefined) {
            this._group.remove(this._track);
        }
        this._trackType = track.type;
        this._track = this.createTrackMesh(track);
        this._group.add(this._track);
        this.setSkyBox(track.type);
    }

    public createTrackMesh(track: Track): Mesh {
        return new TrackMesh(track, this._roadTexture);
    }

    public set isDay(isDay: boolean) {
        if (isDay) {
            this.setSkyBox(this._trackType);
        } else {
            this.setSkyBox(TrackType.Night);
        }
    }
}
