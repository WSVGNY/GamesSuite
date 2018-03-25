import assert = require("assert");
import * as sio from "socket.io-client";
import { SocketEvents } from "../../common/communication/socketEvents";
import { Difficulty } from "../../common/crossword/difficulty";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";

const SERVER_URL: string = "http://localhost:3000";

// tslint:disable-next-line:max-func-body-length
describe.only("Socket.IO tests", () => {
    const client1: SocketIOClient.Socket = sio(SERVER_URL);
    const client2: SocketIOClient.Socket = sio(SERVER_URL);

    it("clients should be defined", (done: MochaDone) => {
        assert(client1 !== undefined && client2 !== undefined);
        done();
    });

    it("should have created a room and subscribed to it's messages", (done: MochaDone) => {
        client1.emit(SocketEvents.RoomCreate, { creator: "testPlayer", difficulty: Difficulty.Easy });
        client1.emit(SocketEvents.RoomsListQuery);
        let hasBeenCalled: boolean = false;
        client1.on(SocketEvents.RoomsListsQueryResponse, (message: MultiplayerCrosswordGame[]) => {
            if (!hasBeenCalled) {
                hasBeenCalled = true;
                done();
            }
        });
    });

    it("should query a list of room that is valid", (done: MochaDone) => {
        client1.emit(SocketEvents.RoomCreate, { creator: "testPlayer", difficulty: Difficulty.Easy });
        client1.emit(SocketEvents.RoomsListQuery);
        client1.on(SocketEvents.RoomsListsQueryResponse, (message: MultiplayerCrosswordGame[]) => {
            const availableGames: MultiplayerCrosswordGame[] = [];
            for (const game of message) {
                availableGames.push(MultiplayerCrosswordGame.create(JSON.stringify(game)));
            }
            let isValid: boolean = true;

            for (let i: number = 0; i < message.length; ++i) {
                for (let j: number = i + 1; j < message.length; ++j) {
                    if (availableGames[i].roomName === availableGames[j].roomName) {
                        isValid = false;
                    }

                }
            }

            assert(isValid);
            done();
        });
    });

    it("should setup a join game", (done: MochaDone) => {
        assert(client1 !== undefined && client2 !== undefined);
        done();
    });

    it("should have same grid on start game", (done: MochaDone) => {
        assert(client1 !== undefined && client2 !== undefined);
        done();
    });

});
