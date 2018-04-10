import { Injectable } from "@angular/core";
import { CommonScore } from "../../../../../common/racing/commonScore";

@Injectable()
export class EndGameTableService {
    public scores: CommonScore[];
    public showTable: boolean;

    public constructor() {
        this.scores = [];
        this.showTable = true;
    }
}
