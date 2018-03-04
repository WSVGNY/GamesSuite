import { RenderService } from "./../render-service/render.service";
import { Vector3, PerspectiveCamera } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { ElementRef } from "@angular/core";
import { TrackPreviewConfig } from "./TrackPreviewConfig";
import { SkyBox } from "../render-service/skybox";
import { TrackLights } from "../render-service/light";
import { Track } from "../track";
import { TrackPointList } from "../render-service/trackPointList";

export class TrackPreview {
    private _camera: PerspectiveCamera;
    private _trackType: TrackType;
    private _trackPoints: TrackPointList;

    public constructor(private _renderService: RenderService) { }

    public async initialize(containerRef: ElementRef): Promise<void> {
        if (containerRef) {
            this.initializeCamera(containerRef.nativeElement);
            await this._renderService.initialize(containerRef.nativeElement, this._camera);
            this._renderService.setupRenderer();
        }
    }

    public loadTrack(track: Track): void {
        this._renderService.resetScene().catch((error: Error) => console.error(error));
        this._trackType = track.type;
        this._trackPoints = new TrackPointList(track.vertices);
        this.addObjectsToRenderScene();
        this.setSkyBox(this._trackType);
        this.startGameLoop();
    }

    private addObjectsToRenderScene(): void {
        this._renderService.addObjectToScene(this._renderService.createTrackMesh(this._trackPoints));
        this._renderService.addObjectToScene(new TrackLights(TrackType.Default));
    }

    private initializeCamera(containerRef: HTMLDivElement): void {
        this._camera = new PerspectiveCamera(
            TrackPreviewConfig.FIELD_OF_VIEW,
            containerRef.clientWidth / containerRef.clientHeight,
            TrackPreviewConfig.NEAR_CLIPPING_PLANE,
            TrackPreviewConfig.FAR_CLIPPING_PLANE
        );

        this._camera.name = TrackPreviewConfig.PREVIEW_CAMERA;
        this._camera.position.z = TrackPreviewConfig.INITIAL_CAMERA_POSITION_Z;
        this._camera.position.y = TrackPreviewConfig.INITIAL_CAMERA_POSITION_Y;
        this._camera.position.x = TrackPreviewConfig.INITIAL_CAMERA_POSITION_X;
        this._camera.lookAt(new Vector3(0, 0, 0));
    }

    private setSkyBox(trackType: TrackType): void {
        this._renderService.loadSkyBox(SkyBox.getPath(trackType));
    }

    public startGameLoop(): void {
        this.update();
    }

    private update(): void {
        requestAnimationFrame(() => {
            this._renderService.render();
            this.update();
        });
    }

    public set isDay(isDay: boolean) {
        if (isDay) {
            this.setSkyBox(this._trackType);
        } else {
            this.setSkyBox(TrackType.Night);
        }
    }
}
