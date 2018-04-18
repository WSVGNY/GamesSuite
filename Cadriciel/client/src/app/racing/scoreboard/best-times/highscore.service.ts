import { Injectable } from "@angular/core";
import { CommonHighscore } from "../../../../../../common/racing/commonHighscore";
import { Player } from "../../race-game/player";

const TOPSCORES: number = 5;

@Injectable()
export class HighscoreService {
    public highscores: CommonHighscore[];
    public showTable: boolean;
    public newTime: number;

    public constructor() {
        this.highscores = [];
        this.showTable = false;
        this.newTime = 0;
    }

    public addNewScore(playerName: string): void {
        if (this.highscores.length === TOPSCORES) {
            this.highscores.pop();
        }
        this.highscores.push({
            position: 1,
            name: playerName,
            car: "Camero",
            time: this.newTime
        });
        this.highscores.sort((score1, score2): number => score1.time - score2.time);
        for (let i: number = 0; i < this.highscores.length; i++) {
            this.highscores[i].position = i + 1;
        }
        this.showTable = true;
    }

    public isNewHighScore(player: Player): boolean {
        this.newTime = player.score.totalTime;

        return player.position === 1 && (this.highscores.length < TOPSCORES ||
            this.newTime < this.highscores[this.highscores.length - 1].time);
    }

}
