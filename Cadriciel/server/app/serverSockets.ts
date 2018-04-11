import * as sio from "socket.io";
import * as http from "http";
import { SocketEvents } from "../../common/communication/socketEvents";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../common/crossword/difficulty";
import { Player } from "../../common/crossword/player";
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
        try {
            this._io.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {
                console.log("user connected");
                this.onDisconnect(socket);
                this.onRoomCreate(socket);
                this.onRoomsListQuery(socket);
                this.onRoomConnect(socket);
                this.onPlayerUpdate(socket);
                this.onRestartGameWithSameConfig(socket);
            });
        } catch (error) {
            console.error(error);
        }
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.Disconnection, () => {
            console.log("user disconnected");
            this.handleDisconnect(socket);
        });
    }

    private handleDisconnect(socket: SocketIO.Socket): void {
        for (const game of this._gameLogic.games) {
            if (game.roomName === this.findSocketRoomNameByID(socket.id)) {
                socket.broadcast.to(game.roomName).emit(SocketEvents.DisconnectionAlert);
                try {
                    this._gameLogic.deleteGame(game);
                    console.log("Deleted game of room name: " + game.roomName);
                    this.removeSocketFromSocketIdentification(socket);
                } catch (error) {
                    this.handleError(error, socket);
                }
            }
        }
    }

    private removeSocketFromSocketIdentification(socket: SocketIO.Socket): void {
        for (let i: number = 0; i < this._socketIdentifications.length; ++i) {
            if (this._socketIdentifications[i].id === socket.id) {
                this._socketIdentifications.splice(i, 1);

                return;
            }
        }
        throw ReferenceError("Unable to find room");
    }

    private onRoomCreate(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomCreate, (message: { creator: string, difficulty: Difficulty }) => {
            if (this.hasAlreadyCreatedARoom(socket)) {
                return;
            }
            console.log("Room creation by: " + message["creator"]);
            this._gameLogic.handleRoomCreate(message["difficulty"], message["creator"]);
            socket.join(this._gameLogic.games[this._gameLogic.numberOfGames - 1].roomName);
            console.log("Room name: " + this._gameLogic.games[this._gameLogic.numberOfGames - 1].roomName);
            this._socketIdentifications.push({ id: socket.id, room: this._gameLogic.games[this._gameLogic.numberOfGames - 1].roomName });
        });
    }

    private hasAlreadyCreatedARoom(socket: SocketIO.Socket): boolean {
        if (socket === undefined || this._socketIdentifications.length === 0) {
            return false;
        }
        for (const socketID of this._socketIdentifications) {
            if (socketID.id === socket.id) {
                return true;
            }
        }

        return false;
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
            } catch (error) {
                this.handleError(error, socket);
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
            console.log("Game is starting from server");
            this._gameLogic.startGame(game).then(() => {
                this._io.to(game.roomName).emit(SocketEvents.StartGame, game);
            });
        }
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
            const socketRoom: string = this.findSocketRoomNameByID(socket.id);
            try {
                if (this._gameLogic.handleRestartGameWithSameConfig(socketRoom)) {
                    socket.broadcast.to(this.findSocketRoomNameByID(socket.id)).emit(SocketEvents.ReinitializeGame);
                }
            } catch (error) {
                this.handleError(error, socket);
            }
            this.tryRestartGame(socketRoom);
        });
    }

    private tryRestartGame(room: string): void {
        const game: MultiplayerCrosswordGame = this._gameLogic.getCurrentGame(room);
        if (this._gameLogic.tryRestartGame(game)) {
            console.log("Game is restarting from server");
            this._gameLogic.startGame(game).then(() => {
                this._io.to(game.roomName).emit(SocketEvents.RestartGame, game);
            });
        }
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

    private handleError(error: Error, socket: SocketIO.Socket): void {
        if (error instanceof ReferenceError || error instanceof RangeError) {
            this._io.to(this.findSocketRoomNameByID(socket.id)).emit(SocketEvents.GameNotFound);
        } else {
            throw error;
        }
    }
}
