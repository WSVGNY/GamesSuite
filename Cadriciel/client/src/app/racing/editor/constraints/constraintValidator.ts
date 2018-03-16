import { Line, Geometry, Vector3, LineBasicMaterial } from "three";
import { RED, PI_OVER_4, PI_OVER_2, HALF_TRACK_WIDTH, WALL_DISTANCE_TO_TRACK } from "../../constants";

const UNAUTHORIZED_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: RED });

export class ConstraintValidator {

    private static calculateLength(vector1: Vector3[]): number {
        return Math.sqrt((vector1[1].x - vector1[0].x) * (vector1[1].x - vector1[0].x)
            + (vector1[1].y - vector1[0].y) * (vector1[1].y - vector1[0].y));
    }

    // https://stackoverflow.com/questions/17763392/how-to-calculate-in-javascript-angle-between-3-points
    private static calculateAngle(line1: Line, line2: Line): number {
        const vector1: Vector3[] = ((line1.geometry) as Geometry).vertices;
        const vector2: Vector3[] = ((line2.geometry) as Geometry).vertices;

        const vertex1: number = Math.sqrt((vector2[0].x - vector1[0].x) * (vector2[0].x - vector1[0].x)
            + (vector2[0].y - vector1[0].y) * (vector2[0].y - vector1[0].y));
        const vertex2: number = Math.sqrt((vector2[0].x - vector2[1].x) * (vector2[0].x - vector2[1].x)
            + (vector2[0].y - vector2[1].y) * (vector2[0].y - vector2[1].y));
        const vertex3: number = Math.sqrt((vector2[1].x - vector1[0].x) * (vector2[1].x - vector1[0].x)
            + (vector2[1].y - vector1[0].y) * (vector2[1].y - vector1[0].y));

        return Math.acos((
            vertex2 * vertex2 + vertex1 * vertex1 - vertex3 * vertex3)
            / ((vertex2 * vertex1) + (vertex2 * vertex1)));
    }

    public static checkLength(connections: Array<Line>): boolean {
        let lengthOK: boolean = true;

        for (const connection of connections) {
            const geometry: Geometry = (connection.geometry) as Geometry;
            if (this.calculateLength(geometry.vertices) < HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK) {
                connection.material = UNAUTHORIZED_LINE_MATERIAL;
                lengthOK = false;
            }
        }

        return lengthOK;
    }

    public static checkAngle(connections: Array<Line>, isComplete: boolean): boolean {
        let angleOK: boolean = true;

        if (connections.length > 0) {
            const limit: number = isComplete ? connections.length : connections.length - 1;

            for (let i: number = 0; i < limit; i++) {
                const indexPlusOne: number = i === connections.length - 1 ? 0 : i + 1;

                if (this.calculateAngle(connections[i], connections[indexPlusOne]) < PI_OVER_4) {
                    connections[i].material = UNAUTHORIZED_LINE_MATERIAL;
                    connections[indexPlusOne].material = UNAUTHORIZED_LINE_MATERIAL;
                    angleOK = false;
                }
            }
        }

        return angleOK;
    }

    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    public static checkIntersection(connections: Array<Line>, isComplete: boolean): boolean {
        let intersectionOK: boolean = true;

        for (let i: number = 0; i < connections.length; i++) {
            const limit: number = isComplete && i === 0 ? connections.length - 1 : connections.length;

            for (let j: number = 0; j < limit; j++) {
                if (j > i + 1) {
                    const vectors1: Array<Vector3[]> = this.generateTrackWidth(connections[i], HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK);
                    const vectors2: Array<Vector3[]> = this.generateTrackWidth(connections[j], HALF_TRACK_WIDTH + WALL_DISTANCE_TO_TRACK);

                    if (this.checkIntersectionWithOffset(vectors1, vectors2)) {
                        connections[i].material = UNAUTHORIZED_LINE_MATERIAL;
                        connections[j].material = UNAUTHORIZED_LINE_MATERIAL;
                        intersectionOK = false;
                    }
                }
            }
        }

        return intersectionOK;
    }

    private static generateTrackWidth(line: Line, offset: number): Array<Vector3[]> {
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

    private static checkIntersectionWithOffset(vectors1: Vector3[][], vectors2: Vector3[][]): boolean {
        let isIntersecting: boolean = false;

        for (const vectorToCheck1 of vectors1) {
            for (const vectorToCheck2 of vectors2) {
                const determinant: number = this.calculateDeterminant(vectorToCheck1, vectorToCheck2);
                if (determinant === 0) {
                    isIntersecting = false;
                } else {
                    isIntersecting = this.isIntersecting(
                        this.calculateLambda(vectorToCheck1, vectorToCheck2, determinant),
                        this.calculateGamma(vectorToCheck1, vectorToCheck2, determinant));
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

    private static isIntersecting(lambda: number, gamma: number): boolean {
        return (lambda >= 0 && lambda <= 1) && (gamma >= 0 && gamma <= 1);
    }

    private static calculateDeterminant(vectorToCheck1: Vector3[], vectorToCheck2: Vector3[]): number {
        return (vectorToCheck1[1].x - vectorToCheck1[0].x) * (vectorToCheck2[1].y - vectorToCheck2[0].y)
            - (vectorToCheck2[1].x - vectorToCheck2[0].x) * (vectorToCheck1[1].y - vectorToCheck1[0].y);
    }

    private static calculateLambda(vectorToCheck1: Vector3[], vectorToCheck2: Vector3[], det: number): number {
        return ((vectorToCheck2[1].y - vectorToCheck2[0].y) * (vectorToCheck2[1].x - vectorToCheck1[0].x)
            + (vectorToCheck2[0].x - vectorToCheck2[1].x) * (vectorToCheck2[1].y - vectorToCheck1[0].y)) / det;
    }

    private static calculateGamma(vectorToCheck1: Vector3[], vectorToCheck2: Vector3[], det: number): number {
        return ((vectorToCheck1[0].y - vectorToCheck1[1].y) * (vectorToCheck2[1].x - vectorToCheck1[0].x)
            + (vectorToCheck1[1].x - vectorToCheck1[0].x) * (vectorToCheck2[1].y - vectorToCheck1[0].y)) / det;
    }

    private static translateVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();

        const vector3: Vector3[] = new Array<Vector3>(vector.length);
        vector3[0] = new Vector3(vector[0].x + perpendicularVector.x * offset, vector[0].y + perpendicularVector.y * offset);
        vector3[1] = new Vector3(vector[1].x + perpendicularVector.x * offset, vector[1].y + perpendicularVector.y * offset);

        return vector3;
    }

    private static perpendicularVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();

        const vector3: Vector3[] = new Array<Vector3>(vector.length);
        vector3[0] = new Vector3(vector[0].x, vector[0].y, 0);
        vector3[1] = new Vector3(
            vector[0].x + perpendicularVector.x * offset,
            vector[0].y + perpendicularVector.y * offset, 0);

        return vector3;
    }
}
