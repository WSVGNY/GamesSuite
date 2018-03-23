import { AbstractScene } from "./abstractScene";
import { TrackPoint } from "./../render-service/trackPoint";
import {
    Group, PlaneGeometry, MeshPhongMaterial, BackSide, Texture, TextureLoader,
    RepeatWrapping, Mesh, CubeTexture, CubeTextureLoader,
    Vector3, Geometry, Line, Camera, LineBasicMaterial
} from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { SkyBox } from "../render-service/skybox";
import { TrackLights } from "../render-service/light";
import {
    PI_OVER_2, LOWER_GROUND, GROUND_SIZE, GROUND_TEXTURE_FACTOR, GRASS_TEXTURE, CHANGE_CAMERA_KEYCODE, YELLOW
} from "../constants";
import { Car } from "../car/car";
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { Wall } from "../render-service/wall";
import { TrackPointList } from "../render-service/trackPointList";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Track } from "../../../../../common/racing/track";
import { TrackMesh } from "../track";

const START_POSITION_OFFSET: number = 4;

export class GameScene extends AbstractScene {

    private _trackShape: TrackMesh;
    private _group: Group = new Group();
    private _skyBoxTextures: Map<TrackType, CubeTexture>;
    private _lighting: TrackLights;
    private _centerLine: Group;
    private _debugMode: boolean;
    private _debugElements: Group = new Group();
    private _isDay: boolean;

    public constructor(private _keyBoardService: KeyboardEventHandlerService) {
        super();
        this._skyBoxTextures = new Map();
        this.add(this._group);
    }

    public loadTrack(track: Track): void {
        if (this._trackShape !== undefined) {
            this._group.remove(this._trackShape);
        }
        this._isDay = track.type === TrackType.Default ? true : false;
        this._group.add(this.createWalls(new TrackPointList(track.vertices)));
        this._trackShape = new TrackMesh(track);
        this._group.add(this._trackShape);
        this.addGround();
        this.setSkyBox(track.type);
        this.loadLights(track.type);
        this.setCenterLine();
    }

    public async loadCars(cars: Car[], carDebugs: AIDebug[], camera: Camera, trackType: TrackType): Promise<void> {
        for (let i: number = 0; i < cars.length; ++i) {
            const startPos: Vector3 = new Vector3(
                this._trackShape.trackPoints.first.coordinate.x - i * START_POSITION_OFFSET,
                this._trackShape.trackPoints.first.coordinate.y,
                this._trackShape.trackPoints.first.coordinate.z - i * START_POSITION_OFFSET);

            await cars[i].init(startPos, this.findFirstTrackSegmentAngle());
            this._debugElements.add(carDebugs[i].debugGroup);
            if (!cars[i].isAI) {
                cars[i].attachCamera(camera);
            }
            this._group.add(cars[i]);
        }
        switch (trackType) {
            case TrackType.Night:
                this.setNight(cars);
                break;
            case TrackType.Default:
            default:
                this.setDay(cars);
                break;
        }
    }

    private loadLights(trackType: TrackType): void {
        this._lighting = new TrackLights(trackType);
        this._keyBoardService.bindFunctionToKeyDown(CHANGE_CAMERA_KEYCODE, () => this._lighting.changePerspective());
        this._group.add(this._lighting);
    }

    public createWalls(trackPoints: TrackPointList): Group {
        const walls: Group = new Group();
        walls.add(Wall.createInteriorWall(trackPoints));
        walls.add(Wall.createExteriorWall(trackPoints));

        return walls;
    }

    private addGround(): void {
        const groundGeometry: PlaneGeometry = new PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
        const groundMaterial: MeshPhongMaterial =
            new MeshPhongMaterial({ side: BackSide, map: this.loadRepeatingTexture(GRASS_TEXTURE, GROUND_TEXTURE_FACTOR) });

        const ground: Mesh = new Mesh(groundGeometry, groundMaterial);
        ground.rotateX(PI_OVER_2);
        ground.translateZ(LOWER_GROUND);
        ground.name = "ground";
        this.add(ground);
    }

    private setSkyBox(trackType: TrackType): void {
        if (this._skyBoxTextures.get(trackType) === undefined) {
            this._skyBoxTextures.set(trackType, this.loadSkyBox(SkyBox.getPath(trackType)));
        }
        this.background = this._skyBoxTextures.get(trackType);
    }

    private loadSkyBox(pathToImages: string): CubeTexture {
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

    private loadRepeatingTexture(pathToImage: string, imageRatio: number): Texture {
        const texture: Texture = new TextureLoader().load(pathToImage);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(imageRatio, imageRatio);

        return texture;
    }

    private findFirstTrackSegmentAngle(): number {
        const carfinalFacingVector: Vector3 = this._trackShape.trackPoints.points[1].coordinate.clone()
            .sub(this._trackShape.trackPoints.points[0].coordinate)
            .normalize();

        return new Vector3(0, 0, -1).cross(carfinalFacingVector).y > 0 ?
            new Vector3(0, 0, -1).angleTo(carfinalFacingVector) :
            - new Vector3(0, 0, -1).angleTo(carfinalFacingVector);
    }

    private setCenterLine(): void {
        const material: LineBasicMaterial = new LineBasicMaterial({ color: YELLOW, linewidth: 3 });
        this._centerLine = new Group();

        this._trackShape.trackPoints.points.forEach((currentPoint: TrackPoint) => {
            this._centerLine.add(this.drawLine(material, currentPoint.coordinate, currentPoint.next.coordinate, 2));
        });
    }

    // https://stackoverflow.com/questions/21067461/workaround-for-lack-of-line-width-on-windows-when-using-three-js
    private drawLine(
        lineMaterial: LineBasicMaterial,
        currentPoint: Vector3,
        nextPoint: Vector3,
        thickness: number): Group {
        const dashedLine: Group = new Group();
        const LINE_OFFSET: number = 64;

        for (let i: number = 0; i < thickness * 2; i++) {
            const routerLineGeometry: Geometry = new Geometry();
            const offset: number = i / LINE_OFFSET + i / LINE_OFFSET;

            routerLineGeometry.vertices.push(new Vector3(currentPoint.x + offset, currentPoint.y, currentPoint.z + offset));
            routerLineGeometry.vertices.push(new Vector3(nextPoint.x + offset, nextPoint.y, nextPoint.z + offset));

            dashedLine.add(new Line(routerLineGeometry, lineMaterial));
        }

        for (let i: number = 0; i < thickness * 2; i++) {
            const routerLineGeometry: Geometry = new Geometry();
            const offset: number = i / LINE_OFFSET + i / LINE_OFFSET + i / LINE_OFFSET;

            routerLineGeometry.vertices.push(new Vector3(currentPoint.x + offset, currentPoint.y, currentPoint.z + offset));
            routerLineGeometry.vertices.push(new Vector3(nextPoint.x + offset, nextPoint.y, nextPoint.z + offset));

            dashedLine.add(new Line(routerLineGeometry, lineMaterial));
        }

        return dashedLine;
    }

    public changeTimeOfDay(cars: Car[]): void {
        this._isDay = !this._isDay;
        this._isDay ? this.setDay(cars) : this.setNight(cars);
    }

    private setDay(cars: Car[]): void {
        this.setSkyBox(TrackType.Default);
        this._lighting.updateLightsToTrackType(TrackType.Default);
        cars.forEach((car: Car) => car.turnLightsOff());
    }

    private setNight(cars: Car[]): void {
        this.setSkyBox(TrackType.Night);
        this._lighting.updateLightsToTrackType(TrackType.Night);
        cars.forEach((car: Car) => car.turnLightsOn());
    }

    public changeDebugMode(): void {
        this._debugMode = !this._debugMode;
        this._debugMode ? this.enableDebugMode() : this.disableDebugMode();
    }

    private enableDebugMode(): void {
        this.add(this._debugElements);
        this.add(this._centerLine);
    }

    private disableDebugMode(): void {
        this.remove(this._debugElements);
        this.remove(this._centerLine);
    }

    public get debugMode(): boolean {
        return this._debugMode;
    }
}
