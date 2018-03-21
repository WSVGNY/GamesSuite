import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../common/crossword/difficulty";
import * as requestPromise from "request-promise-native";
import { CommonGrid } from "../../common/crossword/commonGrid";
import { Player } from "../../common/crossword/player";
import { BASE_ROOM_NAME, GRID_GET_URL, FIRST_PLAYER_COLOR, SECOND_PLAYER_COLOR } from "./crossword/configuration";

export class ServerSockets {
    private static _numberOfRoom: number = 0;

    private _io: SocketIO.Server;
    private _httpServer: http.Server;
    private _games: MultiplayerCrosswordGame[] = [];

    public constructor(server: http.Server, initialize: boolean = false) {
        this._httpServer = server;
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
        });
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.Disconnection, () => {
            console.log("user disconnected");
        });
    }

    private onRoomCreate(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomCreate, (message: { creator: string, difficulty: Difficulty }) => {
            console.log("Room creation by: " + message["creator"]);
            this.createRoom(message["difficulty"]);
            console.log("Room name: " + this._games[ServerSockets._numberOfRoom - 1].roomName + " of difficuly: " + message["difficulty"]);
            socket.join(this._games[ServerSockets._numberOfRoom - 1].roomName);
            this._games[ServerSockets._numberOfRoom - 1].addPlayer({ name: message["creator"], color: FIRST_PLAYER_COLOR, score: 0 });
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
            socket.broadcast.to(this.getSocketRoom(socket)).emit(SocketEvents.PlayerUpdate, player);
        });
    }
    // tslint:enable:no-console

    private createRoom(difficulty: Difficulty): void {
        this._games.push(new MultiplayerCrosswordGame(BASE_ROOM_NAME + ServerSockets._numberOfRoom++, difficulty));
    }

    private getSocketRoom(socket: SocketIO.Socket): string {
        return Object.keys(socket.rooms).filter((room: string) => room !== socket.id)[0];
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
}
