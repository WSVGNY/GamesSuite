import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BestTimesComponent } from "./best-times.component";

describe("BestTimesComponent", () => {
  let component: BestTimesComponent;
  let fixture: ComponentFixture<BestTimesComponent>;

  beforeEach(async((done: () => void) => {
    TestBed.configureTestingModule({
      declarations: [BestTimesComponent]
    })
      .compileComponents()
      .then()
      .catch((e: Error) => console.error(e.message));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
