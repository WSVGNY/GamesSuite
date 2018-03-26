import assert = require("assert");
import * as sio from "socket.io-client";
import { SocketEvents } from "../../common/communication/socketEvents";
import { Difficulty } from "../../common/crossword/difficulty";
import { MultiplayerCrosswordGame } from "../../common/crossword/multiplayerCrosswordGame";
import { Player } from "../../common/crossword/player";
import { Word } from "./crossword/word";
import { CommonCoordinate3D } from "../../common/racing/commonCoordinate3D";

const SERVER_URL: string = "http://localhost:3000";

// tslint:disable-next-line:max-func-body-length
describe("Socket.IO tests", () => {
    const client1: SocketIOClient.Socket = sio(SERVER_URL);
    const client2: SocketIOClient.Socket = sio(SERVER_URL);
    const games: MultiplayerCrosswordGame[] = [];
    let client1Game: MultiplayerCrosswordGame;
    let client2Game: MultiplayerCrosswordGame;

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
            for (const game of message) {
                games.push(MultiplayerCrosswordGame.create(JSON.stringify(game)));
            }

            for (let i: number = 0; i < message.length; ++i) {

                for (let j: number = i + 1; j < message.length; ++j) {
                    assert(!(games[i].roomName === games[j].roomName));
                }

                assert(!(games[i].difficulty !== Difficulty.Easy &&
                    games[i].difficulty !== Difficulty.Medium &&
                    games[i].difficulty !== Difficulty.Hard));

                assert(!(games[i].isFull()));

                assert(!(games[i].grid !== undefined || games[i].players[0].name === undefined));
            }

            done();
        });
    });

    it("should be able to join and start game", (done: MochaDone) => {
        client2.emit(SocketEvents.RoomConnect, { roomInfo: games[0], playerName: "player2" });
        client1.on(SocketEvents.StartGame, (message: MultiplayerCrosswordGame) => {
            client1Game = MultiplayerCrosswordGame.create(JSON.stringify(message));
            if (client2Game !== undefined) {
                assert(client1Game.roomName === client2Game.roomName);
                done();
            } else {
                assert(client1Game.roomName === games[0].roomName);
            }

        });
        client2.on(SocketEvents.StartGame, (message: MultiplayerCrosswordGame) => {
            client2Game = MultiplayerCrosswordGame.create(JSON.stringify(message));
            if (client1Game !== undefined) {
                assert(client1Game.roomName === client2Game.roomName);
                done();
            } else {
                assert(client2Game.roomName === games[0].roomName);
            }
        });
    });

    it("should have same grid on start game", (done: MochaDone) => {
        for (let i: number = 0; i < client1Game.grid.words.length; ++i) {
            assert(client1Game.grid.words[i].value === client2Game.grid.words[i].value);
        }

        for (let i: number = 0; i < client1Game.grid.words.length; ++i) {
            assert(client1Game.grid.words[i].definition === client2Game.grid.words[i].definition);
        }

        for (let i: number = 0; i < client1Game.grid.boxes.length; ++i) {
            for (let j: number = 0; j < client1Game.grid.boxes[i].length; ++j) {
                assert(client1Game.grid.boxes[i][j].isBlack === client2Game.grid.boxes[i][j].isBlack);
            }
        }

        done();
    });

    it("should update player", (done: MochaDone) => {
        client1Game.players[0].foundWords = [];
        client1Game.players[0].foundWords.push(new Word(1, 1, true, 1, new CommonCoordinate3D(1, 1, 0)));
        client1Game.players[0].selectedWord = new Word(-1, 0, true, 0, new CommonCoordinate3D(0, 0, 0));
        client1.emit(SocketEvents.PlayerUpdate, client1Game.players[0]);
        client2.on(SocketEvents.PlayerUpdate, (player: Player) => {
            assert(player.name === client1Game.players[0].name);
            assert(player.color === client1Game.players[0].color);
            assert(player.score === client1Game.players[0].score);
            assert(player.selectedWord.id === client1Game.players[0].selectedWord.id);
            assert(player.foundWords[0].id === client1Game.players[0].foundWords[0].id);
            done();
        });
    });

});
