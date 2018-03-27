// tslint:disable:no-magic-numbers
import { TopViewCamera } from "./topViewCamera";
import { OrthographicCamera, Vector3, Euler } from "three";
import { Car } from "../car/car";

const INITIAL_CAMERA_POSITION_Y: number = 10;
const PI_OVER_2: number = 1.5707963267948963;

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

    it("camera shouldn't  rotate", () => {
        car["_mesh"].position.set(2, 0, 1);
        camera.updatePosition(car);
        const angle: Euler = new Euler( -PI_OVER_2, 0, -PI_OVER_2);
        expect(camera.getWorldRotation()).toEqual(angle);
    });
});
