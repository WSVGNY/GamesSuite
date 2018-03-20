import { Injectable } from "@angular/core";
import * as sio from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { SocketEvents } from "../../../../common/communication/socketEvents";
import { Observer } from "rxjs/Observer";
import { Difficulty } from "../../../../common/crossword/difficulty";
import { MultiplayerCrosswordGame } from "../../../../common/crossword/multiplayerCrosswordGame";
import { CommonGrid } from "../../../../common/crossword/commonGrid";
import { Player } from "../../../../common/crossword/player";

@Injectable()
export class MultiplayerCommunicationService {

    private readonly URL: string = "http://localhost:3000";
    private _socket: SocketIOClient.Socket;
    private _hasConnected: boolean = false;
    public _games: MultiplayerCrosswordGame[] = [];
    private _currentGame: MultiplayerCrosswordGame;
    private _temporaryPlayerHolder: Player;

    public get hasConnected(): boolean {
        return this._hasConnected;
    }

    public get currentGame(): MultiplayerCrosswordGame {
        return this._currentGame;
    }

    public get grid(): CommonGrid {
        return this._currentGame.grid;
    }

    public get updatedPlayer(): Player {
        return this._temporaryPlayerHolder;
    }

    public get isSocketDefined(): boolean {
        return this._socket !== undefined;
    }

    public constructor() {
    }

    public connectToSocket(): void {
        if (this._socket === undefined) {
            this._socket = sio(this.URL);
        }

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

    public playerUpdate(player: Player): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.PlayerUpdate, player);
        }
    }

    public connectToRoom(room: { roomInfo: MultiplayerCrosswordGame, playerName: string }): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.RoomConnect, room);
        }
    }

    // https://codingblast.com/chat-application-angular-socket-io/
    public getMessages = () => {
        if (this._socket !== undefined) {
            return Observable.create((observer: Observer<string>) => {
                this._socket.on(SocketEvents.NewMessage, (message: string) => {
                    observer.next(message);
                });
                this._socket.on(SocketEvents.RoomCreated, (message: string) => {
                    console.log(message);
                });
                this._socket.on(SocketEvents.RoomsListsQueryResponse, (message: MultiplayerCrosswordGame[]) => {
                    console.log(message);
                    for (const game of message) {
                        this._games.push(MultiplayerCrosswordGame.create(JSON.stringify(game)));
                    }
                });
                this._socket.on(SocketEvents.StartGame, (message: MultiplayerCrosswordGame) => {
                    this._currentGame = MultiplayerCrosswordGame.create(JSON.stringify(message));
                    observer.next(SocketEvents.StartGame);
                });
                this._socket.on(SocketEvents.PlayerUpdate, (player: Player) => {
                    this._temporaryPlayerHolder = player;
                    observer.next(SocketEvents.PlayerUpdate);
                });
            });
        }
    }
}
