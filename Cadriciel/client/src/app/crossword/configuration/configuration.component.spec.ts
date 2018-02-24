import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AppModule } from "../../app.module";
import { ConfigurationComponent } from "./configuration.component";
import assert = require("assert");

describe("ConfigurationComponent", () => {
  let component: ConfigurationComponent;
  let fixture: ComponentFixture<ConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ ConfigurationComponent ]
    })
    .compileComponents()
    .then()
    .catch((e: Error) => console.error(e.message));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("When the user chose 'new game' he is asked to choose the number of players", () => {
    assert(true);
  });

  it("When the user chose the number of players he is asked to choose the difficulty", () => {
    assert(true);
  });

  it("When the user chose the difficulty he is asked to enter his name", () => {
    assert(true);
  });

  it("When the user chose the difficulty the grid starts to load", () => {
    assert(true);
});

  it("When the user submit his name, the game configuration is over", () => {
    assert(true);
});

  describe("tests for the difficulty", () => {
  it("if the difficulty chosen is easy, the returned grid is easy", () => {
       assert(true);
  });

  it("if the difficulty chosen is medium, the returned grid is medium", () => {
      assert(true);
  });

  it("if the difficulty chosen is hard, the returned grid is hard", () => {
      assert(true);
  });
});

});
