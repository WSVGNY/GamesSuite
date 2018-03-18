import { Vector3 } from "three";

export class LineEquation {
    // line equation : az + bx + c = 0
    public constructor(public a: number, public b: number, public c: number, public initialPoint: Vector3) { }
}
