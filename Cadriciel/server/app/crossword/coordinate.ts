import { CommonCoordinate } from "../../../common/commonCoordinate";

export class Coordinate extends CommonCoordinate {

    public constructor(x: number, y: number) {
        super(x, y);
    }

    public equals(coordinate: Coordinate): boolean {
        return (this._x === coordinate._x && this._y === coordinate._y);
    }
}
