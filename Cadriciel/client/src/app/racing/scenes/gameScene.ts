import { AbstractScene } from "./abstractScene";
import { TrackPointList, TrackPoint } from "./../render-service/trackPoint";
import { Group, PlaneGeometry, MeshPhongMaterial, BackSide, Texture, TextureLoader,
         RepeatWrapping, Mesh, CubeTexture, Shape, ShapeGeometry, Path, CubeTextureLoader,
         Vector3, Geometry, LineBasicMaterial, Line, Camera } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { SkyBox } from "../render-service/skybox";
import { TrackLights } from "../render-service/light";
import { Track } from "../track";
import { PI_OVER_2, LOWER_GROUND, GROUND_SIZE, GROUND_TEXTURE_FACTOR, ASPHALT_TEXTURE, GRASS_TEXTURE, MS_TO_SECONDS } from "../constants";
import { Car } from "../car/car";
import { GREEN } from ".././constants";

const START_POSITION_OFFSET: number = 4;

export class GameScene extends AbstractScene {

    private _trackPoints: TrackPointList;
    private _track: Mesh;
    private _group: Group = new Group();
    private _skyBoxTexture: CubeTexture;
    private _lighting: TrackLights;
    private _centerLine: Line;
    private _aiCarsDebug: Group = new Group();

    public constructor() {
        super();
        this.addGround();
        this._group.add(new TrackLights(TrackType.Default));
        this.add(this._group);
    }

    public loadTrack(track: Track): void {
        if (this._track !== undefined) {
            this._group.remove(this._track);
        }
        this._trackPoints = new TrackPointList(track.vertices);
        this._track = this.createTrackMesh(this._trackPoints);
        this._group.add(this._track);
        this.setSkyBox(track.type);
        this.loadLights(track.type);
    }

    public async loadCars(cars: Car[], camera: Camera): Promise<void> {
        for (let i: number = 0; i < cars.length; ++i) {
            const startPos: Vector3 = new Vector3(
                this._trackPoints.first.coordinates.x - i * START_POSITION_OFFSET,
                this._trackPoints.first.coordinates.y,
                this._trackPoints.first.coordinates.z - i * START_POSITION_OFFSET);

            await cars[i].init(startPos, this.findFirstTrackSegmentAngle());
            if (!cars[i]._isAI) {
                cars[i].attachCamera(camera);
            }
            this._group.add(cars[i]);
        }
    }

    private loadLights(trackType: TrackType): void {
        if (this._lighting !== undefined) {
            this._group.remove(this._lighting);
        }
        this._lighting = new TrackLights(trackType);
        this._lighting.updateLightsToTrackType(trackType);
        this._group.add(this._lighting);
    }

    private addGround(): void {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
        const groundMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(GRASS_TEXTURE, MS_TO_SECONDS) });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        ground.name = "ground";
        this.add(ground);
    }

    private setSkyBox(trackType: TrackType): void {
        this.loadSkyBox(SkyBox.getPath(trackType));
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

        if (this !== undefined) {
            this.background = this._skyBoxTexture;
        }
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

    private loadRepeatingTexture(pathToImage: string, imageRatio: number): Texture {
        const texture: Texture = new TextureLoader().load(pathToImage);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(imageRatio, imageRatio);

        return texture;
    }

    private findFirstTrackSegmentAngle(): number {
        const carfinalFacingVector: Vector3 = this._trackPoints.points[1].coordinates.clone()
            .sub(this._trackPoints.points[0].coordinates)
            .normalize();

        return new Vector3(0, 0, -1).cross(carfinalFacingVector).y > 0 ?
            new Vector3(0, 0, -1).angleTo(carfinalFacingVector) :
            - new Vector3(0, 0, -1).angleTo(carfinalFacingVector);
    }

    public setCenterLine(): void {
        const geometryPoints: Geometry = new Geometry();
        this._trackPoints.points.forEach((currentPoint: TrackPoint) => geometryPoints.vertices.push(currentPoint.coordinates));
        geometryPoints.vertices.push(this._trackPoints.points[0].coordinates);

        this._centerLine = new Line(geometryPoints, new LineBasicMaterial({ color: GREEN, linewidth: 3 }));
    }

    public changeTimeOfDay(isDay: boolean, cars: Car[]): void {
        if (isDay) {
            this.setSkyBox(TrackType.Default);
            this.loadLights(TrackType.Default);
            cars.forEach((car: Car) => car.dettachLights());
        } else {
            this.setSkyBox(TrackType.Night);
            this.loadLights(TrackType.Night);
            cars.forEach((car: Car) => car.attachLights());
        }
    }

    public enableDebugMode(): void {
        // this._debug = true;
        this.add(this._aiCarsDebug);
        this.add(this._centerLine);
    }

    public disableDebugMode(): void {
        // this._debug = false;
        this.remove(this._aiCarsDebug);
        this.remove(this._centerLine);
    }
}
