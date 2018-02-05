import { TestBed, inject } from "@angular/core/testing";
import { EditorRenderService } from "./editor-render.service";
import { TrackVertices, VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL } from "../trackVertices";
import {  Scene, Vector3, Mesh } from "three";

describe("EditorRenderService", () => {
  let scene: Scene;
  let renderer: EditorRenderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorRenderService]
    });
    scene = new Scene();
    renderer = new EditorRenderService();
  });

  it("should be created", inject([EditorRenderService], (service: EditorRenderService) => {
    expect(service).toBeTruthy();
  }));

  it("should execute the operation ADD_VERTEX", ()  => {
    renderer["listOfPoints"] = new TrackVertices(scene);
    const result: Action = renderer["computeLeftClickAction"]();
    expect( result === Action.ADD_POINT).toBeTruthy();
  });

  it("should execute the operation SET_SELECTED_VERTEX", ()  => {
    const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    vertex.position = new Vector3(0, 0, 0);
    scene.add(vertex);
    const trackVertices: TrackVertices = new TrackVertices(scene);
    const vertices: Array<Mesh> = new Array<Mesh>();
    vertices.push(vertex);
    trackVertices["vertices"] = vertices;
    renderer["listOfPoints"] = trackVertices;
    renderer["raycaster"].set(new Vector3(0, 0, 1), new Vector3(0, 0, -1));
    expect(renderer["computeLeftClickAction"]()).toBe(Action.SET_SELECTED_VERTEX);
  });
/*
  it("should execute the operation complete loop", ()  => {
    const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    vertex1.position = new Vector3(0, 1, 0);
    const vertex2: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    vertex1.position = new Vector3(1, 1, 0);
    const vertex3: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    vertex1.position = new Vector3(2, 1, 0);
    scene.add(vertex1);
    scene.add(vertex2);
    scene.add(vertex3);
    renderer["mouseVector"] = new Vector3(2, 1, 0); // à modifier
    renderer["listOfPoints"] = new TrackVertices(scene);
    expect(renderer["computeLeftClickAction"]()).toBe(Action.COMPLETE_LOOP);
  });

  it("should execute the operation none", ()  => {
    renderer["mouseVector"] = new Vector3(856, 999, 0); // à modifier
    renderer["listOfPoints"] = new TrackVertices(scene);
    expect(renderer["computeLeftClickAction"]()).toBe(Action.NONE);
  });
  */
});
