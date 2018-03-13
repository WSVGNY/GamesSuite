import { Injectable } from "@angular/core";
import { CommonGrid } from "../../../../common/crossword/commonGrid";

@Injectable()
export class ConfigurationService {

    public grid: CommonGrid;
    public configurationDone: boolean;
    public isTwoPlayerGame: boolean;
    public playerName: string;
    public lookingForPlayer: boolean;
}
