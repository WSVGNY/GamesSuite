// tslint:disable:no-magic-numbers

import { ThirdPersonCamera } from "./thirdPersonCamera";
import { PerspectiveCamera, Object3D, Vector3 } from "three";

describe("Third Person Camera Test", () => {

    let camera: ThirdPersonCamera;
    const ASPECTRATIO: number = 1;
    const INITIAL_CAMERA_POSITION_Z: number = 10;
    const INITIAL_CAMERA_POSITION_Y: number = 5;

    beforeEach(() => {
        camera = new ThirdPersonCamera(ASPECTRATIO);
    });

    it("the camera created should be perspective camera", () => {
        expect(camera).toEqual(jasmine.any(PerspectiveCamera));
    });

    it("camera position x shouldn't change even if we move an object that it is attached to", () => {
        const object: Object3D = new Object3D();
        object.add(camera);
        object.position.x = 1;
        expect(camera.position.x).toEqual(0);
    });

    it("camera position y shouldn't change even if we move an object that it is attached to", () => {
        const object: Object3D = new Object3D();
        object.add(camera);
        object.position.y = 1;
        expect(camera.position.clone().y).toEqual(INITIAL_CAMERA_POSITION_Y);
    });

    it("camera position z shouldn't change even if we move an object that it is attached to", () => {
        const object: Object3D = new Object3D();
        object.add(camera);
        object.position.z = 1;
        expect(camera.position.z).toEqual(INITIAL_CAMERA_POSITION_Z);
    });

    it("camera position vector3 shouldn t change even if the object it is attached to move", () => {
        const object: Object3D = new Object3D();
        object.add(camera);
        object.position.set(12, 23, 5);
        expect(camera.position).toEqual(new Vector3(0, INITIAL_CAMERA_POSITION_Y, INITIAL_CAMERA_POSITION_Z));
    });
});
