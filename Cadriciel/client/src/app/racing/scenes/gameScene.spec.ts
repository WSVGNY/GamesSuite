import { GameScene } from "./gameScene";
import { Vector3, Geometry, Mesh, MeshPhongMaterial } from "three";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { TestBed } from "@angular/core/testing";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track/track";

// tslint:disable:no-magic-numbers
describe("Game Scene", () => {

    let gameScene: GameScene;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
        gameScene = new GameScene(undefined);
    });

    it("should be created", () => {
        expect(gameScene).toBeTruthy();
    });

    it("should create a track Mesh from trackPoints", () => {
        const MOCK_TRACK: CommonCoordinate3D[] = [
            new CommonCoordinate3D(0, 0, 0),
            new CommonCoordinate3D(100, 0, 0),
            new CommonCoordinate3D(100, 0, 100),
            new CommonCoordinate3D(0, 0, 100),
        ];
        const track: Track = new Track("");
        track.vertices = MOCK_TRACK;
        const shape: TrackMesh = new TrackMesh(track);
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
        expect((shape.geometry as Geometry)["vertices"]).toEqual(EXPECTED_MOCK_TRACK);
    });

    it("on-track and off-track should be different meshes", () => {
        const MOCK_TRACK: CommonCoordinate3D[] = [
            new CommonCoordinate3D(0, 0, 0),
            new CommonCoordinate3D(100, 0, 0),
            new CommonCoordinate3D(100, 0, 100),
            new CommonCoordinate3D(0, 0, 100),
        ];
        const mockTrack: Track = new Track("");
        mockTrack.vertices = MOCK_TRACK;
        gameScene["_trackMesh"] = new TrackMesh(mockTrack);
        gameScene["addGround"]();
        const track: Mesh = gameScene.getObjectByName("track") as Mesh;
        const ground: Mesh = gameScene.getObjectByName("ground") as Mesh;
        expect((track.material as MeshPhongMaterial).map).not.toEqual((ground.material as MeshPhongMaterial).map);
    });
});
