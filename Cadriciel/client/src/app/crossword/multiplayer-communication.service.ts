import { Injectable } from "@angular/core";
import * as sio from "socket.io-client";

@Injectable()
export class MultiplayerCommunicationService {

    private readonly url: string = "http://localhost:3000";
    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = sio(this.url);
        this.socket.on("new-message", (message: string) => {
            console.log(message);
        });
    }

    public sendMessage(message: string): void {
        this.socket.emit("new-message", message);
    }

    // https://codingblast.com/chat-application-angular-socket-io/
    public getMessages(): void {
    }
}
