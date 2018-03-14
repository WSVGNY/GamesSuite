import { Vector3 } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { TrackPoint } from "./trackPoint";

export class TrackPointList {
    private _trackPoints: TrackPoint[] = new Array<TrackPoint>();

    public constructor(_trackPoints: CommonCoordinate3D[]) {
        this.fillFromVector3Array(_trackPoints)
            .checkTrackPointsOrientation();
    }

    private fillFromVector3Array(_trackPoints: CommonCoordinate3D[]): TrackPointList {
        if (_trackPoints !== undefined && _trackPoints.length !== 0) {
            this._trackPoints = new Array<TrackPoint>();

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
            angleSum += currentPoint.vectorToNextCenterPoint.cross(currentPoint.vectorToPreviousCenterPoint).y < 0 ?
                currentPoint.smallAngle *
                (currentPoint.vectorToNextCenterPoint.length() + currentPoint.vectorToPreviousCenterPoint.length()) :
                -currentPoint.smallAngle *
                (currentPoint.vectorToNextCenterPoint.length() + currentPoint.vectorToPreviousCenterPoint.length());
        });
        if (angleSum < 0) {
            const reversePoints: Vector3[] = Array<Vector3>(this._trackPoints.length);
            this._trackPoints.forEach((currentPoint: TrackPoint, i: number) => {
                reversePoints[this._trackPoints.length - 1 - i] = new Vector3(
                    currentPoint.coordinates.x,
                    currentPoint.coordinates.y,
                    currentPoint.coordinates.z);
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
        const points: Vector3[] = new Array(this._trackPoints.length);
        this._trackPoints.forEach((currentPoint: TrackPoint, i: number) => {
            points[i] = currentPoint.coordinates.clone();
        });

        return points;
    }
}