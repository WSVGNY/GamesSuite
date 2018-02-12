import {
    Vector3, Scene, AmbientLight, Mesh, Line, SphereGeometry,
    MeshBasicMaterial, LineBasicMaterial, Geometry, BackSide
} from "three";

export class Angle {

    private _value: number;

    public constructor(private _line1: Line, private _line2: Line) {
        let geo: Geometry = (_line1.geometry) as Geometry;
        const vector1: Vector3[] = geo.vertices;
        geo = (_line2.geometry) as Geometry;
        const vector2: Vector3[] = geo.vertices;
        const vertex1: number = Math.sqrt((vector2[0].x - vector1[0].x) * (vector2[0].x - vector1[0].x)
            + (vector2[0].y - vector1[0].y) * (vector2[0].y - vector1[0].y));
        const vertex2: number = Math.sqrt((vector2[0].x - vector2[1].x) * (vector2[0].x - vector2[1].x)
            + (vector2[0].y - vector2[1].y) * (vector2[0].y - vector2[1].y));
        const vertex3: number = Math.sqrt((vector2[1].x - vector1[0].x) * (vector2[1].x - vector1[0].x)
            + (vector2[1].y - vector1[0].y) * (vector2[1].y - vector1[0].y));
        this._value = Math.acos((vertex2 * vertex2 + vertex1 * vertex1 - vertex3 * vertex3)
            / ((vertex2 * vertex1) + (vertex2 * vertex1)));
    }

    public get value(): number {
        return this._value;
    }

    public get line1(): Line {
        return this._line1;
    }

    public get line2(): Line {
        return this._line2;
    }
}
