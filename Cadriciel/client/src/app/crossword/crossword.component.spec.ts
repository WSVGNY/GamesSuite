import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CrosswordComponent } from "./crossword.component";
import {GridService} from "./grid.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";

describe("CrosswordComponent", () => {
  let component: CrosswordComponent;
  let fixture: ComponentFixture<CrosswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordComponent ],
      imports: [HttpClientModule],
      providers: [GridService,
                  HttpClient]
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
