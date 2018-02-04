import { TestBed, inject } from "@angular/core/testing";

import { EditorRenderService } from "./editor-render.service";
import { TrackVertices } from "../trackVertices";
import {  Scene, Vector3 } from "three";

describe("EditorRenderService", () => {
  let result: boolean = false;
  const scene: Scene = new Scene();
  const renderer: EditorRenderService = new EditorRenderService();
  const vector1: Vector3 = new Vector3( 0, 0, 0 );
  const vector2: Vector3 = new Vector3( 3, 1, 0 );
  const vector3: Vector3 = new Vector3( 2, -1, 0 );
  // const expectedName: String = "vertex0";
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorRenderService]
    });
  });

  it("should be created", inject([EditorRenderService], (service: EditorRenderService) => {
    expect(service).toBeTruthy();
  }));

  /*it("should add a point in the scene", ()  => {
    listOfPoints.addVertex(new Vector3( 0, 0, 0 ));
    result = scene.getChildByName("vertex0") !== null;
    expect(result).toBeTruthy();
  });*/

  it("should change mouse coordinates", ()  => {
    // const mouseEvent = document.createEvent("MouseEvents");
    event = new MouseEvent("mousedown", {
      "view": window,
      "bubbles": true,
      "cancelable": true,
      "screenX": 0,
      "screenY": 2
    });
    expect(renderer.computeMouseCoordinates).toBeTruthy();
  });

  it("should not change mouse coordinates", ()  => {
    // const mouseEvent = document.createEvent("MouseEvents");
    event = new MouseEvent("mousedown", {
      "view": window,
      "bubbles": true,
      "cancelable": true,
      "screenX": 999,
      "screenY": 666
    });
    expect(renderer.computeMouseCoordinates).toBeFalsy();
  });

  


});
