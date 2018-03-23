import { Player } from "./player";
import { Difficulty } from "./difficulty";
import { CommonGrid } from "./commonGrid";

export class MultiplayerCrosswordGame {
    public readonly MAX_PLAYER_NUMBER: number = 2;

    public static create(stringObject: string): MultiplayerCrosswordGame {
        const jsonObject = JSON.parse(stringObject) as MultiplayerCrosswordGame;
        return new MultiplayerCrosswordGame(jsonObject._roomName, jsonObject._difficulty, jsonObject._players, jsonObject.grid);
    }

    public constructor(
        private _roomName: string,
        private _difficulty: Difficulty,
        private _players: Player[] = [],
        public grid?: CommonGrid) {
    }

    public isFull(): boolean {
        return this._players.length >= this.MAX_PLAYER_NUMBER;
    }

    public addPlayer(player: Player): boolean {
        if (!this.isFull()) {
            this._players.push(player);
            return true;
        } else {
            return false;
        }
    }

    public get players(): Player[] {
        return this._players;
    }

    public get roomName(): string {
        return this._roomName;
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }
}