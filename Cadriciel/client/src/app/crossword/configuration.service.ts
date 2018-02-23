import { Injectable } from "@angular/core";
import { Grid } from "../../../../common/crossword/grid";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonWord } from "../../../../common/crossword/commonWord";

@Injectable()
export class ConfigurationService {

    public grid: Grid;
    public boxes: CommonGridBox[][];
    public words: CommonWord[];
    public configurationDone: boolean;
    public isTwoPlayerGame: boolean;
    public playerName: string;

    public constructor() { }

}
