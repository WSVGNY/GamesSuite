import { TestBed, inject } from "@angular/core/testing";
import { EditorRenderService/*, Action */ } from "./editor-render.service";
// import { TrackVertices, VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL } from "../trackVertices";
import { Scene/*, Vector3, Mesh, Raycaster*/ } from "three";

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

    // it("should execute the operation ADD_VERTEX", () => {
    //     renderer["trackVertices"] = new TrackVertices(scene);
    //     // renderer["listOfPoints"]["vertices"].pop();
    //     const result: Action = renderer["computeLeftClickAction"]();
    //     expect(result).toEqual(Action.ADD_POINT);
    // });

    // it("should execute the operation SET_SELECTED_VERTEX", () => {
    //     renderer["trackVertices"] = new TrackVertices(scene);
    //     const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    //     // vertex.position = new Vector3(1, 0, 0);
    //     renderer["trackVertices"]["vertices"].push(vertex);
    //     scene.add(vertex);
    //     const ray: Raycaster = new Raycaster(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
    //     renderer["raycaster"] = ray;
    //     const result: Action = renderer["computeLeftClickAction"]();
    //     expect(result).toEqual(Action.SET_SELECTED_VERTEX);
    // });

    // it("should execute the operation complete loop", () => {
    //     const vx: number = 2;
    //     const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    //     vertex1.position = new Vector3(0, 1, 0);
    //     const vertex2: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    //     vertex1.position = new Vector3(1, 1, 0);
    //     const vertex3: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
    //     vertex1.position = new Vector3(vx, 1, 0);
    //     scene.add(vertex1);
    //     scene.add(vertex2);
    //     scene.add(vertex3);
    //     renderer["mouseVector"] = new Vector3(vx, 1, 0); // à modifier
    //     renderer["trackVertices"] = new TrackVertices(scene);
    //     const result: Action = renderer["computeLeftClickAction"]();
    //     expect(result).toEqual(Action.COMPLETE_LOOP);
    // });

    // it("should execute the operation none", () => {
    //     const vx: number = 856;
    //     const vy: number = 999;
    //     renderer["mouseVector"] = new Vector3(vx, vy, 0); // à modifier
    //     renderer["trackVertices"] = new TrackVertices(scene);
    //     const result: Action = renderer["computeLeftClickAction"]();
    //     expect(result).toEqual(Action.NONE);
    // });

});
