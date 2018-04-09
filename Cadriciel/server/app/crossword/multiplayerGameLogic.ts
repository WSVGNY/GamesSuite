import { MultiplayerCrosswordGame } from "../../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../../common/crossword/difficulty";
import { BASE_ROOM_NAME, FIRST_PLAYER_COLOR, SECOND_PLAYER_COLOR } from "./configuration";
import { SocketEvents } from "../../../common/communication/socketEvents";

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
        } else {
            throw ReferenceError("Unable to find room");
        }
    }

    public handleRoomCreate(difficulty: Difficulty, creator: string): void {
        this.createRoom(difficulty);
        this.games[this.numberOfGames - 1].addPlayer({ name: creator, color: FIRST_PLAYER_COLOR, score: 0 });
    }

    private createRoom(difficulty: Difficulty): void {
        this._games.push(new MultiplayerCrosswordGame(BASE_ROOM_NAME + MultiplayerGameLogic._numberOfRoom++, difficulty));
        console.log("Room name: " + this._games[this.numberOfGames - 1].roomName + " of difficuly: " + difficulty);
    }

    // tslint:enable:no-console

    public getListOfEmptyRooms(): MultiplayerCrosswordGame[] {
        const emptyRooms: MultiplayerCrosswordGame[] = [];
        for (const rooms of this.games) {
            if (!rooms.isFull()) {
                emptyRooms.push(rooms);
            }
        }

        return emptyRooms;
    }

    public handleRoomConnect(roomInfo: MultiplayerCrosswordGame, playerName: string): MultiplayerCrosswordGame {
        for (const game of this.games) {
            const room: MultiplayerCrosswordGame = MultiplayerCrosswordGame.create(JSON.stringify(roomInfo));
            if (game.roomName === room.roomName) {
                return this.tryAddPlayer(game, room, playerName);
            }
        }
        throw ReferenceError("Unable to find room");
    }

    private tryAddPlayer(
        game: MultiplayerCrosswordGame, room: MultiplayerCrosswordGame, playerName: string): MultiplayerCrosswordGame {
        if (game.addPlayer({ name: playerName, color: SECOND_PLAYER_COLOR, score: 0 })) {
            return game;
        } else {
            throw RangeError("Unable to connect to room: " + room.roomName + " by " + playerName);
        }
    }

    public handleRestartGameWithSameConfig(roomName: string): SocketEvents {
        const gameIndex: number = this.findGameIndexWithRoom(roomName);
        if (gameIndex >= 0) {
            return this.updateRestartCounter(gameIndex);
        } else {
            return SocketEvents.GameNotFound;
        }
    }

    private updateRestartCounter(gameIndex: number): SocketEvents {
        const game: MultiplayerCrosswordGame = this.games[gameIndex];
        game.restartCounter++;
        if (game.restartCounter < MultiplayerCrosswordGame.MAX_PLAYER_NUMBER) {
            return undefined;
        } else {
            return SocketEvents.ReinitializeGame;
        }
    }

    private findGameIndexWithRoom(room: string): number {
        for (let i: number = 0; i < this.numberOfGames; ++i) {
            if (this.games[i].roomName === room) {
                return i;
            }
        }

        return -1;
    }

    public restartGame(game: MultiplayerCrosswordGame): void {
        game.restartCounter = 0;
    }

    public shouldStartGame(game: MultiplayerCrosswordGame): boolean {
        return game.isFull();
    }

    public shouldRestartGame(game: MultiplayerCrosswordGame): boolean {
        return game.restartCounter >= MultiplayerCrosswordGame.MAX_PLAYER_NUMBER;
    }

    public getCurrentGame(room: string): MultiplayerCrosswordGame {
        const index: number = this.findGameIndexWithRoom(room);

        return index >= 0 ? this._games[index] : undefined;
    }
}
