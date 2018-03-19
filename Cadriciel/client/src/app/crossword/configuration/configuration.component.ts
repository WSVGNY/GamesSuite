import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { ConfigurationService } from "../configuration.service";
import { CommonGrid } from "../../../../../common/crossword/commonGrid";
import { Difficulty } from "../../../../../common/crossword/difficulty";
import { MultiplayerCommunicationService } from "../multiplayer-communication.service";
import { SocketEvents } from "../../../../../common/communication/socketEvents";

@Component({
    selector: "app-configuration",
    templateUrl: "./configuration.component.html",
    styleUrls: ["./configuration.component.css"]
})
export class ConfigurationComponent {
    public isNewGame: boolean = false;
    public isJoinGame: boolean = false;
    public difficulty: Difficulty;
    public choseGridDifficulty: boolean = false;
    private messages: string[] = [];
    public constructor(
        private _gridService: GridService,
        public configurationService: ConfigurationService,
        private multiplayerCommunicationService: MultiplayerCommunicationService) {
    }

    public setNewGame(): void {
        this.isNewGame = true;
    }

    public setJoinGame(): void {
        this.isJoinGame = true;
        this.multiplayerCommunicationService.connectToSocket();
        this.multiplayerCommunicationService.getMessages().subscribe((message: string) => {
            this.messages.push(message);
            console.log(message);
            if (message === SocketEvents.StartGame) {
                // this.configurationService.configurationDone = true;
            }
        });
        this.multiplayerCommunicationService.roomListQuery();
        this.configurationService.isSocketConnected = true;
    }

    public onRoomSelect(room: string): void {
        console.log({ roomName: room, playerName: this.configurationService.playerName });
        this.multiplayerCommunicationService.connectToRoom({ roomName: room, playerName: this.configurationService.playerName });
    }

    public createGrid(): void {
        this._gridService.gridGet(this.difficulty).subscribe((grid: CommonGrid) => {
            this.configurationService.grid = grid;
        });
    }

    private makeGrid(): void {
        this.choseGridDifficulty = true;
        // this.createGrid();
    }

    public makeEasyGrid(): void {
        this.difficulty = Difficulty.Easy;
        this.makeGrid();
    }

    public makeMediumGrid(): void {
        this.difficulty = Difficulty.Medium;
        this.makeGrid();
    }

    public makeHardGrid(): void {
        this.difficulty = Difficulty.Hard;
        this.makeGrid();
    }

    public submitName(): void {
        this.configurationService.configurationDone = true;
    }

    public createRoom(): void {
        this.multiplayerCommunicationService.connectToSocket();
        this.multiplayerCommunicationService.createRoom(this.configurationService.playerName, this.difficulty);
        this.configurationService.isSocketConnected = true;
    }

}
