import { Injectable } from "@angular/core";
import * as sio from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { SocketEvents } from "../../../../common/communication/socketEvents";
import { Observer } from "rxjs/Observer";
import { Difficulty } from "../../../../common/crossword/difficulty";
import { CrosswordGame } from "../../../../common/crossword/crosswordGame";
@Injectable()
export class MultiplayerCommunicationService {

    private readonly url: string = "http://localhost:3000";
    private _socket: SocketIOClient.Socket;
    private _hasConnected: boolean = false;
    private _room: string;
    private _games: CrosswordGame[] = [];
    private _rooms: string[] = [];

    public get room(): string {
        return this._room;
    }

    public get rooms(): string[] {
        if (this._games !== undefined) {
            const rooms: string[] = [];
            for (const room of this._games) {
                rooms.push(room.roomName);
            }
            console.log(rooms);

            return rooms;
        }

        return undefined;
    }

    public get hasConnected(): boolean {
        return this._hasConnected;
    }

    public constructor() {
    }

    public connectToSocket(): void {
        this._socket = sio(this.url);
    }

    public createRoom(playerName: string, roomDifficulty: Difficulty): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.RoomCreate, { creator: playerName, difficulty: roomDifficulty });
        }
    }

    public sendMessage(message: string): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.NewMessage, message);
        }
    }

    public roomListQuery(): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.RoomsListQuery);
        }
    }

    public connectToRoom(room: { roomName: string, playerName: string }): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.RoomConnect, room);
        }
    }

    // https://codingblast.com/chat-application-angular-socket-io/
    public getMessages = () => {
        return Observable.create((observer: Observer<string>) => {
            this._socket.on(SocketEvents.NewMessage, (message: string) => {
                observer.next(message);
            });
            this._socket.on(SocketEvents.RoomCreated, (message: string) => {
                console.log(message);
                this._room = message;
            });
            this._socket.on(SocketEvents.RoomsListsQueryResponse, (message: CrosswordGame[]) => {
                console.log(message);
                this._games = message;
                for (const room of message) {
                    this._rooms.push(room["_roomName"] /*+ " of difficulty: " + room["_difficulty"]*/);
                }

            });
            this._socket.on(SocketEvents.StartGame, () => {
                observer.next(SocketEvents.StartGame);
            });
        });
    }
}
