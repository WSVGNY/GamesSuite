import { AbstractScene } from "./abstractRacingScene";
import { Mesh, Vector3 } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { TrackLights } from "../render-service/light";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track/track";
import { ROTATION_STEP, SCALE_FACTOR } from "../constants/scene.constants";

export class PreviewScene extends AbstractScene {

    private _currentTrack: Track;
    private _trackType: TrackType;
    private _track: Mesh;
    private _rotatingPreview: TrackMesh;

    public constructor() {
        super();
        this.addGround();
        const lighting: TrackLights = new TrackLights(TrackType.Default);
        lighting.changePerspective();
        this.add(lighting);
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
            this._track = new TrackMesh(track);
            this.remove(this._track);
            this.remove(this._rotatingPreview);
            this.loadRotatingPreview(track);
        }
    }

    public loadRotatingPreview(track: Track): void {
        this.remove(this._rotatingPreview);
        this._rotatingPreview = new TrackMesh(track);
        this._rotatingPreview.scale.set(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
        this._rotatingPreview.position.y = 1;
        this._rotatingPreview.geometry.center().copy(new Vector3(0, 0, 0));
        this._rotatingPreview.removeWalls();
        this._rotatingPreview.removeStartingLine();
        this.add(this._rotatingPreview);
    }

    public set isDay(isDay: boolean) {
        if (isDay) {
            this.setSkyBox(this._trackType);
        } else {
            this.setSkyBox(TrackType.Night);
        }
    }
}
