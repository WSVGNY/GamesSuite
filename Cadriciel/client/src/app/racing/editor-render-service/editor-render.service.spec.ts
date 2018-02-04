import { TestBed, inject } from "@angular/core/testing";

import { EditorRenderService } from "./editor-render.service";
import { TrackVertices } from "../trackVertices";
import {  Scene, Vector3 } from "three";

describe("EditorRenderService", () => {
  let result: boolean = false;
  const scene: Scene = new Scene();
  const listOfPoints: TrackVertices = new TrackVertices(scene);
<<<<<<< HEAD
  const vector1: Vector3 = new Vector3( 0, 0, 0 );
=======
>>>>>>> cc8bc44a5e39083acd11814e04b1f3f0ef3f186c
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

<<<<<<< HEAD
  it("should add a point in the scene.", ()  => {
    listOfPoints.addVertex(vector1);
=======
  it("should add a point in the scene", ()  => {
    listOfPoints.addVertex(new Vector3( 0, 0, 0 ));
>>>>>>> cc8bc44a5e39083acd11814e04b1f3f0ef3f186c
    result = scene.getChildByName("vertex0") !== null;
    expect(result).toBeTruthy();
  });

  it("should add a second point on the scene when the clic is in the scene and create a connection between them", ()  => {
    listOfPoints.addVertex(vector1);
    listOfPoints.addVertex(vector2);
    result = scene.getChildByName("vertex1") !== null && scene.getChildByName("connection1") !== null;
    expect(result).toBeTruthy();
  });

  it("should add two points in the track and remove the last point from the list of points and the connection assiciated this it", () => {
    listOfPoints.addVertex(vector1);
    listOfPoints.addVertex(vector2);
    listOfPoints.removeLastVertex();
    result = scene.getChildByName("vertex1") !== null || scene.getChildByName("connection1") !== null;
    expect(result).toBeFalsy();
  });

  it("should add a first, a second and a third point plus the connextion between them", () => {
    listOfPoints.addVertex(vector1);
    listOfPoints.addVertex(vector2);
    listOfPoints.addVertex(vector3);
    result = scene.getChildByName("vertex0") !== null
    && scene.getChildByName("vertex1") !== null
    && scene.getChildByName("vertex2") !== null
    && scene.getChildByName("connection1") !== null
    && scene.getChildByName("connection2").name !== null;
    expect(result).toBeTruthy();
  });

  it("should add 3 three points and loop the track when we add a new point on the start (first) Point ", () => {
    listOfPoints.addVertex(vector1);
    listOfPoints.addVertex(vector2);
    listOfPoints.addVertex(vector3);
    listOfPoints.addVertex(vector1);
    result = listOfPoints.$isComplete();
    expect(result).toBeTruthy();
  });
});
