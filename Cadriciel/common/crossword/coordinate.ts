export class Coordinate {

    public constructor(public _x: number, public _y: number) {

    }

    public equals(coordinate: Coordinate): boolean {
        return (this._x === coordinate._x && this._y === coordinate._y);
    }
}