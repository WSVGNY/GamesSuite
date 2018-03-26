import { Injectable } from "@angular/core";
import * as sio from "socket.io-client";
import { Observable } from "rxjs/Observable";
import { SocketEvents } from "../../../../common/communication/socketEvents";
import { Observer } from "rxjs/Observer";
import { Difficulty } from "../../../../common/crossword/difficulty";
import { MultiplayerCrosswordGame } from "../../../../common/crossword/multiplayerCrosswordGame";
import { CommonGrid } from "../../../../common/crossword/commonGrid";
import { Player } from "../../../../common/crossword/player";

const SERVER_URL: string = "http://localhost:3000";

@Injectable()
export class MultiplayerCommunicationService {

    public availableGames: MultiplayerCrosswordGame[];
    private _socket: SocketIOClient.Socket;
    private _currentGame: MultiplayerCrosswordGame;
    private _playerHolder: Player;

    public constructor() {
        this.availableGames = [];
    }

    public get currentGame(): MultiplayerCrosswordGame {
        return this._currentGame;
    }

    public get grid(): CommonGrid {
        return this._currentGame.grid;
    }

    public get updatedPlayer(): Player {
        return this._playerHolder;
    }

    public get isSocketDefined(): boolean {
        return this._socket !== undefined;
    }

    public connectToSocket(): void {
        if (this._socket === undefined) {
            this._socket = sio(SERVER_URL);
        }
    }

    public createRoom(playerName: string, roomDifficulty: Difficulty): void {
        if (this._socket !== undefined) {
            this._socket.emit(SocketEvents.RoomCreate, { creator: playerName, difficulty: roomDifficulty });
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

    public getMessagesConfigurationComponent = () => {
        if (this._socket === undefined) {
            return;
        }

        return Observable.create((observer: Observer<string>) => {
            this._socket.on(SocketEvents.RoomsListsQueryResponse, (message: MultiplayerCrosswordGame[]) => {
                for (const game of message) {
                    this.availableGames.push(MultiplayerCrosswordGame.create(JSON.stringify(game)));
                }
            });

            this._socket.on(SocketEvents.StartGame, (message: MultiplayerCrosswordGame) => {
                this._currentGame = MultiplayerCrosswordGame.create(JSON.stringify(message));
                observer.next(SocketEvents.StartGame);
            });

            this._socket.on(SocketEvents.DisconnectionAlert, () => {
                process.stdout.write("Other player disconnected\n");
            });
        });
    }

    public getMessagesCrosswordComponent = () => {
        if (this._socket === undefined) {
            return;
        }

        return Observable.create((observer: Observer<string>) => {
            this._socket.on(SocketEvents.PlayerUpdate, (player: Player) => {
                this._playerHolder = player;
                observer.next(SocketEvents.PlayerUpdate);
            });
        });
    }
}
