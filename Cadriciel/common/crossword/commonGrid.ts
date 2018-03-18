import { CommonWord } from "./commonWord";
import { Difficulty } from "./difficulty";
import { CommonGridBox } from "./commonGridBox";

export interface CommonGrid {
    words: CommonWord[];
    difficulty?: Difficulty;
    boxes: CommonGridBox[][];
}