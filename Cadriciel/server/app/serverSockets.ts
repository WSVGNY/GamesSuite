import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";
import { Difficulty } from "../../common/crossword/difficulty";
import * as requestPromise from "request-promise-native";
import { CommonGrid } from "../../common/crossword/commonGrid";

export class ServerSockets {
    private static _numberOfRoom: number = 0;

    private readonly GRID_GET_URL: string = "http://localhost:3000/grid/gridGet/";
    private readonly baseRoomName: string = "ROOM";

    private io: SocketIO.Server;
    private _httpServer: http.Server;
    private _games: MultiplayerCrosswordGame[] = [];
    private grid: CommonGrid;

    public constructor(server: http.Server, initialize: boolean = false) {
        this._httpServer = server;
        if (initialize) {
            this.initSocket();
        }
    }

    // tslint:disable:no-console
    public initSocket(): void {
        this.io = sio(this._httpServer);
        this.io.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {
            console.log("user connected");
            this.onNewMessage(socket);
            this.onDisconnect(socket);
            this.onRoomCreate(socket);
            this.onRoomsListQuery(socket);
            this.onRoomConnect(socket);
        });
    }

    private onNewMessage(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.NewMessage, (message: string) => {
            console.log(message);
            this.io.to(this.getSocketRoom(socket)).emit(SocketEvents.NewMessage, message);
        });
    }

    private onDisconnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.Disconnection, () => {
            console.log("user disconnected");
        });
    }

    private onRoomCreate(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomCreate, (message: string) => {
            console.log(message);
            console.log("Room creation by: " + message["creator"]);
            this.createRoom(message["difficulty"]);
            console.log("Room name: " + this._games[ServerSockets._numberOfRoom - 1].roomName);
            socket.join(this._games[ServerSockets._numberOfRoom - 1].roomName);
            this._games[ServerSockets._numberOfRoom - 1].addPlayer({ name: message["creator"] });
            socket.emit(SocketEvents.RoomCreated, this._games[ServerSockets._numberOfRoom - 1].roomName);
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
                    if (game.addPlayer({ name: message["playerName"] })) {
                        socket.join(room.roomName);
                        console.log("Connection to room: " + room.roomName + " by " + message["playerName"] + " successfull");
                        if (game.isFull()) {
                            console.log("Game is starting from server");
                            this.gridCreateQuery(game).then(() => {
                                this.io.to(game.roomName).emit(SocketEvents.StartGame, this.grid);
                            }).catch((e: Error) => {
                                console.error(e);
                            });
                        }
                    } else {
                        console.log("Unable to connect to room: " + room.roomName + " by " + message["playerName"]);
                    }
                    break;
                }
            }
        });
    }
    // tslint:enable:no-console

    private createRoom(difficulty: Difficulty): void {
        this._games.push(new MultiplayerCrosswordGame(this.baseRoomName + ServerSockets._numberOfRoom++, difficulty));
    }

    private getSocketRoom(socket: SocketIO.Socket): string {
        return Object.keys(socket.rooms).filter((room: string) => room !== socket.id)[0];
    }

    private async gridCreateQuery(game: MultiplayerCrosswordGame): Promise<void> {
        await requestPromise(this.GRID_GET_URL + game.difficulty).then(
            (result: CommonGrid) => {
                this.grid = result;
            }
        ).catch((e: Error) => {
            console.error(e);
        });
    }
}
