import * as sio from "socket.io";
import { SocketEvents } from "../../common/communication/socketEvents";
import * as http from "http";

export class ServerSockets {
    private readonly baseRoomName: string = "ROOM";

    private io: SocketIO.Server;
    private _roomName: string = this.baseRoomName;
    private _numberOfRoom: number = 0;
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
            if (this._roomName !== this.baseRoomName) {
                socket.join(this._roomName);
            }
            console.log("user connected");
            socket.on(SocketEvents.NewMessage, (message: string) => {
                console.log(message);
                this.io.emit(SocketEvents.NewMessage, message);
            });
            socket.on(SocketEvents.Disconnection, () => {
                console.log("user disconnected");
            });
        });
    }
    // tslint:enable:no-console

    public createRoom(): void {
        this._roomName += this._numberOfRoom++;

    }

}
