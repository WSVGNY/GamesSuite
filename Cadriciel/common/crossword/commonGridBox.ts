import { CommonCoordinate2D } from "./commonCoordinate2D";
import { CommonChar } from "./commonChar";
import { CommonWord } from "./commonWord";

export interface CommonGridBox {

    _char?: CommonChar;
    _constraints?: CommonWord[];
    _difficulty?: number;
    _isColored?: boolean;
    _id: CommonCoordinate2D;
    _isBlack: boolean;

}