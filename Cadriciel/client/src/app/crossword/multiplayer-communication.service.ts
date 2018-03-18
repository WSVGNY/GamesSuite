import { Injectable } from "@angular/core";
import * as sio from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { SocketEvents } from "../../../../common/communication/socketEvents";
import { Observer } from "rxjs/Observer";
@Injectable()
export class MultiplayerCommunicationService {

    private readonly url: string = "http://localhost:3000";
    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = sio(this.url);
    }

    public sendMessage(message: string): void {
        this.socket.emit(SocketEvents.NewMessage, message);
    }

    // https://codingblast.com/chat-application-angular-socket-io/
    public getMessages = () => {
        return Observable.create((observer: Observer<string>) => {
            this.socket.on(SocketEvents.NewMessage, (message: string) => {
                observer.next(message);
            });
        });
    }

}
