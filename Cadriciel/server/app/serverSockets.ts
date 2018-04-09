import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../common/crossword/difficulty";
import * as requestPromise from "request-promise-native";
import { CommonGrid } from "../../common/crossword/commonGrid";
import { Player } from "../../common/crossword/player";
import { GRID_GET_URL } from "./crossword/configuration";
import { MultiplayerGameLogic } from "./crossword/multiplayerGameLogic";

export class ServerSockets {
    private _io: SocketIO.Server;
    private _httpServer: http.Server;
    private _socketIdentifications: { id: string, room: string }[];
    private _gameLogic: MultiplayerGameLogic;

    public constructor(server: http.Server, initialize: boolean = false) {
        this._httpServer = server;
        this._socketIdentifications = [];
        this._gameLogic = new MultiplayerGameLogic();
        if (initialize) {
            this.initSocket();
        }
    }

    // tslint:disable:no-console
    public initSocket(): void {
        this._io = sio(this._httpServer);
        this._io.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {
            console.log("user connected");
            this.onDisconnect(socket);
            this.onRoomCreate(socket);
            this.onRoomsListQuery(socket);
            this.onRoomConnect(socket);
            this.onPlayerUpdate(socket);
            this.onRestartGameWithSameConfig(socket);
        });
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.Disconnection, () => {
            console.log("user disconnected");
            for (const game of this._gameLogic.games) {
                if (game.roomName === this.findSocketRoomNameByID(socket.id)) {
                    socket.broadcast.to(game.roomName).emit(SocketEvents.DisconnectionAlert);
                    this._gameLogic.deleteGame(game);
                }
            }
        });
    }

    private onRoomCreate(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomCreate, (message: { creator: string, difficulty: Difficulty }) => {
            console.log("Room creation by: " + message["creator"]);
            this._gameLogic.handleRoomCreate(message["difficulty"], message["creator"]);
            socket.join(this._gameLogic.games[this._gameLogic.numberOfGames - 1].roomName);
            this._socketIdentifications.push({ id: socket.id, room: this._gameLogic.games[this._gameLogic.numberOfGames - 1].roomName });
        });
    }

    private onRoomsListQuery(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomsListQuery, () => {
            console.log("Room list query");
            socket.emit(SocketEvents.RoomsListsQueryResponse, this._gameLogic.getListOfEmptyRooms());
        });
    }

    private onRoomConnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomConnect, (message: { roomInfo: MultiplayerCrosswordGame, playerName: string }) => {
            console.log("room connect event");
            try {
                const game: MultiplayerCrosswordGame = this._gameLogic.handleRoomConnect(message["roomInfo"], message["playerName"]);
                this.handleConnection(game, socket, message["playerName"]);
            } catch (e) {
                console.error(e);
            }
        });
    }

    private handleConnection(game: MultiplayerCrosswordGame, socket: SocketIO.Socket, playerName: string): void {
        if (game === undefined) {
            throw ReferenceError("Unable to connect to room");
        }
        socket.join(game.roomName);
        this._socketIdentifications.push({ id: socket.id, room: game.roomName });
        console.log("Connection to room: " + game.roomName + " by " + playerName + " successfull");
        if (this._gameLogic.shouldStartGame(game)) {
            this.startGame(game);
        }

    }

    private startGame(game: MultiplayerCrosswordGame): void {
        console.log("Game is starting from server");
        this.gridCreateQuery(game).then(() => {
            this._io.to(game.roomName).emit(SocketEvents.StartGame, game);
        }).catch((e: Error) => {
            console.error(e);
        });
    }

    private onPlayerUpdate(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.PlayerUpdate, (player: Player) => {
            console.log("player update event");
            socket.broadcast.to(this.findSocketRoomNameByID(socket.id)).emit(SocketEvents.PlayerUpdate, player);
        });
    }

    private onRestartGameWithSameConfig(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RestartGameWithSameConfig, () => {
            console.log("restart game with same config event");
            const gameIndex: number = this.findGameIndexWithRoom(this.findSocketRoomNameByID(socket.id));
            if (gameIndex >= 0) {
                this.updateRestartCounter(gameIndex, socket);
            } else {
                this._io.to(this.findSocketRoomNameByID(socket.id)).emit(SocketEvents.GameNotFound);
            }
        });
    }

    private updateRestartCounter(gameIndex: number, socket: SocketIO.Socket): void {
        const game: MultiplayerCrosswordGame = this._gameLogic.games[gameIndex];
        game.restartCounter++;
        if (game.restartCounter < MultiplayerCrosswordGame.MAX_PLAYER_NUMBER) {
            return;
        } else {
            game.restartCounter = 0;
            socket.broadcast.to(this.findSocketRoomNameByID(socket.id)).emit(SocketEvents.ReinitializeGame);
        }
        this.restartGame(game, socket);
    }

    private restartGame(game: MultiplayerCrosswordGame, socket: SocketIO.Socket): void {
        this.gridCreateQuery(game).then(() => {
            this._io.to(game.roomName).emit(SocketEvents.RestartGame, game);
        }).catch((e: Error) => {
            console.error(e);
        });
    }
    // tslint:enable:no-console

    private findSocketRoomNameByID(id: string): string {
        for (const socket of this._socketIdentifications) {
            if (socket.id === id) {
                return socket.room;
            }
        }

        return undefined;
    }

    private async gridCreateQuery(game: MultiplayerCrosswordGame): Promise<void> {
        await requestPromise(GRID_GET_URL + game.difficulty).then(
            (result: CommonGrid) => {
                game.grid = JSON.parse(result.toString());
            }
        ).catch((e: Error) => {
            console.error(e);
        });
    }

    private findGameIndexWithRoom(room: string): number {
        for (let i: number = 0; i < this._gameLogic.numberOfGames; ++i) {
            if (this._gameLogic.games[i].roomName === room) {
                return i;
            }
        }

        return -1;
    }

}
