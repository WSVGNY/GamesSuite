import { Injectable } from "@angular/core";
import { CommonGrid } from "../../../../common/crossword/commonGrid";
import { Player } from "../../../../common/crossword/player";

@Injectable()
export class ConfigurationService {

    public grid: CommonGrid;
    public configurationDone: boolean;
    public isSocketConnected: boolean;
    public isTwoPlayerGame: boolean;
    public playerOne: Player;
    public playerTwo: Player;
    public lookingForPlayer: boolean;
}
