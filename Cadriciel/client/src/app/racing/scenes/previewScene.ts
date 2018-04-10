import { AbstractScene } from "./abstractRacingScene";
import { Group, Mesh, Vector3 } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { TrackLights } from "../render-service/light";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track-service/track";
import { ASPHALT_TEXTURE, ASPHALT_TEXTURE_FACTOR } from "../constants";

const ROTATION_STEP: number = 0.01;
const SCALE_FACTOR: number = 0.5;

export class PreviewScene extends AbstractScene {

    private _currentTrack: Track;
    private _trackType: TrackType;
    private _track: Mesh;
    private _rotatingPreview: Mesh;
    private _group: Group;

    public constructor() {
        super();
        this._group = new Group();
        this._roadTexture = this.loadRepeatingTexture(ASPHALT_TEXTURE, ASPHALT_TEXTURE_FACTOR);
        this.addGround();
        const lightinng: TrackLights = new TrackLights(TrackType.Default);
        lightinng.changePerspective();
        this._group.add(lightinng);
        this.add(this._group);
    }

    public update(): void {
        if (this._rotatingPreview !== undefined) {
            this._rotatingPreview.rotateZ(ROTATION_STEP);
        }
    }

    public loadTrack(track: Track): void {
        if (this._track === undefined || this._currentTrack !== track) {
            this._currentTrack = track;
            this._trackType = track.type;
            this._track = this.createTrackMesh(track);
            this._group.remove(this._track);
            this._group.remove(this._rotatingPreview);
            this.loadRotatingPreview(track);
        }
    }

    public loadRotatingPreview(track: Track): void {
        this._group.remove(this._rotatingPreview);
        this._rotatingPreview = this.createTrackMesh(track);
        this._rotatingPreview.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
        this._rotatingPreview.position.y = 1;
        this._rotatingPreview.geometry.center().copy(new Vector3(0, 0, 0));
        this._group.add(this._rotatingPreview);
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
