import { Object3D, ObjectLoader, Mesh, Vector3 } from "three";
import { TEAPOT_TEXTURE } from "../constants/texture.constants";
import { PI_OVER_2, PI_OVER_4 } from "../constants/math.constants";

export class Teapot extends Mesh {
    public static async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(TEAPOT_TEXTURE, (object: Object3D) => {
                // object.rotateOnAxis(new Vector3(0, 1, 0), PI_OVER_4);
                object.scale.set(0.1, 0.1, 0.1);
                object.translateY(1);
                resolve(object);
            });
        });
    }
}
