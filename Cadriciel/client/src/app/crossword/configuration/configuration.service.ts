import { Injectable } from "@angular/core";
import { CommonGrid } from "../../../../../common/crossword/commonGrid";
import { Player } from "../../../../../common/crossword/player";
import { Difficulty } from "../../../../../common/crossword/difficulty";

@Injectable()
export class ConfigurationService {

    public grid: CommonGrid;
    public configurationDone: boolean;
    public isTwoPlayerGame: boolean;
    public playerOne: Player;
    public playerTwo: Player;
    public lookingForPlayer: boolean;
    public difficulty: Difficulty;
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

    public updateOtherPlayer(player: Player): void {
        this.playerOne.name !== this._currentPlayerName ?
            this.playerOne = player :
            this.playerTwo = player;
    }

    public set currentPlayerName(playerName: string) {
        this._currentPlayerName = playerName;
    }

    public handleGameStart(grid: CommonGrid, players: Player[]): void {
        this.grid = grid;
        this.playerOne = players[0];
        this.playerTwo = players[1];
        this.lookingForPlayer = false;
        this.configurationDone = true;
    }

    public getX(): number {
        return this.currentPlayer.selectedWord.isHorizontal ?
            this.currentPlayer.selectedWord.startPosition.x +
            this.currentPlayer.selectedWord.enteredCharacters :
            this.currentPlayer.selectedWord.startPosition.x;
    }

    public getY(): number {
        return this.currentPlayer.selectedWord.isHorizontal ?
            this.currentPlayer.selectedWord.startPosition.y :
            this.currentPlayer.selectedWord.startPosition.y +
            this.currentPlayer.selectedWord.enteredCharacters;
    }

}
