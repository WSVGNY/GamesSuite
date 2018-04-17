import { Line, Geometry, Vector3, LineBasicMaterial } from "three";
import { CommonCoordinate3D } from "../../../../../../common/racing/commonCoordinate3D";
import { TrackPointList } from "../../track/trackPointList";
import { WallMesh } from "../../track/wall";
import { RED } from "../../constants/color.constants";
import { WALL_DISTANCE_TO_TRACK, WALL_WIDTH, TRACK_WIDTH } from "../../constants/scene.constants";
import { PI_OVER_4, PI_OVER_2 } from "../../constants/math.constants";

const UNAUTHORIZED_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: RED });
const OFFSET: number = TRACK_WIDTH + WALL_DISTANCE_TO_TRACK + WALL_WIDTH;

export class ConstraintValidator {
    public static checkAngle(connections: Line[], isComplete: boolean): boolean {
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

    public static checkLength(connections: Line[]): boolean {
        let lengthOK: boolean = true;

        for (const connection of connections) {
            const geometry: Geometry = (connection.geometry) as Geometry;
            if (this.calculateLength(geometry.vertices) < OFFSET) {
                connection.material = UNAUTHORIZED_LINE_MATERIAL;
                lengthOK = false;
            }
        }

        return lengthOK;
    }

    private static calculateLength(vector1: Vector3[]): number {
        return vector1[1].clone().sub(vector1[0]).length();
    }

    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    public static checkIntersection(connections: Line[], isComplete: boolean): boolean {
        return isComplete ? this.checkIntersectionComplete(connections) : this.checkIntersectionIncomplete(connections);
    }

    private static checkIntersectionIncomplete(connections: Line[]): boolean {
        const limit: number = connections.length;

        for (let i: number = 0; i < connections.length; i++) {
            for (let j: number = 0; j < limit; j++) {
                if (j > i + 1) {
                    const vectors1: Vector3[][] = this.generateTrackWidth(connections[i]);
                    const vectors2: Vector3[][] = this.generateTrackWidth(connections[j]);
                    if (this.checkIntersectionWithOffset(vectors1, vectors2)) {
                        connections[i].material = UNAUTHORIZED_LINE_MATERIAL;
                        connections[j].material = UNAUTHORIZED_LINE_MATERIAL;

                        return false;
                    }
                }
            }
        }

        return true;
    }

    private static generateTrackWidth(line: Line): Vector3[][] {
        const geo: Geometry = (line.geometry) as Geometry;
        const vector1: Vector3[] = geo.vertices;

        return [
            vector1,
            this.translateVector(vector1, OFFSET),
            this.translateVector(vector1, -OFFSET),
            this.perpendicularVector(vector1, OFFSET),
            this.perpendicularVector(vector1, -OFFSET)
        ];
    }

    private static checkIntersectionComplete(connections: Line[]): boolean {
        const trackPoints: TrackPointList = new TrackPointList(this.convertLinesToCommonCoordinates3D(connections));
        const interiorWallPoints: Vector3[] = this.convertZXCoordsToXY(new WallMesh(true, trackPoints).holePoints);
        const exteriorWallPoints: Vector3[] = this.convertZXCoordsToXY(new WallMesh(false, trackPoints).shapePoints);

        for (let i: number = 0; i < connections.length; i++) {
            const limit: number = i === 0 ? connections.length - 1 : connections.length;

            for (let j: number = 0; j < limit; j++) {
                if (j > i + 1) {
                    const vectors1: Vector3[][] = this.generateTrackWallWidth(interiorWallPoints, exteriorWallPoints, i);
                    const vectors2: Vector3[][] = this.generateTrackWallWidth(interiorWallPoints, exteriorWallPoints, j);

                    if (this.checkIntersectionWithOffset(vectors1, vectors2)) {
                        connections[i].material = UNAUTHORIZED_LINE_MATERIAL;
                        connections[j].material = UNAUTHORIZED_LINE_MATERIAL;

                        return false;
                    }
                }
            }
        }

        return true;
    }

    private static generateTrackWallWidth(interiorWallPoints: Vector3[], exteriorWallPoints: Vector3[], index: number): Vector3[][] {
        const nextInteriorPoint: Vector3 = index + 1 === interiorWallPoints.length ? interiorWallPoints[0] : interiorWallPoints[index + 1];
        const nextExteriorPoint: Vector3 = index + 1 === exteriorWallPoints.length ? exteriorWallPoints[0] : exteriorWallPoints[index + 1];

        return [
            [interiorWallPoints[index], nextInteriorPoint],
            [exteriorWallPoints[index], nextExteriorPoint],
            [interiorWallPoints[index], exteriorWallPoints[index]],
            [nextInteriorPoint, nextExteriorPoint]
        ];
    }

    private static convertLinesToCommonCoordinates3D(connections: Line[]): CommonCoordinate3D[] {
        const array: CommonCoordinate3D[] = [];
        connections.forEach((connection: Line) => {
            const points: Vector3[] = ((connection.geometry) as Geometry).vertices;
            array.push(new CommonCoordinate3D(
                points[0].y,
                points[0].z,
                points[0].x
            ));
        });

        return array;
    }

    private static convertZXCoordsToXY(points: Vector3[]): Vector3[] {
        const array: Vector3[] = [];
        points.forEach((point: Vector3) =>
            array.push(new Vector3(point.z, point.x, 0))
        );

        return array;
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

        const vector3: Vector3[] = [];
        vector3[0] = new Vector3(vector[0].x + perpendicularVector.x * offset, vector[0].y + perpendicularVector.y * offset);
        vector3[1] = new Vector3(vector[1].x + perpendicularVector.x * offset, vector[1].y + perpendicularVector.y * offset);

        return vector3;
    }

    private static perpendicularVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();

        const vector3: Vector3[] = [];
        vector3[0] = new Vector3(vector[0].x, vector[0].y, 0);
        vector3[1] = new Vector3(
            vector[0].x + perpendicularVector.x * offset,
            vector[0].y + perpendicularVector.y * offset, 0);

        return vector3;
    }
}
