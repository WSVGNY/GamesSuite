import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";

export class ServerSockets {
    private static _numberOfRoom: number = 0;
    private readonly baseRoomName: string = "ROOM";

    private io: SocketIO.Server;
    public _roomNames: string[] = [];
    private _httpServer: http.Server;

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
            socket.on(SocketEvents.NewMessage, (message: string) => {
                console.log(message);
                this.io.to(this.getSocketRoom(socket)).emit(SocketEvents.NewMessage, message);
            });
            socket.on(SocketEvents.Disconnection, () => {
                console.log("user disconnected");
            });
            socket.on(SocketEvents.RoomCreate, () => {
                console.log("Room creation");
                this.createRoom();
                console.log("Room name: " + this._roomNames[ServerSockets._numberOfRoom - 1]);
                socket.join(this._roomNames[ServerSockets._numberOfRoom - 1]);
                socket.emit(SocketEvents.RoomCreated, this._roomNames[ServerSockets._numberOfRoom - 1]);
            });
            socket.on(SocketEvents.RoomsListQuery, () => {
                console.log("Room list query");
                socket.emit(SocketEvents.RoomsListQuery, this._roomNames);
            });
            socket.on(SocketEvents.RoomConnect, (room: string) => {
                console.log("Connection to room");
                socket.join(room);
            });
        });
    }
    // tslint:enable:no-console

    private createRoom(): void {
        this._roomNames.push(this.baseRoomName + ServerSockets._numberOfRoom++);
    }

    private getSocketRoom(socket: SocketIO.Socket): string {
        return Object.keys(socket.rooms).filter((room: string) => room !== socket.id)[0];
    }

}
