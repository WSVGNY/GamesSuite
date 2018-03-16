import { Vector3 } from "three";
import { HALF, HALF_TRACK_WIDTH, WALL_DISTANCE_TO_TRACK } from "../constants";

export class TrackPoint {
    private _interior: Vector3;
    private _exterior: Vector3;
    private _interiorWall: Vector3;
    private _exteriorWall: Vector3;
    private _smallAngle: number;
    public next: TrackPoint;
    public previous: TrackPoint;

    public constructor(private _coordinates: Vector3 = new Vector3(0, 0, 0)) {
    }

    public findInteriorExteriorPoints(): void {
        const vectorToInteriorPoint: Vector3 = this.findVectorToInteriorPoint();

        if (this.vectorToNextCenterPoint.cross(vectorToInteriorPoint).y < 0) {
            this.generatePointsFromVector(vectorToInteriorPoint, this.findVectorToInteriorWall());
        } else {
            this.generatePointsFromVector(vectorToInteriorPoint.negate(), this.findVectorToInteriorWall().negate());
        }
    }

    private generatePointsFromVector(interiorVector: Vector3, interiorWall: Vector3): void {
        this._interior = this._coordinates.clone().add(interiorVector);
        this._exterior = this._coordinates.clone().sub(interiorVector);

        this._interiorWall = this._coordinates.clone().add(interiorWall);
        this._exteriorWall = this._coordinates.clone().sub(interiorWall);
    }

    private findVectorToInteriorPoint(): Vector3 {
        const halfOfSmallAngle: number = this.findHalfOfSmallAngle();

        return this.vectorToNextCenterPoint.clone().normalize()
            .applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle)
            .multiplyScalar(HALF_TRACK_WIDTH / Math.sin(halfOfSmallAngle));
    }

    private findVectorToInteriorWall(): Vector3 {
        const halfOfSmallAngle: number = this.findHalfOfSmallAngle();

        return this.vectorToNextCenterPoint.clone().normalize()
            .applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle)
            .multiplyScalar((HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK) / Math.sin(halfOfSmallAngle));
    }

    private findHalfOfSmallAngle(): number {
        if (this.next !== undefined && this.previous !== undefined) {
            this._smallAngle = this.vectorToNextCenterPoint.angleTo(this.vectorToPreviousCenterPoint);
        }

        return this.vectorToNextCenterPoint.cross(this.vectorToPreviousCenterPoint).y > 0 ?
            this._smallAngle * HALF :
            -this._smallAngle * HALF;
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

    public get interiorWall(): Vector3 {
        return this._interiorWall;
    }

    public get exteriorWall(): Vector3 {
        return this._exteriorWall;
    }

    public get coordinates(): Vector3 {
        return this._coordinates;
    }
}
