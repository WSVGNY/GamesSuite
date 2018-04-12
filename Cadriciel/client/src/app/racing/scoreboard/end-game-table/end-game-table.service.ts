import { Injectable } from "@angular/core";
import { Score } from "../score";
import { CURRENT_PLAYER } from "../../constants";
import { Player } from "../../race-game/player";

@Injectable()
export class EndGameTableService {
    public players: Player[];
    public showTable: boolean;

    public constructor() {
        this.players = [];
        this.showTable = false;
    }

    public getPlayerScore(): Score {
        for (const player of this.players) {
            if (player.name === CURRENT_PLAYER) {
                return player.score;
            }
        }

        throw new Error("Player name is not set to Player 1");
    }
}
