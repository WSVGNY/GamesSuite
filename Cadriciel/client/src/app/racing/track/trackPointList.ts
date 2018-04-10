import { Vector3 } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { TrackPoint } from "./trackPoint";

export class TrackPointList {
    private _trackPoints: TrackPoint[];

    public constructor(_trackPoints: CommonCoordinate3D[]) {
        this._trackPoints = [];
        this.fillFromVector3Array(_trackPoints)
            .checkTrackPointsOrientation();
    }

    private fillFromVector3Array(_trackPoints: CommonCoordinate3D[]): TrackPointList {
        if (_trackPoints !== undefined && _trackPoints.length !== 0) {
            this._trackPoints = [];

            _trackPoints.forEach((currentPoint: CommonCoordinate3D, i: number) => {
                this._trackPoints.push(new TrackPoint(new Vector3(currentPoint.x, currentPoint.y, currentPoint.z)));
            });

            for (let i: number = 0; i < this._trackPoints.length; i++) {
                const nextPoint: TrackPoint = (i + 1) === this._trackPoints.length ?
                    this._trackPoints[0] :
                    this._trackPoints[i + 1];
                const previousPoint: TrackPoint = i === 0 ?
                    this._trackPoints[this._trackPoints.length - 1] :
                    this._trackPoints[i - 1];
                this._trackPoints[i].next = nextPoint;
                this._trackPoints[i].previous = previousPoint;
                this._trackPoints[i].findInteriorExteriorPoints();
            }
        }

        return this;
    }

    private checkTrackPointsOrientation(): TrackPointList {
        let angleSum: number = 0;
        this._trackPoints.forEach((currentPoint: TrackPoint, i: number) => {
            angleSum += currentPoint.smallAngle *
                (currentPoint.vectorToNextCenterPoint.length() + currentPoint.vectorToPreviousCenterPoint.length());
        });
        if (angleSum > 0) {
            const reversePoints: Vector3[] = [];
            this._trackPoints.forEach((currentPoint: TrackPoint, i: number) => {
                reversePoints[this._trackPoints.length - 1 - i] = new Vector3(
                    currentPoint.coordinate.x,
                    currentPoint.coordinate.y,
                    currentPoint.coordinate.z);
            });
            this.fillFromVector3Array(reversePoints);
        }

        return this;
    }

    public get first(): TrackPoint {
        return this._trackPoints[0];
    }

    public get length(): number {
        return this._trackPoints.length;
    }

    public get points(): TrackPoint[] {
        return this._trackPoints;
    }

    public get pointVectors(): Vector3[] {
        const points: Vector3[] = [];
        this._trackPoints.forEach((currentPoint: TrackPoint, i: number) => {
            points[i] = currentPoint.coordinate.clone();
        });

        return points;
    }
}
