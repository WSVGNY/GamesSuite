import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordComponent } from "./crossword.component";
//import { AppModule } from "../app.module";
import {EmptyGridService} from "./empty-grid.service";
import { HttpClientModule } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";

describe("CrosswordComponent", () => {
  let component: CrosswordComponent;
  let fixture: ComponentFixture<CrosswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordComponent ],
      imports: [HttpClientModule],
      providers: [EmptyGridService,
                  HttpClient,
                  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
