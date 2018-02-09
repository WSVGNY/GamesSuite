import { Scene, AmbientLight } from "three";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

export class EditorScene {

    private scene: Scene;

    public constructor() {
        this.scene = new Scene();
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    public get $scene(): Scene {
        return this.scene;
    }
}
