import { Injectable } from "@angular/core";
import { CommonHighscore } from "../../../../../common/racing/commonHighscore";

const TOPSCORES: number = 5;

@Injectable()
export class HighscoreService {
    private _highscores: CommonHighscore[] = [
        { position: 1, name: "un", car: "un", time: 900 },
        { position: 2, name: "deux", car: "deux", time: 990 },
        { position: 3, name: "trois", car: "trois", time: 2000 },
        { position: 5, name: "trois", car: "trois", time: 33030 }];
    private _addedScore: boolean = false;

    public addNewScore(playerName: string): void {
        if (this._highscores.length === TOPSCORES) {
            this._highscores.pop();
        }
        this._highscores.push({
            position: 1,
            name: playerName,
            car: "Camero",
            time: 1000
        });
        this._highscores.sort((score1, score2): number => score1.time - score2.time);
        for (let i: number = 0; i < this._highscores.length; i++) {
            this._highscores[i].position = i + 1;
        }
        this._addedScore = true;
    }

    public get highscores(): CommonHighscore[] {
        return this._highscores;
    }

    public get addedScore(): boolean {
        return this._addedScore;
    }
}
