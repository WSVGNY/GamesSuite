import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";
import { CrosswordGame } from "../../common/crossword/crosswordGame";
import { Difficulty } from "../../common/crossword/difficulty";

export class ServerSockets {
    private static _numberOfRoom: number = 0;
    private readonly baseRoomName: string = "ROOM";

    private io: SocketIO.Server;
    private _httpServer: http.Server;
    private _games: CrosswordGame[] = [];

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
            const emptyRooms: CrosswordGame[] = [];
            for (const rooms of this._games) {
                if (!rooms.isFull()) {
                    emptyRooms.push(rooms);
                }
            }
            socket.emit(SocketEvents.RoomsListsQueryResponse, emptyRooms);
        });
    }

    private onRoomConnect(socket: SocketIO.Socket): void {
        socket.on(SocketEvents.RoomConnect, (room: string) => {
            console.log("room connect event");
            console.log(room);
            // console.log(this._games);
            console.log("ALLO");
            // console.log(this._games);
            for (const game of this._games) {
                console.log("WTF");
                console.log(game.roomName);
                console.log(room["roomInfo"]["roomName"]);
                if (game["_roomName"] === room["roomInfo"]["roomName"]) {
                    console.log("allo");
                    if (game.addPlayer({ name: room["playerName"] })) {
                        socket.join(room["_roomName"]);
                        console.log("Connection to room: " + room["roomInfo"]["roomName"] + " by " + room["playerName"] + " successfull");
                        if (game.isFull()) {
                            console.log("Game is starting from server");
                            this.io.to(game.roomName).emit(SocketEvents.StartGame);
                        }
                    } else {
                        console.log("Unable to connect to room: " + room["roomName"] + " by " + room["playerName"]);
                    }
                    break;
                }
            }
        });
    }
    // tslint:enable:no-console

    private createRoom(difficulty: Difficulty): void {
        this._games.push(new CrosswordGame(this.baseRoomName + ServerSockets._numberOfRoom++, difficulty));
    }

    private getSocketRoom(socket: SocketIO.Socket): string {
        return Object.keys(socket.rooms).filter((room: string) => room !== socket.id)[0];
    }

}
