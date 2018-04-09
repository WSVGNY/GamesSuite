import { Track } from "../../../../../common/racing/track";
import { Shape, Mesh, MeshPhongMaterial, Path, BackSide, Texture, ShapeGeometry } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { PI_OVER_2 } from "./../constants";
import { WallMesh } from "./wall";
import { TrackPointList } from "./trackPointList";

export class TrackMesh extends Mesh {
    private _trackPoints: TrackPointList;

    public constructor(private _track: Track, texture: Texture) {
        super();
        this._trackPoints = new TrackPointList(this._track.vertices);
        this.createTrackMesh(texture);
        this.createWalls();
    }

    private createWalls(): void {
        this.add(WallMesh.createInteriorWall(this._trackPoints));
        this.add(WallMesh.createExteriorWall(this._trackPoints));
    }

    public set timesPlayed(timesPlayed: number) {
        this._track.timesPlayed = timesPlayed;
    }

    public get trackType(): TrackType {
        return this._track.type;
    }

    public get trackPoints(): TrackPointList {
        return this._trackPoints;
    }

    private createTrackMesh(texture: Texture): void {
        const shape: Shape = new Shape();
        this.createTrackExterior(shape, this._trackPoints);
        this.drillHoleInTrackShape(shape, this._trackPoints);

        this.geometry = new ShapeGeometry(shape);
        this.material = new MeshPhongMaterial({ side: BackSide, map: texture });
        this.rotateX(PI_OVER_2);
        this.name = "track";
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
}
