import { CommonCoordinate2D } from "../../../common/crossword/commonCoordinate2D";

export class Coordinate2D extends CommonCoordinate2D {

    public constructor(x: number, y: number) {
        super(x, y);
    }

    public equals(coordinate: Coordinate2D): boolean {
        return (this.x === coordinate.x && this.y === coordinate.y);
    }
}
