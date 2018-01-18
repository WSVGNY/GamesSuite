import { Component, OnInit } from '@angular/core';
import { Piste } from '../../../../../common/pistes/piste';
import { PistesService } from '../pistes-service/pistes.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  pistes: Piste[];

  constructor(private pisteService: PistesService) { }

  ngOnInit() {
    this.getPistes();
  }

  getPistes(): void {
    this.pisteService.listePisteGet()
    .subscribe(pistes => this.pistes = pistes);
  }
}
