import { Component, OnInit } from '@angular/core';
import { } from '@angular/';
import { GridBox } from "./gridBox";

import { EmptyGridService } from "./empty-grid.service";
import { Message } from "../../../../common/communication/message";


@Component({
  selector: 'app-mot-croise',
  templateUrl: './mot-croise.component.html',
  styleUrls: ['./mot-croise.component.css']
})
export class MotCroiseComponent implements OnInit {

  constructor(private emptyGridService: EmptyGridService) {
    this.newGrid();
   }
   
  public message: string;
  public message2: string;
  public selectedGridBox: GridBox;

  private readonly TailleGridX = 10;
  private readonly TailleGridY = 10;

  public grid: GridBox[][];

  ngOnInit() {
    this.emptyGridService.emptyGridGet().subscribe((message: Message) => this.message = message.title + message.body);
    this.message2 = this.emptyGridService.testString();
  }

  public newGrid(): void {
    //this.emptyGridService.emptyGridCreate();
    this.grid = new Array<Array<GridBox>>();

    for(let i=0; i<this.TailleGridY; i++){
      let row:GridBox[] = new Array<GridBox>();

      for(let j=0; j<this.TailleGridX; j++){
        row.push(new GridBox(this.provideUniqueID(), j%2 ? true:false));
      }
      this.grid.push(row);
    }
  }

  private idCounter: 0;
  public provideUniqueID(): number{
    return this.idCounter++;
  }

  onSelect(gridBox: GridBox): void {
    this.selectedGridBox = gridBox;
  }

}
