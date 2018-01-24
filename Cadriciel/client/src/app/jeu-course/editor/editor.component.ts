import { AfterViewInit, ElementRef, ViewChild, HostListener } from "@angular/core";
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Piste }         from '../../../../../common/pistes/piste';
import { PistesService }  from '../pistes-service/pistes.service';
import { EditorRenderService } from "../editor-render-service/editor-render.service";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  @Input() piste: Piste;

  public constructor(
    private route: ActivatedRoute,
    private pistesService: PistesService,
    private location: Location,
    private editorRenderService: EditorRenderService
  ) { }

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


  @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.editorRenderService.handleMouseDown(event);
    }

}
