import { CommonGridBox } from "./commonGridBox";
import { CommonWord } from "./commonWord";

export interface Player {
    name: string;
    color: string;
    score: number;
    selectedGridBox?: CommonGridBox;
    selectedWord?: CommonWord;
}