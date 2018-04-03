import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../common/crossword/difficulty";
import * as requestPromise from "request-promise-native";
import { CommonGrid } from "../../common/crossword/commonGrid";
import { Player } from "../../common/crossword/player";
import { BASE_ROOM_NAME, GRID_GET_URL, FIRST_PLAYER_COLOR, SECOND_PLAYER_COLOR } from "./crossword/configuration";

const INDEX_NOT_FOUND: number = -1;

export class ServerSockets {
    private static _numberOfRoom: number = 0;

    private _io: SocketIO.Server;
    private _httpServer: http.Server;
    private _games: MultiplayerCrosswordGame[];
    private _socketIdentification: { id: string, room: string }[];

    public constructor(server: http.Server, initialize: boolean = false) {
        this._httpServer = server;
        this._games = [];
        this._socketIdentification = [];
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
            this.onRoomConnect(socket).then().catch((e: Error) => console.error(e.message));
            this.onPlayerUpdate(socket);
            this.onRestartGameWithSameConfig(socket);
        });
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.Disconnection, () => {
            console.log("user disconnected");
            for (const game of this._games) {
                if (game.roomName === this.findSocketRoomNameByID(socket.id)) {
                    socket.broadcast.to(game.roomName).emit(SocketEvents.DisconnectionAlert);
                    this.deleteGame(game);
                }
            }
        });
    }

    private deleteGame(game: MultiplayerCrosswordGame): void {
        const index: number = this._games.indexOf(game, 0);
        if (index > INDEX_NOT_FOUND) {
            this._games.splice(index, 1);
            console.log("Deleted game of room name: " + game.roomName);
        }
    }

    private onRoomCreate(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomCreate, (message: { creator: string, difficulty: Difficulty }) => {
            console.log("Room creation by: " + message["creator"]);
            this.createRoom(message["difficulty"]);
            console.log("Room name: " + this._games[this._games.length - 1].roomName + " of difficuly: " + message["difficulty"]);
            socket.join(this._games[this._games.length - 1].roomName);
            this._socketIdentification.push({ id: socket.id, room: this._games[this._games.length - 1].roomName });
            this._games[this._games.length - 1].addPlayer({ name: message["creator"], color: FIRST_PLAYER_COLOR, score: 0 });
        });
    }

    private onRoomsListQuery(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomsListQuery, () => {
            console.log("Room list query");
            const emptyRooms: MultiplayerCrosswordGame[] = [];
            for (const rooms of this._games) {
                if (!rooms.isFull()) {
                    emptyRooms.push(rooms);
                }
            }
            socket.emit(SocketEvents.RoomsListsQueryResponse, emptyRooms);
        });
    }

    private async onRoomConnect(socket: SocketIO.Socket): Promise<void> {
        socket.on(SocketEvents.RoomConnect, (message: { roomInfo: MultiplayerCrosswordGame, playerName: string }) => {
            console.log("room connect event");
            for (const game of this._games) {
                const room: MultiplayerCrosswordGame = MultiplayerCrosswordGame.create(JSON.stringify(message["roomInfo"]));
                if (game.roomName === room.roomName) {
                    this.tryAddPlayer(game, room, socket, message["playerName"]);
                    break;
                }
            }
        });
    }

    private tryAddPlayer(
        game: MultiplayerCrosswordGame, room: MultiplayerCrosswordGame,
        socket: SocketIO.Socket, playerName: string): void {
        if (game.addPlayer({ name: playerName, color: SECOND_PLAYER_COLOR, score: 0 })) {
            socket.join(room.roomName);
            this._socketIdentification.push({ id: socket.id, room: room.roomName });
            console.log("Connection to room: " + room.roomName + " by " + playerName + " successfull");
            if (game.isFull()) {
                this.startGame(game);
            }
        } else {
            console.log("Unable to connect to room: " + room.roomName + " by " + playerName);
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
            const index: number = this.findGameIndexWithRoom(this.findSocketRoomNameByID(socket.id));
            if (index >= 0) {
                const game: MultiplayerCrosswordGame = this._games[index];
                this._io.to(game.roomName).emit(SocketEvents.RestartGame);
            } else {
                this._io.to(this.findSocketRoomNameByID(socket.id)).emit(SocketEvents.GameNotFound);
            }
        });
    }
    // tslint:enable:no-console

    private createRoom(difficulty: Difficulty): void {
        this._games.push(new MultiplayerCrosswordGame(BASE_ROOM_NAME + ServerSockets._numberOfRoom++, difficulty));
    }

    private findSocketRoomNameByID(id: string): string {
        for (const socket of this._socketIdentification) {
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
        for (let i: number = 0; i < this._games.length; ++i) {
            if (this._games[i].roomName === room) {
                return i;
            }
        }

        return -1;
    }
}
