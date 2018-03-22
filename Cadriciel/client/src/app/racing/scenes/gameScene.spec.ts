// // tslint:disable:no-magic-numbers

// import { GameScene } from "./gameScene";
// import { Vector3, Mesh, Geometry } from "three";
// import { TrackPointList } from "../render-service/trackPointList";

// describe("Game Scene", () => {

//     let gameScene: GameScene;

//     beforeEach(() => {
//         gameScene = new GameScene();
//     });

//     it("should be created", () => {
//         expect(gameScene).toBeTruthy();
//     });

//     it("should create a track Mesh from trackPoints", () => {
//         const MOCK_TRACK: Vector3[] = [
//             new Vector3(0, 0, 0),
//             new Vector3(100, 0, 0),
//             new Vector3(100, 0, 100),
//             new Vector3(0, 0, 100),
//         ];
//         const points: TrackPointList = new TrackPointList(MOCK_TRACK);
//         const shape: Mesh = gameScene.createTrackMesh(points);
//         const EXPECTED_MOCK_TRACK: Vector3[] = [
//             new Vector3(-10, -10, 0),
//             new Vector3(-10, 110, 0),
//             new Vector3(110, 110, 0),
//             new Vector3(110, -10, 0),
//             new Vector3(10, 10, 0),
//             new Vector3(90, 10, 0),
//             new Vector3(90, 90, 0),
//             new Vector3(10, 90, 0),
//         ];
//         expect((shape.geometry as Geometry)["vertices"]).toEqual(EXPECTED_MOCK_TRACK);
//     });
// });
