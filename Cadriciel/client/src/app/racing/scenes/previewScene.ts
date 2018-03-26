import { AbstractScene } from "./abstractScene";
import {
    Group, PlaneGeometry, MeshPhongMaterial, BackSide, Texture, TextureLoader,
    RepeatWrapping, Mesh, CubeTexture, Shape, ShapeGeometry, Path, CubeTextureLoader
} from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { SkyBox } from "../render-service/skybox";
import { TrackLights } from "../render-service/light";
import { PI_OVER_2, LOWER_GROUND, GROUND_SIZE, GROUND_TEXTURE_FACTOR, ASPHALT_TEXTURE, GRASS_TEXTURE, MS_TO_SECONDS } from "../constants";
import { TrackPointList } from "../render-service/trackPointList";
import { Track } from "../../../../../common/racing/track";

export class PreviewScene extends AbstractScene {

    private _trackType: TrackType;
    private _trackPoints: TrackPointList;
    private _track: Mesh;
    private _group: Group;
    private _skyBoxTexture: CubeTexture;

    public constructor() {
        super();
        this._group = new Group();
        this.addGround();
        this._group.add(new TrackLights(TrackType.Default));
        this.add(this._group);
    }

    public loadTrack(track: Track): void {
        if (this._track !== undefined) {
            this._group.remove(this._track);
        }
        this._trackType = track.type;
        this._trackPoints = new TrackPointList(track.vertices);
        this._track = this.createTrackMesh(this._trackPoints);
        this._group.add(this._track);
        this.setSkyBox(track.type);
    }

    private addGround(): void {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
        const groundMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(GRASS_TEXTURE, MS_TO_SECONDS) });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        ground.name = "ground";
        this.add(ground);
    }

    private setSkyBox(trackType: TrackType): void {
        this.loadSkyBox(SkyBox.getPath(trackType));
    }

    public loadSkyBox(pathToImages: string): void {
        this._skyBoxTexture = new CubeTextureLoader()
            .setPath(pathToImages)
            .load([
                "px.jpg",
                "nx.jpg",
                "py.jpg",
                "ny.jpg",
                "pz.jpg",
                "nz.jpg"
            ]);

        if (this !== undefined) {
            this.background = this._skyBoxTexture;
        }
    }

    public createTrackMesh(trackPoints: TrackPointList): Mesh {
        const shape: Shape = new Shape();
        this.createTrackExterior(shape, trackPoints);
        this.drillHoleInTrackShape(shape, trackPoints);

        const geometry: ShapeGeometry = new ShapeGeometry(shape);
        const trackMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(ASPHALT_TEXTURE, GROUND_TEXTURE_FACTOR) });

        const trackMesh: Mesh = new Mesh(geometry, trackMaterial);
        trackMesh.rotateX(PI_OVER_2);
        trackMesh.name = "track";

        return trackMesh;
    }

    private createTrackExterior(trackShape: Shape, trackPoints: TrackPointList): void {
        trackShape.moveTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
        for (let i: number = 1; i < trackPoints.length; ++i) {
            trackShape.lineTo(trackPoints.points[i].exterior.x, trackPoints.points[i].exterior.z);
        }
        trackShape.lineTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
    }

    private drillHoleInTrackShape(trackShape: Shape, trackPoints: TrackPointList): void {
        const holePath: Path = new Path();
        holePath.moveTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        for (let i: number = trackPoints.length - 1; i > 0; --i) {
            holePath.lineTo(trackPoints.points[i].interior.x, trackPoints.points[i].interior.z);
        }
        holePath.lineTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        trackShape.holes.push(holePath);
    }

    private loadRepeatingTexture(pathToImage: string, imageRatio: number): Texture {
        const texture: Texture = new TextureLoader().load(pathToImage);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(imageRatio, imageRatio);

        return texture;
    }

    public set isDay(isDay: boolean) {
        if (isDay) {
            this.setSkyBox(this._trackType);
        } else {
            this.setSkyBox(TrackType.Night);
        }
    }
}
