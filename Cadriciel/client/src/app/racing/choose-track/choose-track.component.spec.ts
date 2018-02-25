import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChooseTrackComponent } from "./choose-track.component";

describe("ChooseTrackComponent", () => {
  let component: ChooseTrackComponent;
  let fixture: ComponentFixture<ChooseTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
