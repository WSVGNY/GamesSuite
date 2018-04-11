import { Injectable } from "@angular/core";
import { CommonScore } from "../../../../../../common/racing/commonScore";

@Injectable()
export class EndGameTableService {
    public scores: CommonScore[];
    public showTable: boolean;

    public constructor() {
        this.scores = [];
        this.showTable = false;
    }

    public getPlayerScore(): CommonScore {
        for (const score of this.scores) {
            if (score.name === "Player 1") {
                return score;
            }
        }

        throw new Error("Player name is not set to Player 1");
    }
}
