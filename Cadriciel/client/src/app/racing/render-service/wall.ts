import { Shape, Vector3, Path, Mesh, MeshPhongMaterial, DoubleSide } from "three";
import { TrackPointList } from "./trackPointList";
import { TrackPoint } from "./trackPoint";
import { HALF_TRACK_WIDTH, WALL_DISTANCE_TO_TRACK, PI_OVER_2, YELLOW } from "../constants";

export class Wall extends Shape {
    private readonly WIDTH: number = 0.5;
    private readonly HEIGHT: number = 2;
    private readonly EXTRUDE_SETTINGS: Object = {
        steps: 1,
        amount: this.HEIGHT,
        bevelEnabled: false
    };
    private readonly MATERIAL: MeshPhongMaterial =
        new MeshPhongMaterial({ side: DoubleSide, color: YELLOW, wireframe: false });

    private _shapePoints: Vector3[];
    private _holePoints: Vector3[];

    public static createInteriorWall(trackPoints: TrackPointList): Wall {
        return new Wall(true, trackPoints);
    }

    public static createExteriorWall(trackPoints: TrackPointList): Wall {
        return new Wall(false, trackPoints);
    }

    private constructor(isInterior: boolean, trackPoints: TrackPointList) {
        super();
        this._shapePoints = [];
        this._holePoints = [];
        isInterior ? this.findInteriorWallPoints(trackPoints) : this.findExteriorWallPoints(trackPoints);
        this.createWallShape();
    }

    private createWallShape(): void {
        this.moveTo(this._shapePoints[0].x, this._shapePoints[0].z);
        for (let i: number = 1; i < this._shapePoints.length; ++i) {
            this.lineTo(this._shapePoints[i].x, this._shapePoints[i].z);
        }
        this.lineTo(this._shapePoints[0].x, this._shapePoints[0].z);

        const holePath: Path = new Path();
        holePath.moveTo(this._holePoints[0].x, this._holePoints[0].z);
        for (let i: number = this._holePoints.length - 1; i > 0; --i) {
            holePath.lineTo(this._holePoints[i].x, this._holePoints[i].z);
        }
        holePath.lineTo(this._holePoints[0].x, this._holePoints[0].z);
        this.holes.push(holePath);
    }

    private findInteriorWallPoints(trackPoints: TrackPointList): void {
        trackPoints.points.forEach((point: TrackPoint) => {
            console.log(point);
            console.log(this.findVectorToInteriorWall(point));
            this._shapePoints.push(point.coordinate.add(this.findVectorToInteriorWall(point)));
        });
        this.findInteriorWallWidthPoint(trackPoints);
    }

    private findInteriorWallWidthPoint(trackPoints: TrackPointList): void {
        trackPoints.points.forEach((point: TrackPoint) => {
            this._holePoints.push(point.coordinate.add(this.findVectorToInteriorWallWidth(point)));
        });
    }

    private findVectorToInteriorWall(trackPoint: TrackPoint): Vector3 {
        return trackPoint.vectorToInteriorPoint.normalize()
            .multiplyScalar((HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK));
    }

    private findVectorToInteriorWallWidth(trackPoint: TrackPoint): Vector3 {
        return trackPoint.vectorToInteriorPoint.normalize()
            .multiplyScalar((HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK + this.WIDTH));
    }

    private findExteriorWallPoints(trackPoints: TrackPointList): void {
        trackPoints.points.forEach((point: TrackPoint) => {
            this._holePoints.push(point.coordinate.add(this.findVectorToExteriorWall(point)));
        });
        this.findExteriorWallWidthPoint(trackPoints);
    }

    private findExteriorWallWidthPoint(trackPoints: TrackPointList): void {
        trackPoints.points.forEach((point: TrackPoint) => {
            this._shapePoints.push(point.coordinate.add(this.findVectorToExteriorWallWidth(point)));
        });
    }

    private findVectorToExteriorWall(trackPoint: TrackPoint): Vector3 {
        return trackPoint.vectorToInteriorPoint.normalize()
            .multiplyScalar((HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK))
            .negate();
    }

    private findVectorToExteriorWallWidth(trackPoint: TrackPoint): Vector3 {
        return trackPoint.vectorToInteriorPoint.normalize()
            .multiplyScalar((HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK + this.WIDTH))
            .negate();
    }

    public generateMesh(): Mesh {
        return new Mesh(this.extrude(this.EXTRUDE_SETTINGS).rotateX(PI_OVER_2).translate(0, this.HEIGHT, 0), this.MATERIAL);
    }
}
