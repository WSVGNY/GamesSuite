import { Injectable } from "@angular/core";
import { Player } from "../../race-game/player";
import { CURRENT_PLAYER } from "../../constants/global.constants";

@Injectable()
export class EndGameTableService {
    public players: Player[];
    public showTable: boolean;

    public constructor() {
        this.players = [];
        this.showTable = false;
    }

    public getHumanPlayer(): Player {
        for (const player of this.players) {
            if (player.name === CURRENT_PLAYER) {
                return player;
            }
        }

        throw new Error("Player name is not set to Player 1");
    }

    public setPlayers(players: Player[]): void {
        this.players = players.sort((player1: Player, player2: Player) => player1.score.totalTime - player2.score.totalTime);
        this.setPositions();
    }

    private setPositions(): void {
        let position: number = 1;
        for (const player of this.players) {
            player.position = position++;
        }
    }
}
