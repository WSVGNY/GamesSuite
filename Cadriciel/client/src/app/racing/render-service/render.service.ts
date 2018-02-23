import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import {
    PerspectiveCamera, WebGLRenderer, Scene, Mesh, Shape, ShapeGeometry, Path, BackSide, TextureLoader, Texture, RepeatWrapping,
    PlaneGeometry, CubeTextureLoader, MeshLambertMaterial, DirectionalLight, DirectionalLightHelper, AmbientLight, Group, Object3D
} from "three";
import { PI_OVER_2, LOWER_GROUND } from "../constants";
import { TrackPointList } from "./trackPoint";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.1;

@Injectable()
export class RenderService {
    private _container: HTMLDivElement;
    private _renderer: WebGLRenderer;
    private _scene: Scene;
    private _stats: Stats;
    private _group: Group = new Group();
    private _camera: PerspectiveCamera;

    public constructor() {
    }

    public async initialize(container: HTMLDivElement, camera: PerspectiveCamera): Promise<void> {
        this._container = container;
        this._camera = camera;
        this._scene = new Scene();
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
        this.renderSkyBox();
    }

    public lighting(): void {

        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        const dirLight: DirectionalLight = new DirectionalLight(0xffffff, 0.8);
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
        const dirLightHeper: DirectionalLightHelper = new DirectionalLightHelper(dirLight, 10)
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
            new MeshLambertMaterial({ side: BackSide, map: this.loadRepeatingTexture("assets/textures/asphalte.jpg", 0.045) });

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

    // private renderCenterLine(): void {
    //     const geometryPoints: Geometry = new Geometry();
    //     this._trackPoints.points.forEach((currentPoint: TrackPoint) => geometryPoints.vertices.push(currentPoint.coordinates));
    //     geometryPoints.vertices.push(this._trackPoints.points[0].coordinates);
    //     const line: Line = new Line(geometryPoints, new LineBasicMaterial({ color: 0x00FF00, linewidth: 3 }));
    //     this._scene.add(line);
    // }

    private renderGround(): void {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(10000, 10000, 1, 1);
        const groundMaterial: MeshLambertMaterial =
            new MeshLambertMaterial({ side: BackSide, map: this.loadRepeatingTexture("assets/textures/green-grass-texture.jpg", 1000) });

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

    private async renderSkyBox(): Promise<void> {
        // if (this._dayTime === true) {
        this._scene.background = new CubeTextureLoader()
            .setPath("assets/textures/night/")
            .load([
                "night_px.jpg", // 'px.png',
                "night_nx.jpg", // 'nx.png',
                "night_py.jpg", // 'py.png',
                "night_ny.jpg", // 'ny.png',
                "night_pz.jpg", // 'pz.png',
                "night_nz.jpg"// 'nz.png'
            ]);
        // } else {
        //     this._scene.background = new CubeTextureLoader()
        //         // .setPath("assets/textures/Tropical/")
        //         // .load([
        //         //     "TropicalSunnyDay_px.jpg", // 'px.png',
        //         //     "TropicalSunnyDay_nx.jpg", // 'nx.png',
        //         //     "TropicalSunnyDay_py.jpg", // 'py.png',
        //         //     "TropicalSunnyDay_ny.jpg", // 'ny.png',
        //         //     "TropicalSunnyDay_pz.jpg", // 'pz.png',
        //         //     "TropicalSunnyDay_nz.jpg"// 'nz.png'
        //         // ]);
        //         .setPath("assets/textures/clouds/")
        //         .load([
        //             "CloudyLightRays_px.jpg", // 'px.png',
        //             "CloudyLightRays_nx.jpg", // 'nx.png',
        //             "CloudyLightRays_py.jpg", // 'py.png',
        //             "CloudyLightRays_ny.jpg", // 'ny.png',
        //             "CloudyLightRays_pz.jpg", // 'pz.png',
        //             "CloudyLightRays_nz.jpg"// 'nz.png'
        //         ]);
        // }
    }
}
