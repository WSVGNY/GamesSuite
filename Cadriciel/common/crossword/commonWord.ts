import { CommonCoordinate2D } from "./commonCoordinate2D";

export interface CommonWord {

    _isComplete: boolean;
    value: string;
    definition: string;
    constraints: CommonWord[];
    difficulty: number;
    parentCaller: CommonWord;
    id: number;
    definitionID: number;
    isHorizontal: boolean;
    length: number;
    startPosition: CommonCoordinate2D;

}