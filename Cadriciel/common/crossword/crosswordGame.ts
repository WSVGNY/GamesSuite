import { CrosswordPlayer } from "./crosswordPlayer";

export class CrosswordGame {
    public readonly MAX_PLAYER_NUMBER: number = 2;
    private _players: CrosswordPlayer[];

    public constructor(private _roomName: string) {
    }

    public isFull(): boolean {
        return this._players.length < this.MAX_PLAYER_NUMBER;
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
}