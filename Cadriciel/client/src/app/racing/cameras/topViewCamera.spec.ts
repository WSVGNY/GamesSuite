// tslint:disable:no-magic-numbers
import { TopViewCamera } from "./topViewCamera";
import { OrthographicCamera, Vector3 } from "three";
import { Car } from "../car/car";
// import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
// import { Engine } from "../car/engine";
// import { TestBed } from "@angular/core/testing";
const INITIAL_CAMERA_POSITION_Y: number = 10;

describe("Top View Camera Test", () => {

    const camera: TopViewCamera = new TopViewCamera(1);
    let car: Car;
    beforeEach(async (done: () => void) => {
        car = new Car(undefined, true);
        await car.init(new Vector3(0, 0, 0), Math.PI);
        done();
    });

    it("the camera created should be orthographic camera", () => {
        expect(camera).toEqual(jasmine.any(OrthographicCamera));
    });

    it("camera position x should change if we move the car that it is attached to in the same direction", () => {
        car["_mesh"].position.x = 6;
        camera.updatePosition(car);
        expect(camera.position.x).toEqual(6);
    });

    it("camera position y should change if we move the car that it is attached to in the same direction", () => {
        car["_mesh"].position.y = 8;
        camera.updatePosition(car);
        expect(camera.position.y).toEqual(INITIAL_CAMERA_POSITION_Y);
    });

    it("camera position z shoul change if we move the car that it is attached to in the same direction", () => {
        car["_mesh"].position.z = 13;
        camera.updatePosition(car);
        expect(camera.position.z).toEqual(13);
    });

    it("camera position vector3 should change if the object it is attached to move", () => {
        car["_mesh"].position.set(10, 23, 5);
        camera.updatePosition(car);
        expect(camera.position).toEqual(new Vector3(10, INITIAL_CAMERA_POSITION_Y, 5));
    });
});
