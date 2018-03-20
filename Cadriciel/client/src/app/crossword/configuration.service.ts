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
    private _currentPlayerName: string;

    public get currentPlayer(): Player {
        return this.playerOne.name === this._currentPlayerName ?
            this.playerOne :
            this.playerTwo;
    }

    public get otherPlayer(): Player {
        return this.playerOne.name !== this._currentPlayerName ?
            this.playerOne :
            this.playerTwo;
    }

    public set currentPlayerName(playerName: string) {
        this._currentPlayerName = playerName;
    }
}
