import { TestBed, inject } from "@angular/core/testing";

import { EditorRenderService } from "./editor-render.service";
import { TrackVertices, VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL } from "../trackVertices";
import {  Scene, Vector3, Mesh } from "three";

describe("EditorRenderService", () => {
  const scene: Scene = new Scene();
  const renderer: EditorRenderService = new EditorRenderService();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditorRenderService]
    });
  });

  it("should be created", inject([EditorRenderService], (service: EditorRenderService) => {
    expect(service).toBeTruthy();
  }));

  it("should change mouse coordinates", ()  => {
    expect(renderer.computeMouseCoordinates(0, 1)).toBeTruthy();
  });

  it("should not change mouse coordinates", ()  => {
    expect(renderer.computeMouseCoordinates(10000, 256666)).toBeFalsy();
  });

  it("should execute the operation Add Vertex", ()  => {
    renderer["mouseVector"] = new Vector3(0, 1, 0);
    renderer["listOfPoints"] = new TrackVertices(scene);
    expect(renderer["computeLeftClickAction"]()).toBe(1);
  });

  it("should execute the operation set selected vertex", ()  => {
    const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    vertex1.position = new Vector3(0, 1, 0);
    scene.add(vertex1);
    renderer["mouseVector"] = new Vector3(0, 1, 0); // à modifier
    renderer["listOfPoints"] = new TrackVertices(scene);
    expect(renderer["computeLeftClickAction"]()).toBe(2);
  });

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
    expect(renderer["computeLeftClickAction"]()).toBe(3);
  });

  it("should execute the operation none", ()  => {
    renderer["mouseVector"] = new Vector3(856, 999, 0); // à modifier
    renderer["listOfPoints"] = new TrackVertices(scene);
    expect(renderer["computeLeftClickAction"]()).toBe(4);
  });

  it("should add a point to the scene", ()  => {
    const id: number = 1;
    expect(renderer.handleMouseDown(id, 2, 3)).toBe(0);
  });

  it("should remove the last point from the scene", ()  => {
    const id: number = 2;
    expect(renderer.handleMouseDown(id, 2, 3)).toBe(4);
  });

  it("should handle a point", ()  => {
    renderer["mouseVector"] = new Vector3(0, 1, 0); // à modifier
    renderer.handleMouseMove(2, 3);
    expect(renderer["isMouseDown"]).toBeFalsy();
  });

});
