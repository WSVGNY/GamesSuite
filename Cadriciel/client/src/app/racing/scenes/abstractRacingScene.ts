import { Scene, PlaneGeometry, MeshPhongMaterial, BackSide, Mesh, Texture, TextureLoader,
    RepeatWrapping, CubeTexture, CubeTextureLoader } from "three";
import {
    PI_OVER_2, LOWER_GROUND, GROUND_SIZE, GROUND_TEXTURE_FACTOR, GRASS_TEXTURE
} from "../constants";
import { TrackType } from "../../../../../common/racing/trackType";
import { SkyBox } from "../render-service/skybox";

export abstract class AbstractScene extends Scene {

    protected _skyBoxTextures: Map<TrackType, CubeTexture>;

    protected addGround(): void {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
        const groundMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(GRASS_TEXTURE, GROUND_TEXTURE_FACTOR) });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        ground.name = "ground";
        this.add(ground);
    }

    protected loadRepeatingTexture(pathToImage: string, imageRatio: number): Texture {
        const texture: Texture = new TextureLoader().load(pathToImage);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(imageRatio, imageRatio);

        return texture;
    }

    protected setSkyBox(trackType: TrackType): void {
        if (this._skyBoxTextures.get(trackType) === undefined) {
            this._skyBoxTextures.set(trackType, this.loadSkyBox(SkyBox.getPath(trackType)));
        }
        this.background = this._skyBoxTextures.get(trackType);
    }

    protected loadSkyBox(pathToImages: string): CubeTexture {
        return new CubeTextureLoader()
            .setPath(pathToImages)
            .load([
                "px.jpg",
                "nx.jpg",
                "py.jpg",
                "ny.jpg",
                "pz.jpg",
                "nz.jpg"
            ]);
    }

}
