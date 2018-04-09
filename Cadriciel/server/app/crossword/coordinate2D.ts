import { CommonCoordinate2D } from "../../../common/crossword/commonCoordinate2D";

export class Coordinate2D implements CommonCoordinate2D {

    public constructor(public y: number, public x: number) { }

    public equals(coordinate: Coordinate2D): boolean {
        return coordinate !== undefined ?
            (this.x === coordinate.x && this.y === coordinate.y) :
            false;
    }
}
