import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, Mesh, Shape, ShapeGeometry, Path, BackSide, TextureLoader, Texture, RepeatWrapping,
    PlaneGeometry, MeshLambertMaterial, DirectionalLight, DirectionalLightHelper, AmbientLight, Group, Object3D, CubeTexture,
    CubeTextureLoader
} from "three";
<<<<<<< HEAD
import { PI_OVER_2, LOWER_GROUND, WHITE, GROUND_SIZE, GROUND_TEXTURE_FACTOR } from "../constants";
=======
import { PI_OVER_2, LOWER_GROUND, ASPHALT_TEXTURE, GRASS_TEXTURE } from "../constants";
>>>>>>> 055c631d8b8a9c438672fae490d584fcac5915b6
import { TrackPointList } from "./trackPoint";


const AMBIENT_LIGHT_OPACITY: number = 0.1;

@Injectable()
export class RenderService {
    private _container: HTMLDivElement;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _stats: Stats;
    private _group: Group = new Group();
    private _camera: PerspectiveCamera;
    private _skyBoxTexture: CubeTexture;

    public constructor() {
    }

    public async initialize(container: HTMLDivElement, camera: PerspectiveCamera): Promise<void> {
        this._container = container;
        this._camera = camera;
        this._scene = new Scene();
        this._scene.background = this._skyBoxTexture;
        this._scene.add(this._group);
        await this.createScene();
        this.initStats();
    }

    private initStats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
    }

    public addObjectToScene(object: Object3D): void {
        this._group.add(object);
    }

    private async createScene(): Promise<void> {
        this.lighting();
        this.renderGround();
    }

    public lighting(): void {

        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        const dirLight: DirectionalLight = new DirectionalLight(WHITE, 0.8);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 0.8, 1);
        dirLight.position.multiplyScalar(30);
        this._scene.add(dirLight);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        const d: number = 50;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = -0.0001;
        const dirLightHeper: DirectionalLightHelper = new DirectionalLightHelper(dirLight, 10);
        this._scene.add(dirLightHeper);
    }

    public setupRenderer(): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);

        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    public render(): void {
        this._renderer.render(this._scene, this._camera);
        this._stats.update();
    }

    public onResize(): void {
        this._camera.aspect = this.getAspectRatio();
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    public getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
    }

    public createTrackMesh(trackPoints: TrackPointList): Mesh {
        const shape: Shape = new Shape();
        this.createTrackExterior(shape, trackPoints);
        this.drillHoleInTrackShape(shape, trackPoints);

        const geometry: ShapeGeometry = new ShapeGeometry(shape);
        const trackMaterial: MeshLambertMaterial =
<<<<<<< HEAD
            new MeshLambertMaterial({
                side: BackSide, map: this.loadRepeatingTexture("assets/textures/asphalte.jpg", GROUND_TEXTURE_FACTOR)
            });
=======
            new MeshLambertMaterial({ side: BackSide, map: this.loadRepeatingTexture(ASPHALT_TEXTURE, 0.045) });
>>>>>>> 055c631d8b8a9c438672fae490d584fcac5915b6

        const trackMesh: Mesh = new Mesh(geometry, trackMaterial);
        trackMesh.rotateX(PI_OVER_2);

        return trackMesh;
    }

    private createTrackExterior(trackShape: Shape, trackPoints: TrackPointList): void {
        trackShape.moveTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
        for (let i: number = 1; i < trackPoints.length; ++i) {
            trackShape.lineTo(trackPoints.points[i].exterior.x, trackPoints.points[i].exterior.z);
        }
        trackShape.lineTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
    }

    private drillHoleInTrackShape(trackShape: Shape, trackPoints: TrackPointList): void {
        const holePath: Path = new Path();
        holePath.moveTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        for (let i: number = trackPoints.length - 1; i > 0; --i) {
            holePath.lineTo(trackPoints.points[i].interior.x, trackPoints.points[i].interior.z);
        }
        holePath.lineTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        trackShape.holes.push(holePath);
    }

    private renderGround(): void {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
        const groundMaterial: MeshLambertMaterial =
            new MeshLambertMaterial({ side: BackSide, map: this.loadRepeatingTexture(GRASS_TEXTURE, 1000) });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        this._scene.add(ground);
    }

    private loadRepeatingTexture(pathToImage: string, imageRatio: number): Texture {
        const texture: Texture = new TextureLoader().load(pathToImage);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(imageRatio, imageRatio);

        return texture;
    }

    public loadSkyBox(pathToImages: string): void {
        this._skyBoxTexture = new CubeTextureLoader()
            .setPath(pathToImages)
            .load([
                "px.jpg",
                "nx.jpg",
                "py.jpg",
                "ny.jpg",
                "pz.jpg",
                "nz.jpg"
            ]);

        if (this._scene !== undefined) {
            this._scene.background = this._skyBoxTexture;
        }
    }

    public addDebugObject(object: Object3D): void {
        this._group.add(object);
    }

    public removeDebugObject(object: Object3D): void {
        this._group.remove(object);
    }
}
