import { TestBed, inject } from "@angular/core/testing";
import { RenderService } from "./render.service";
import { TrackPointList } from "./trackPoint";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
// import { Object3D } from "three";
import assert = require("assert");
import { Object3D, Mesh, Scene, PlaneGeometry, MeshPhongMaterial, BackSide, Vector3 } from "three";

describe("RenderService", () => {
    const render: RenderService = new RenderService();
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [RenderService]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));

    it("camera should be a child of _playerCar", inject([RenderService], (done: () => void) => {
        assert(false);
    }));

    it("should the 3D object to the scene", () => {
        const object: Object3D = new Object3D();
        object.name = "myObject";
        render.addObjectToScene(object);
        expect(render["_group"].getChildByName("myObject")).toBe(object);
    });

    it("should create a track Mesh from trackPoints", () => {
        const points: TrackPointList = new TrackPointList(new Array<CommonCoordinate3D>());
        const shape: Mesh = render.createTrackMesh(points);
        expect(shape).toBeTruthy(); // Not sure for this one. Like we want to know is shape is created.
    });

    it("should create a Shape(trackMesh) from trackPoints", () => {
        const points: TrackPointList = new TrackPointList(new Array<CommonCoordinate3D>());
        const shape: Mesh = render.createTrackMesh(points);
        expect(shape).toBeTruthy();
    });

    it("should create a Shape(trackMesh) from trackPoints", () => {
        const points: TrackPointList = new TrackPointList(new Array<CommonCoordinate3D>());
        const shape: Mesh = render.createTrackMesh(points);
        expect(shape).toBeTruthy();
    });

    it("should create a different track from the ground (OFF PISTE)", () => {
        const scene: Scene = new Scene();
        const groundGeometry: PlaneGeometry = new PlaneGeometry(10000, 10000, 1, 1);
        const groundMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, color: 0xFFFF00 });
        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        scene.add(ground);
        const points: CommonCoordinate3D[] = Array<CommonCoordinate3D>();
        const trackPoint1: Vector3 = new Vector3(0, 0, 0);
        const trackPoint2: Vector3 = new Vector3(1, 0, 0);
        const trackPoint3: Vector3 = new Vector3(0, 0, 1);
        points.push(trackPoint3);
        points.push(trackPoint2);
        points.push(trackPoint1);
        const trackList: TrackPointList = new TrackPointList(points);
        const track: Mesh = render.createTrackMesh(trackList);
        scene.add(track);
        expect(track).not.toEqual(ground);
    });

});
