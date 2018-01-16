import { Component, OnInit } from '@angular/core';

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

  ngOnInit() {
    this.emptyGridService.emptyGridGet().subscribe((message: Message) => this.message = message.title + message.body);
  }

}
