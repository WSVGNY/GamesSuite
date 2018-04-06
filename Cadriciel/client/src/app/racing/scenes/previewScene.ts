import { AbstractScene } from "./abstractRacingScene";
import { Group, Mesh, Vector3, Matrix4 } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { TrackLights } from "../render-service/light";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track-service/track";
import { ASPHALT_TEXTURE, ASPHALT_TEXTURE_FACTOR } from "../constants";

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
        this._skyBoxTextures = new Map();
    }

    public update(): void {
        this._group.remove(this._rotatingPreview);
        if (this._rotatingPreview !== undefined) {
            const offset: Vector3 = this._rotatingPreview.geometry.center().clone();
            this._rotatingPreview.rotateZ(0.01);
            this._rotatingPreview.geometry.applyMatrix(new Matrix4().makeTranslation( -offset.x, -offset.y, -offset.z ) );
            this._rotatingPreview.position.copy( this._rotatingPreview.geometry.center().clone());
            this._group.add(this._rotatingPreview);
        }
    }

    public loadTrack(track: Track): void {
        if (this._track === undefined) {
            this._currentTrack = track;
            this._trackType = track.type;
            this._track = this.createTrackMesh(track);
            // this._group.add(this._track);
            this.setSkyBox(track.type);
            this.loadRotatingPreview(track);
        } else if (this._currentTrack !== track) {
            this._currentTrack = track;
            this._group.remove(this._track);
            this._group.remove(this._rotatingPreview);
            this._trackType = track.type;
            this._track = this.createTrackMesh(track);
            // this._group.add(this._track);
            this.setSkyBox(track.type);
            this.loadRotatingPreview(track);
        }
    }

    public loadRotatingPreview(track: Track): void {
        this._rotatingPreview = this.createTrackMesh(track);
        this._rotatingPreview.scale.set(0.5, 0.5, 0.5);
        // this._rotatingPreview.rotateY(Math.PI / 4);
        this._rotatingPreview.position.y = 10;
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
