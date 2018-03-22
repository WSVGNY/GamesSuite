import { CommonWord } from "./commonWord";
import { CommonGridBox } from "./commonGridBox";

export interface Player {
    name: string;
    color: string;
    score: number;
    selectedWord?: CommonWord;
    selectedBoxes?: CommonGridBox[];
    foundWords?: CommonWord[];
    foundBoxes?: CommonGridBox[];
}