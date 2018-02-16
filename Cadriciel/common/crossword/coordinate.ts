export class Coordinate {


    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
    }

    public constructor(public _x: number, public _y: number) {

    }

    public equals(coordinate: Coordinate): boolean {
        return (this.x === coordinate.x && this.y === coordinate.y);
    }
}