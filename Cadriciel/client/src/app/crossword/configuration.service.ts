import { Injectable } from "@angular/core";
import { CommonGrid } from "../../../../common/crossword/commonGrid";

@Injectable()
export class ConfigurationService {

    public grid: CommonGrid;
    public configurationDone: boolean;
    public isSocketConnected: boolean;
    public isTwoPlayerGame: boolean;
    public playerName: string;
    public secondPlayerName: string;
    public lookingForPlayer: boolean;
}
