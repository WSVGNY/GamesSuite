import { Track } from "../../../../../common/racing/track";
import { Shape, Mesh, MeshPhongMaterial, Path, BackSide, Texture, ShapeGeometry, Vector3, Group } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { PI_OVER_2 } from "./../constants";
import { WallMesh } from "./wall";
import { TrackPointList } from "./trackPointList";
import { WallPlane } from "./plane";
import { TrackPoint } from "./trackPoint";

export class TrackMesh extends Mesh {
    private _trackPoints: TrackPointList;
    private _walls: Group;
    private _interiorPlanes: WallPlane[];
    private _exteriorPlanes: WallPlane[];

    public constructor(private _track: Track, texture: Texture) {
        super();
        this._trackPoints = new TrackPointList(this._track.vertices);
        this._interiorPlanes = [];
        this._exteriorPlanes = [];
        this._walls = new Group();
        this.createTrackMesh(texture);
        this.createWalls();
        this.createPlanes();
    }

    private createWalls(): void {
        this._walls.add(WallMesh.createInteriorWall(this._trackPoints));
        this._walls.add(WallMesh.createExteriorWall(this._trackPoints));
        this.add(this._walls);
    }

    public removeWalls(): void {
        this.remove(this._walls);
    }

    public centerGeometries(center: Vector3): void {
        this.geometry.center().copy(center);
        this._walls.children.forEach((child: WallMesh) => {
            child.geometry.center().copy(center);
        });
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

    private createPlanes(): void {
        this._trackPoints.toTrackPoints.forEach((currentPoint: TrackPoint) => {
            this._interiorPlanes.push(new WallPlane(
                currentPoint.interior,
                currentPoint.next.interior,
                currentPoint.interior.clone().add(new Vector3(0, 1, 0))
            ));
            this._exteriorPlanes.push(new WallPlane(
                currentPoint.exterior,
                currentPoint.next.exterior,
                currentPoint.exterior.clone().add(new Vector3(0, 1, 0))));
        });
    }

    public get interiorPlanes(): WallPlane[] {
        return this._interiorPlanes;
    }

    public get exteriorPlanes(): WallPlane[] {
        return this._exteriorPlanes;
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
            trackShape.lineTo(trackPoints.toTrackPoints[i].exterior.x, trackPoints.toTrackPoints[i].exterior.z);
        }
        trackShape.lineTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
    }

    private drillHoleInTrackShape(trackShape: Shape, trackPoints: TrackPointList): void {
        const holePath: Path = new Path();
        holePath.moveTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        for (let i: number = trackPoints.length - 1; i > 0; --i) {
            holePath.lineTo(trackPoints.toTrackPoints[i].interior.x, trackPoints.toTrackPoints[i].interior.z);
        }
        holePath.lineTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        trackShape.holes.push(holePath);
    }
}
