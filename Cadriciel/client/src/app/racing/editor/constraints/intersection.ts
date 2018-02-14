import {
    Vector3, Line, Geometry
} from "three";
import { PI_OVER_2 } from "../../constants";

export class Intersection {

    private _isIntersecting: boolean;

    public constructor(line1: Line, line2: Line, offset: number) {
        const vectors1: Array<Vector3[]> = this.generateTrackWidth(line1, offset);
        const vectors2: Array<Vector3[]> = this.generateTrackWidth(line2, offset);
        this._isIntersecting = this.checkIntersectionWithOffset(vectors1, vectors2);
    }

    public get isIntersecting(): boolean {
        return this._isIntersecting;
    }

    private generateTrackWidth(line: Line, offset: number): Array<Vector3[]> {
        const geo: Geometry = (line.geometry) as Geometry;
        const vector1: Vector3[] = geo.vertices;

        return [
            vector1,
            this.translateVector(vector1, offset),
            this.translateVector(vector1, -offset),
            this.perpendicularVector(vector1, offset),
            this.perpendicularVector(vector1, -offset)
        ];
    }

    private checkIntersectionWithOffset(vectors1: Vector3[][], vectors2: Vector3[][]): boolean {
        let isIntersecting: boolean;
        for (const vectorToCheck1 of vectors1) {
            for (const vectorToCheck2 of vectors2) {
                let det: number, gamma: number, lambda: number;
                det = (vectorToCheck1[1].x - vectorToCheck1[0].x) * (vectorToCheck2[1].y - vectorToCheck2[0].y)
                    - (vectorToCheck2[1].x - vectorToCheck2[0].x) * (vectorToCheck1[1].y - vectorToCheck1[0].y);
                if (det === 0) {
                    isIntersecting = false;
                } else {
                    lambda = ((vectorToCheck2[1].y - vectorToCheck2[0].y) * (vectorToCheck2[1].x - vectorToCheck1[0].x)
                        + (vectorToCheck2[0].x - vectorToCheck2[1].x) * (vectorToCheck2[1].y - vectorToCheck1[0].y)) / det;
                    gamma = ((vectorToCheck1[0].y - vectorToCheck1[1].y) * (vectorToCheck2[1].x - vectorToCheck1[0].x)
                        + (vectorToCheck1[1].x - vectorToCheck1[0].x) * (vectorToCheck2[1].y - vectorToCheck1[0].y)) / det;
                    isIntersecting = (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1);
                }
                if (isIntersecting) {
                    break;
                }
            }
            if (isIntersecting) {
                break;
            }
        }

        return isIntersecting;
    }

    private translateVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();
        const vector3: Vector3[] = new Array<Vector3>(vector.length);
        vector3[0] = new Vector3(vector[0].x + perpendicularVector.x * offset, vector[0].y + perpendicularVector.y * offset);
        vector3[1] = new Vector3(vector[1].x + perpendicularVector.x * offset, vector[1].y + perpendicularVector.y * offset);

        return vector3;
    }

    private perpendicularVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();
        const vector3: Vector3[] = new Array<Vector3>(vector.length);
        vector3[0] =
            new Vector3(vector[0].x, vector[0].y, 0);
        vector3[1] =
            new Vector3(vector[0].x + perpendicularVector.x * offset, vector[0].y + perpendicularVector.y * offset, 0);

        return vector3;
    }

}
