import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";
import { /*TrackPoint,*/ TrackPointList } from "./trackPoint";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
// import { Object3D } from "three";
import assert = require("assert");
import { Object3D, Mesh, Vector3, Geometry, Scene, Group } from "three";

describe("RenderService", () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("should add an object to group", inject([RenderService], (renderService: RenderService) => {
        const object: Object3D = new Object3D();
        object.name = "testObject";
        renderService.addObjectToScene(object);
        expect(renderService["_group"].getChildByName("testObject")).toBeDefined();
    }));

    it("should create a track Mesh from trackPoints", inject([RenderService], (renderService: RenderService) => {
        const MOCK_TRACK: Vector3[] = [
            new Vector3(0, 0, 0),
            new Vector3(100, 0, 0),
            new Vector3(100, 0, 100),
            new Vector3(0, 0, 100),
        ];
        const points: TrackPointList = new TrackPointList(MOCK_TRACK);
        const shape: Mesh = renderService.createTrackMesh(points);
        const EXPECTED_MOCK_TRACK: Vector3[] = [
            new Vector3(-10, -10, 0),
            new Vector3(-10, 110, 0),
            new Vector3(110, 110, 0),
            new Vector3(110, -10, 0),
            new Vector3(10, 10, 0),
            new Vector3(90, 10, 0),
            new Vector3(90, 90, 0),
            new Vector3(10, 90, 0),
        ];
        expect((shape.geometry as Geometry )["vertices"]).toEqual(EXPECTED_MOCK_TRACK);
    }));

    it("should reset the scene to a blank state", inject([RenderService], (renderService: RenderService) => {
        const mockGroup: Group = new Group();
        const mockObject: Object3D = new Object3D();
        const mockScene: Scene = new Scene();

        mockObject.name = "mockObject";
        mockGroup.add(mockObject);
        mockScene.add(mockGroup);
        renderService["_scene"] = mockScene;
        renderService["_group"] = mockGroup;

        renderService.resetScene();

        expect(renderService["_group"].getChildByName("mockObject")).toBeUndefined();
    }));

});
