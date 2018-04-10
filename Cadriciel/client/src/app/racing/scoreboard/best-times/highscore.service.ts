import { Injectable } from "@angular/core";
import { CommonHighscore } from "../../../../../../common/racing/commonHighscore";
import { CommonScore } from "../../../../../../common/racing/commonScore";

const TOPSCORES: number = 5;

@Injectable()
export class HighscoreService {
    private _highscores: CommonHighscore[];
    public showTable: boolean;
    public newTime: number;

    public constructor() {
        this._highscores = [
            { position: 1, name: "un", car: "un", time: 900 },
            { position: 2, name: "deux", car: "deux", time: 990 },
            { position: 3, name: "trois", car: "trois", time: 2000 },
            { position: 4, name: "trois", car: "trois", time: 33030 }];
        this.showTable = false;
        this.newTime = 0;
    }

    public addNewScore(playerName: string): void {
        if (this._highscores.length === TOPSCORES) {
            this._highscores.pop();
        }
        this._highscores.push({
            position: 1,
            name: playerName,
            car: "Camero",
            time: this.newTime
        });
        this._highscores.sort((score1, score2): number => score1.time - score2.time);
        for (let i: number = 0; i < this._highscores.length; i++) {
            this._highscores[i].position = i + 1;
        }
        this.showTable = true;
    }

    public get highscores(): CommonHighscore[] {
        return this._highscores;
    }

    public isNewHighScore(score: CommonScore): boolean {
        this.newTime = score.totalTime;

        return score.totalTime < this._highscores[this._highscores.length - 1].time ||
            (this._highscores.length < TOPSCORES && score.position === 1);
    }

}
