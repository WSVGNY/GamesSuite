import { CrosswordPlayer } from "./crosswordPlayer";
import { Difficulty } from "./difficulty";

export class CrosswordGame {
    public readonly MAX_PLAYER_NUMBER: number = 2;

    static create(stringObject: string): CrosswordGame {
        const jsonObject = JSON.parse(stringObject) as CrosswordGame;
        return new CrosswordGame(jsonObject["_roomName"], jsonObject["_difficulty"], jsonObject["_players"]);
    }

    public constructor(private _roomName: string, private _difficulty: Difficulty, private _players: CrosswordPlayer[] = []) {
    }

    public isFull(): boolean {
        return this._players.length >= this.MAX_PLAYER_NUMBER;
    }

    public addPlayer(player: CrosswordPlayer): boolean {
        if (!this.isFull()) {
            this._players.push(player);
            return true;
        } else {
            return false;
        }
    }

    public get players(): CrosswordPlayer[] {
        return this._players;
    }

    public get roomName(): string {
        return this._roomName;
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }
}