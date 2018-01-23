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

  private readonly sizeGridX = 10;
  private readonly sizeGridY = 10;
  private readonly numberOfTiles = this.sizeGridX * this.sizeGridY;
  private readonly BlackTilesRatio = 0.25 * this.numberOfTiles;

  public grid: GridBox[][];

  ngOnInit() {
    this.emptyGridService.emptyGridGet().subscribe((message: Message) => this.message = message.title + message.body);
    this.message2 = this.emptyGridService.testString();
  }

  private newGrid(): void {
    //this.emptyGridService.emptyGridCreate();
    this.grid = new Array<Array<GridBox>>();

    for(let i=0; i<this.sizeGridY; i++){
      let row:GridBox[] = new Array<GridBox>();

      for(let j=0; j<this.sizeGridX; j++){
        row.push(new GridBox(this.provideUniqueTileID(), false));
      }
      this.grid.push(row);
    }
    this.placeBlackGridTiles();
  }

  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  private placeBlackGridTiles(): void {
    let array: number[] = [];
    for(let i = 0; i<this.numberOfTiles; i++)
      array[i] = i;
      
    for(let i=array.length -1; i>0; i--){
      let j = Math.floor(Math.random() * (i+1));
      [array[i], array[j]] = [array[j], array[i]];

    }

    for(let i=0; i<this.BlackTilesRatio; i++){
      let randomTileId = array[i];
      console.log(randomTileId);
      this.findMatchingTileById(randomTileId).black = true;
    }
  }
  
  private findMatchingTileById(id: number): GridBox{

    for(let i = 0; i < this.sizeGridY; i++)
      for(let j = 0; j < this.sizeGridX;j++ ){
        if(this.grid[i][j].id == id)
          return this.grid[i][j];
      }
    throw new Error("GridTile not found");
  }

  private tileIdCounter: number = 0;
  public provideUniqueTileID(): number{
    //console.log(this.tileIdCounter);
    return this.tileIdCounter++;
  }

  onSelect(gridBox: GridBox): void {
    this.selectedGridBox = gridBox;
  }

}
