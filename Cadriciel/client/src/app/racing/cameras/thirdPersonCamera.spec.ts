// tslint:disable:no-magic-numbers
import { ThirdPersonCamera } from "./thirdPersonCamera";
import { PerspectiveCamera, Vector3 } from "three";
import { TestBed } from "@angular/core/testing";
import { AICar } from "../car/aiCar";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";
import { InputNameService } from "../scoreboard/input-name/input-name.service";

describe("Third Person Camera Test", () => {

    const ASPECTRATIO: number = 1;
    const INITIAL_CAMERA_POSITION_Z: number = 5;
    const INITIAL_CAMERA_POSITION_Y: number = 2.5;
    const EXPECTED_ANGLE: number = Math.tanh(INITIAL_CAMERA_POSITION_Y / INITIAL_CAMERA_POSITION_Z);

    let camera: ThirdPersonCamera;
    let car: AICar;
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventService, InputNameService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
        camera = new ThirdPersonCamera(ASPECTRATIO);
        car = new AICar(0);
        await car.init(new Vector3(0, 0, 0), 0);
        car.attachCamera(camera);
        done();
    });

    it("the camera created should be perspective camera", () => {
        expect(camera).toEqual(jasmine.any(PerspectiveCamera));
    });

    it("camera position x shouldn't change if we move an object that it is attached to", () => {
        car.setCurrentPosition(new Vector3(1, 0, 0));
        expect(camera.position.x).toEqual(0);
    });

    it("camera position y shouldn't change if we move an object that it is attached to", () => {
        car.setCurrentPosition(new Vector3(0, 1, 0));
        expect(camera.position.y).toEqual(INITIAL_CAMERA_POSITION_Y);
    });

    it("camera position z shouldn't change if we move an object that it is attached to", () => {
        car.setCurrentPosition(new Vector3(0, 0, 1));
        expect(camera.position.z).toEqual(INITIAL_CAMERA_POSITION_Z);
    });

    it("camera position vector3 shouldn t change if the object it is attached to move", () => {
        car.setCurrentPosition(new Vector3(12, 23, 34));
        expect(camera.position).toEqual(new Vector3(0, INITIAL_CAMERA_POSITION_Y, INITIAL_CAMERA_POSITION_Z));
    });

    it("camera should be in the right angle", () => {
        car.setCurrentPosition(new Vector3(2, 0, 1));
        const angleCarToCamera: number = camera.position.clone().normalize().angleTo(car.direction.clone().negate());
        expect(Math.abs(angleCarToCamera - EXPECTED_ANGLE)).toBeLessThan(0.01);
    });

});
