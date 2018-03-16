import { CommonCoordinate2D } from "./commonCoordinate2D";
import { CommonChar } from "./commonChar";
import { CommonWord } from "./commonWord";

export interface CommonGridBox {

    char?: CommonChar;
    inputChar?: CommonChar;
    constraints?: CommonWord[];
    difficulty?: number;
    isColored?: boolean;
    id: CommonCoordinate2D;
    isBlack: boolean;
    readyForInput?: boolean;

}