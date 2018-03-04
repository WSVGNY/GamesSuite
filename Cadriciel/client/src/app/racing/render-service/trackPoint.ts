import { Vector3 } from "three";
import { HALF, HALF_TRACK_WIDTH } from "../constants";

export class TrackPoint {
    private _interior: Vector3;
    private _exterior: Vector3;
    private _smallAngle: number;
    public next: TrackPoint;
    public previous: TrackPoint;

    public constructor(private _coordinates: Vector3 = new Vector3(0, 0, 0)) {
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
            .multiplyScalar(HALF_TRACK_WIDTH / Math.sin(angle));

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
