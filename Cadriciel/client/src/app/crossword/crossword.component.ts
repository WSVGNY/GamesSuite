import { Component } from "@angular/core";
import { } from "@angular/";
import { GridBox } from "../../../../common/crossword/gridBox";
import { GridService } from "./grid.service";

@Component({
    selector: "app-crossword",
    templateUrl: "./crossword.component.html",
    styleUrls: ["./crossword.component.css"]
})
export class CrosswordComponent {

    public selectedGridBox: GridBox;
    private grid: GridBox[][];

    public constructor(private gridService: GridService) {
        this.createGrid();
    }

    public createGrid(): void {
        this.gridService.gridGet().subscribe((grid: GridBox[][]) => this.grid = grid);
    }

    public onSelect(gridBox: GridBox): void {
        this.selectedGridBox = gridBox;
    }
}
