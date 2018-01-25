import { Component, OnInit } from "@angular/core";
import { } from "@angular/";
import { GridBox } from "../../../../common/crossword/gridBox";

import { EmptyGridService } from "./empty-grid.service";


@Component({
  selector: "app-mot-croise",
  templateUrl: "./mot-croise.component.html",
  styleUrls: ["./mot-croise.component.css"]
})
export class MotCroiseComponent implements OnInit {

  public constructor(private emptyGridService: EmptyGridService) {
    this.emptyGridService.emptyGridGet().subscribe((grid: GridBox[][]) => this.grid = grid);
    // this.newGrid();
  }

  public selectedGridBox: GridBox;


  private grid: GridBox[][];

  public ngOnInit(): void {

  }

  public onSelect(gridBox: GridBox): void {
    this.selectedGridBox = gridBox;
  }

}
