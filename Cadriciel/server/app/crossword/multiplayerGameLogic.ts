import { MultiplayerCrosswordGame } from "../../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../../common/crossword/difficulty";
import { BASE_ROOM_NAME, FIRST_PLAYER_COLOR } from "./configuration";

export class MultiplayerGameLogic {
    private static _numberOfRoom: number = 0;
    private _games: MultiplayerCrosswordGame[];

    public constructor() {
        this._games = [];
    }

    public get games(): MultiplayerCrosswordGame[] {
        return this._games;
    }

    public get numberOfGames(): number {
        return this._games.length;
    }

    // tslint:disable:no-console
    public deleteGame(game: MultiplayerCrosswordGame): void {
        const index: number = this._games.indexOf(game, 0);
        if (index > -1) {
            this._games.splice(index, 1);
            console.log("Deleted game of room name: " + game.roomName);
        }
    }

    public handleRoomCreate(difficulty: Difficulty, creator: string): void {
        this.createRoom(difficulty);
        this.games[this.numberOfGames - 1].addPlayer({ name: creator, color: FIRST_PLAYER_COLOR, score: 0 });
    }

    public getListOfEmptyRooms(): MultiplayerCrosswordGame[] {
        const emptyRooms: MultiplayerCrosswordGame[] = [];
        for (const rooms of this.games) {
            if (!rooms.isFull()) {
                emptyRooms.push(rooms);
            }
        }

        return emptyRooms;
    }

    private createRoom(difficulty: Difficulty): void {
        this._games.push(new MultiplayerCrosswordGame(BASE_ROOM_NAME + MultiplayerGameLogic._numberOfRoom++, difficulty));
        console.log("Room name: " + this._games[this.numberOfGames - 1].roomName + " of difficuly: " + difficulty);
    }
    // tslint:enable:no-console
}
