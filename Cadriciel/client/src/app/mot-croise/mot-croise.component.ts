import { Component, OnInit } from '@angular/core';
import {} from '@angular/';
import {GridBox} from "./gridBox";

import { EmptyGridService } from "./empty-grid.service";
import { Message } from "../../../../common/communication/message";


@Component({
  selector: 'app-mot-croise',
  templateUrl: './mot-croise.component.html',
  styleUrls: ['./mot-croise.component.css']
})
export class MotCroiseComponent implements OnInit {

  constructor(private emptyGridService  : EmptyGridService) { }
  public message: string;
  public message2: string;
  public selectedGridBox: GridBox;
  //private grid: 

  ngOnInit() {
    this.emptyGridService.emptyGridGet().subscribe((message: Message) => this.message = message.title + message.body);
    this.newGrid();
    this.message2 = this.emptyGridService.testString();
  }

  public newGrid(): void{
    this.emptyGridService.emptyGridCreate();
  }

  onSelect(gridBox: GridBox): void {
    this.selectedGridBox = gridBox;
  }

}
