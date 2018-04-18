import { GameScene } from "./gameScene";
import { Vector3, Geometry, Mesh, MeshPhongMaterial } from "three";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { TestBed } from "@angular/core/testing";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track/track";
import { DEFAULT_GROUND_NAME, DEFAULT_TRACK_NAME } from "../constants/scene.constants";
import { AbstractCar } from "../car/abstractCar";
import { AICar } from "../car/aiCar";

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
        gameScene.add(gameScene["_trackMesh"]);
        gameScene["addGround"]();
        const track: Mesh = gameScene.getObjectByName(DEFAULT_TRACK_NAME) as Mesh;
        const ground: Mesh = gameScene.getObjectByName(DEFAULT_GROUND_NAME) as Mesh;
        expect((track.material as MeshPhongMaterial).map).not.toEqual((ground.material as MeshPhongMaterial).map);
    });

    it("cars are shuffled on lineup", () => {
        const MOCK_CARS: AbstractCar[] = [];
        for (let i: number = 0; i < 100; i++) {
            MOCK_CARS.push(new AICar(i));
        }
        const EXPECTED_MOCK_CARS: AbstractCar[] = [];
        for (const element of MOCK_CARS) {
            EXPECTED_MOCK_CARS.push(element);
        }
        gameScene["shuffle"](MOCK_CARS);
        let success: boolean = false;
        for (let i: number = 0; i < 100; i++) {
            if (EXPECTED_MOCK_CARS[i] !== MOCK_CARS[i]) {
                success = true;
                break;
            }
        }

        expect(success).toEqual(true);
    });
});
