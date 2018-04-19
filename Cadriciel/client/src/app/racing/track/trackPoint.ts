import { Vector3 } from "three";
import { HALF_TRACK_WIDTH } from "../constants/scene.constants";

export class TrackPoint {
    public next: TrackPoint;
    public previous: TrackPoint;
    private _interior: Vector3;
    private _exterior: Vector3;
    private _smallAngle: number;

    public constructor(private _coordinate: Vector3 = new Vector3(0, 0, 0)) { }

    public findInteriorExteriorPoints(): void {
        const interiorVector: Vector3 = this.vectorToInteriorPoint;
        this._interior = this.coordinate.add(interiorVector);
        this._exterior = this.coordinate.sub(interiorVector);
    }

    public get vectorToInteriorPoint(): Vector3 {
        const halfOfSmallAngle: number = this.halfOfSmallAngle;
        const vectorToInteriorPoint: Vector3 = this.vectorToNextCenterPoint.clone().normalize()
            .applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle)
            .multiplyScalar(HALF_TRACK_WIDTH / Math.sin(halfOfSmallAngle));

        return this.vectorToNextCenterPoint.cross(vectorToInteriorPoint).y < 0 ?
            vectorToInteriorPoint : vectorToInteriorPoint.negate();
    }

    public get halfOfSmallAngle(): number {
        if (this.next !== undefined && this.previous !== undefined) {
            this._smallAngle = this.vectorToNextCenterPoint.cross(this.vectorToPreviousCenterPoint).y > 0 ?
                this.vectorToNextCenterPoint.angleTo(this.vectorToPreviousCenterPoint) :
                -this.vectorToNextCenterPoint.angleTo(this.vectorToPreviousCenterPoint);
        }

        return this._smallAngle / 2;
    }

    public get vectorToPreviousCenterPoint(): Vector3 {
        return new Vector3(
            this.previous._coordinate.x - this._coordinate.x,
            this.previous._coordinate.y - this._coordinate.y,
            this.previous._coordinate.z - this._coordinate.z
        );
    }

    public get vectorToNextCenterPoint(): Vector3 {
        return new Vector3(
            this.next._coordinate.x - this._coordinate.x,
            this.next._coordinate.y - this._coordinate.y,
            this.next._coordinate.z - this._coordinate.z
        );
    }

    public get smallAngle(): number {
        return this._smallAngle;
    }

    public get interior(): Vector3 {
        return this._interior.clone();
    }

    public get exterior(): Vector3 {
        return this._exterior.clone();
    }

    public get coordinate(): Vector3 {
        return this._coordinate.clone();
    }
}
