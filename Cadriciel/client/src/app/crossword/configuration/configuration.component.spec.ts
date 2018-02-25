import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationComponent } from "./configuration.component";
import assert = require("assert");
import { GridService } from "../grid.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { ConfigurationService } from "../configuration.service";

describe("ConfigurationComponent", () => {
  let component: ConfigurationComponent;
  let fixture: ComponentFixture<ConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationComponent],
      providers: [
        GridService,
        HttpClient,
        HttpHandler,
        ConfigurationService
      ]
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
    assert(false);
  });

  it("When the user chose the number of players he is asked to choose the difficulty", () => {
    assert(false);
  });

  it("When the user chose the difficulty he is asked to enter his name", () => {
    assert(false);
  });

  it("When the user chose the difficulty the grid starts to load", () => {
    assert(false);
  });

  it("When the user submit his name, the game configuration is over", () => {
    assert(false);
  });

  describe("tests for the difficulty", () => {
    it("if the difficulty chosen is easy, the returned grid is easy", () => {
      assert(false);
    });

    it("if the difficulty chosen is medium, the returned grid is medium", () => {
      assert(false);
    });

    it("if the difficulty chosen is hard, the returned grid is hard", () => {
      assert(false);
    });
  });

});
