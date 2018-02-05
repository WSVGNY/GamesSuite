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

  public constructor(private gridService: GridService) {
    this.gridService.gridGet().subscribe((grid: GridBox[][]) => this.grid = grid);
  }

  public selectedGridBox: GridBox;
  private grid: GridBox[][];

  public onSelect(gridBox: GridBox): void {
    this.selectedGridBox = gridBox;
  }
}
