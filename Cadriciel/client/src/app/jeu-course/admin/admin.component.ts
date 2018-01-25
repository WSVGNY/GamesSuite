import { Component, OnInit } from "@angular/core";
import { Piste } from "../../../../../common/pistes/piste";
import { PistesService } from "../pistes-service/pistes.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  public pistes: Piste[];

  public constructor(private pisteService: PistesService) { }

  public ngOnInit(): void {
    this.getPistes();
  }

  public getPistes(): void {
    this.pisteService.getListePiste()
    .subscribe((pistes) => this.pistes = pistes);
  }
}
