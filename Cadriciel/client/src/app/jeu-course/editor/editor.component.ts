import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Piste }         from '../../../../../common/pistes/piste';
import { PistesService }  from '../pistes-service/pistes.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() piste: Piste;

  constructor(
    private route: ActivatedRoute,
    private pistesService: PistesService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getPiste();
  }

  getPiste(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.pistesService.getPisteParID(id)
      .subscribe(piste => this.piste = piste);
  }

  goBack(): void {
    this.location.back();
  }
}
