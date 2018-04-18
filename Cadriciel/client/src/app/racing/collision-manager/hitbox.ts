import { Vector3, Sphere, Matrix4 } from "three";

const FRONT_SPHERE_OFFSET: number = 0.75;
const REAR_SPHERE_OFFSET: number = -0.75;
const SPHERE_RADIUS: number = 0.75;
const SPHERE_QUANTITY: number = 2;

export class Hitbox {

    private _boundingSpheres: Sphere[];
    public inCollision: boolean;

    public constructor() {
        this.initialize();
        this.inCollision = false;
    }

    private initialize(): void {
        this._boundingSpheres = [];
        for (let i: number = 0; i < SPHERE_QUANTITY; ++i) {
            this._boundingSpheres.push(new Sphere());
        }
    }

    public updatePosition(carLocalPosition: Vector3, carMatrix: Matrix4): void {
        for (let i: number = 0; i < SPHERE_QUANTITY; ++i) {
            const localPosition: Vector3 = (i % 2 === 0) ?
                new Vector3(0, 0, FRONT_SPHERE_OFFSET) :
                new Vector3(0, 0, REAR_SPHERE_OFFSET);
            const globalPosition: Vector3 = localPosition.applyMatrix4(carMatrix);
            this._boundingSpheres[i].set(globalPosition, SPHERE_RADIUS);
        }
    }

    public get boundingSpheres(): Sphere[] {
        return this._boundingSpheres;
    }
}
