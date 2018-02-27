import { Injectable } from "@angular/core";
import { Grid } from "../../../../common/crossword/grid";

@Injectable()
export class ConfigurationService {

    public grid: Grid;
    public configurationDone: boolean;
    public isTwoPlayerGame: boolean;
    public playerName: string;

}
