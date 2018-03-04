import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, Mesh, Shape, ShapeGeometry, Path, BackSide, TextureLoader, Texture, RepeatWrapping,
    PlaneGeometry, Group, Object3D, CubeTexture,
    CubeTextureLoader,
    MeshPhongMaterial,
    PositionalAudio
} from "three";
import { PI_OVER_2, LOWER_GROUND, GROUND_SIZE, GROUND_TEXTURE_FACTOR, ASPHALT_TEXTURE, GRASS_TEXTURE, MS_TO_SECONDS } from "../constants";
import { TrackPointList } from "./trackPoint";

@Injectable()
export class RenderService {
    private _container: HTMLDivElement;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _stats: Stats;
    private _group: Group = new Group();
    private _camera: PerspectiveCamera;
    private _skyBoxTexture: CubeTexture;

    public constructor() { }

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
        this.renderGround();
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
        const trackMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(ASPHALT_TEXTURE, GROUND_TEXTURE_FACTOR) });

        const trackMesh: Mesh = new Mesh(geometry, trackMaterial);
        trackMesh.rotateX(PI_OVER_2);
        trackMesh.name = "track";

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
        const groundMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(GRASS_TEXTURE, MS_TO_SECONDS) });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        ground.name = "ground";
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

    public async resetScene(): Promise<void> {
        this._group = new Group();
        this._scene = new Scene();
        this._scene.background = this._skyBoxTexture;
        this._scene.add(this._group);
        await this.createScene();
    }
}
