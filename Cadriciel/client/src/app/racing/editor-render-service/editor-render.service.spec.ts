import { TestBed, inject } from "@angular/core/testing";

import { EditorRenderService } from "./editor-render.service";
import { TrackVertices } from "../trackVertices";
import {  Scene, Vector3 } from "three";

describe("EditorRenderService", () => {
  let result: boolean = false;
  const vector2: Vector3 = new Vector3( 3, 1, 0 );
  const vector3: Vector3 = new Vector3( 2, -1, 0 );
  // const expectedName: String = "vertex0";
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorRenderService]
    });
    const scene: Scene = new Scene();
    const trackVerticies: TrackVertices = new TrackVertices(scene);
  });

  it("should be created", inject([EditorRenderService], (service: EditorRenderService) => {
    expect(service).toBeTruthy();
  }));

  it("should add a point in the scene", ()  => {
    listOfPoints.addVertex(new Vector3( 0, 0, 0 ));
    result = scene.getChildByName("vertex0") !== null;
    expect(result).toBeTruthy();
  });

  it("should add a second point on the scene when the clic is in the scene and create a connection between them", ()  => {
    listOfPoints.addVertex(vector2);
    result = scene.getChildByName("vertex1").name === "vertex1" && scene.getChildByName("connection1").name === "connection1";
    expect(result).toBeTruthy();
  });

  it("should remove a point from the list of points and the connection assiciated this it", () => {
    listOfPoints.removeLastVertex();
    result = scene.getChildByName("vertex1").name === "vertex1" || scene.getChildByName("connection1").name === "connexion1" ;
    expect(result).toBeFalsy();
  });

  it("should  a second and a third point plus the connextion between them", () => {
    listOfPoints.addVertex(vector2);
    listOfPoints.addVertex(vector3);
    result = scene.getChildByName("vertex1").name === "vertex1"
    && scene.getChildByName("vertex2").name === "vertex2"
    && scene.getChildByName("connection1").name === "connexion1"
    && scene.getChildByName("connection2").name === "connexion2";
    expect(result).toBeTruthy();
  });

  it("should  loop the track when we add a point on the start Point ", () => {
    listOfPoints.addVertex(vector1);
    result = listOfPoints.$isComplete();
    expect(result).toBeTruthy();
  });
});
