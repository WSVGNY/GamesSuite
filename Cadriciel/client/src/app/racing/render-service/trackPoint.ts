import { Vector3 } from "three";
import { HALF, TRACK_WIDTH } from "../constants";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";

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

    public get length(): number {
        return this._trackPoints.length;
    }

    public get points(): TrackPoint[] {
        return this._trackPoints;
    }
}

export class TrackPoint {
    private _interior: Vector3;
    private _exterior: Vector3;
    private _smallAngle: number;
    public next: TrackPoint;
    public previous: TrackPoint;

    public constructor(
        private _coordinates: Vector3 = new Vector3(0, 0, 0),
    ) {
    }

    public findInteriorExteriorPoints(): void {
        if (this.next !== undefined && this.previous !== undefined) {
            this._smallAngle = this.vectorToNextCenterPoint.angleTo(this.vectorToPreviousCenterPoint);
        }
        const angle: number =
            this.vectorToNextCenterPoint.cross(this.vectorToPreviousCenterPoint).y > 0 ?
                this._smallAngle * HALF :
                -this._smallAngle * HALF;
        const vectorToInteriorPoint: Vector3 = this.vectorToNextCenterPoint.clone().normalize()
            .applyAxisAngle(new Vector3(0, 1, 0), angle)
            .multiplyScalar(TRACK_WIDTH / Math.sin(angle));

        if (this.vectorToNextCenterPoint.cross(vectorToInteriorPoint).y < 0) {
            this._interior = new Vector3(
                this._coordinates.x + vectorToInteriorPoint.x, 0, this._coordinates.z + vectorToInteriorPoint.z
            );
            this._exterior = new Vector3(
                this._coordinates.x - vectorToInteriorPoint.x, 0, this._coordinates.z - vectorToInteriorPoint.z
            );
        } else {
            this._interior = new Vector3(
                this._coordinates.x - vectorToInteriorPoint.x, 0, this._coordinates.z - vectorToInteriorPoint.z
            );
            this._exterior = new Vector3(
                this._coordinates.x + vectorToInteriorPoint.x, 0, this._coordinates.z + vectorToInteriorPoint.z
            );
        }
    }

    public get vectorToPreviousCenterPoint(): Vector3 {
        return new Vector3(
            this.previous._coordinates.x - this._coordinates.x,
            this.previous._coordinates.y - this._coordinates.y,
            this.previous._coordinates.z - this._coordinates.z
        );
    }

    public get vectorToNextCenterPoint(): Vector3 {
        return new Vector3(
            this.next._coordinates.x - this._coordinates.x,
            this.next._coordinates.y - this._coordinates.y,
            this.next._coordinates.z - this._coordinates.z
        );
    }

    public get smallAngle(): number {
        return this._smallAngle;
    }

    public get interior(): Vector3 {
        return this._interior;
    }

    public get exterior(): Vector3 {
        return this._exterior;
    }

    public get coordinates(): Vector3 {
        return this._coordinates;
    }
}
