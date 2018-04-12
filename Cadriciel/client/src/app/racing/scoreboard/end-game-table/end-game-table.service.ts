import { Injectable } from "@angular/core";
import { CommonScore } from "../../../../../../common/racing/commonScore";
import { CURRENT_PLAYER } from "../../constants";

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
            if (score.name === CURRENT_PLAYER) {
                return score;
            }
        }

        // throw new Error("Player name is not set to Player 1");
        return { car: "HELLO", name: "JOHN", position: 1, firstLap: 1000, secondLap: 1000, thirdLap: 1000, totalTime: 2500 };
    }
}
