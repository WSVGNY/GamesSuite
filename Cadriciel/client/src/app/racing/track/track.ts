import { Track } from "../../../../../common/racing/track";
import {
    Shape, Mesh, MeshPhongMaterial, Path, BackSide, Texture,
    ShapeGeometry, Vector3, Group, PlaneGeometry, MeshBasicMaterial, TextureLoader, DoubleSide, RepeatWrapping
} from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { WallMesh } from "./wall";
import { TrackPointList } from "./trackPointList";
import { WallPlane } from "./plane";
import { TrackPoint } from "./trackPoint";
import { PI_OVER_2 } from "../constants/math.constants";
import { START_LINE_WIDTH, START_LINE_HEIGHT, START_LINE_WEIGHT, DEFAULT_TRACK_NAME } from "../constants/scene.constants";
import {
    STARTING_LINE_PATH, STARTING_LINE_X_FACTOR,
    STARTING_LINE_Y_FACTOR, ASPHALT_TEXTURE_PATH, ASPHALT_TEXTURE_FACTOR
} from "../constants/texture.constants";

export class TrackMesh extends Mesh {
    private _trackPoints: TrackPointList;
    private _walls: Group;
    private _interiorPlanes: WallPlane[];
    private _exteriorPlanes: WallPlane[];
    private _startingLine: Mesh;

    public constructor(private _track: Track) {
        super();
        this._trackPoints = new TrackPointList(this._track.vertices);
        this._interiorPlanes = [];
        this._exteriorPlanes = [];
        this._walls = new Group();
        this.createTrackObjects();
    }

    private createTrackObjects(): void {
        this.createTrackMesh();
        this.createWalls();
        this.createPlanes();
        this.createStartingLine();
    }

    private createWalls(): void {
        this._walls.add(WallMesh.createInteriorWall(this._trackPoints));
        this._walls.add(WallMesh.createExteriorWall(this._trackPoints));
        this.add(this._walls);
    }

    public removeWalls(): void {
        this.remove(this._walls);
    }

    public centerGeometries(center: Vector3): void {
        this.geometry.center().copy(center);
        this._walls.children.forEach((child: WallMesh) => {
            child.geometry.center().copy(center);
        });
    }

    public set timesPlayed(timesPlayed: number) {
        this._track.timesPlayed = timesPlayed;
    }

    public get trackType(): TrackType {
        return this._track.type;
    }

    public get trackPoints(): TrackPointList {
        return this._trackPoints;
    }

    private createPlanes(): void {
        this._trackPoints.toTrackPoints.forEach((currentPoint: TrackPoint) => {
            this._interiorPlanes.push(new WallPlane(
                currentPoint.interior,
                currentPoint.next.interior,
                currentPoint.interior.clone().add(new Vector3(0, 1, 0))
            ));
            this._exteriorPlanes.push(new WallPlane(
                currentPoint.exterior,
                currentPoint.next.exterior,
                currentPoint.exterior.clone().add(new Vector3(0, 1, 0))));
        });
    }

    public get interiorPlanes(): WallPlane[] {
        return this._interiorPlanes;
    }

    public get exteriorPlanes(): WallPlane[] {
        return this._exteriorPlanes;
    }

    private createTrackMesh(): void {
        const shape: Shape = new Shape();
        this.createTrackExterior(shape, this._trackPoints);
        this.drillHoleInTrackShape(shape, this._trackPoints);

        this.geometry = new ShapeGeometry(shape);
        this.material = new MeshPhongMaterial({
            side: BackSide,
            map: this.loadRepeatingTexture(ASPHALT_TEXTURE_PATH, ASPHALT_TEXTURE_FACTOR, ASPHALT_TEXTURE_FACTOR)
        });
        this.rotateX(PI_OVER_2);
        this.name = DEFAULT_TRACK_NAME;
    }

    private createTrackExterior(trackShape: Shape, trackPoints: TrackPointList): void {
        trackShape.moveTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
        for (let i: number = 1; i < trackPoints.length; ++i) {
            trackShape.lineTo(trackPoints.toTrackPoints[i].exterior.x, trackPoints.toTrackPoints[i].exterior.z);
        }
        trackShape.lineTo(trackPoints.first.exterior.x, trackPoints.first.exterior.z);
    }

    private drillHoleInTrackShape(trackShape: Shape, trackPoints: TrackPointList): void {
        const holePath: Path = new Path();
        holePath.moveTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        for (let i: number = trackPoints.length - 1; i > 0; --i) {
            holePath.lineTo(trackPoints.toTrackPoints[i].interior.x, trackPoints.toTrackPoints[i].interior.z);
        }
        holePath.lineTo(trackPoints.first.interior.x, trackPoints.first.interior.z);
        trackShape.holes.push(holePath);
    }

    public createStartingLine(): void {
        this._startingLine = this.createStartingLineMesh();
        this.setStartingLinePosition();
        this.rotateStartingLine();
        this.add(this._startingLine);
    }

    private createStartingLineMesh(): Mesh {
        const geometry: PlaneGeometry = new PlaneGeometry(START_LINE_WEIGHT, START_LINE_WIDTH);
        const texture: MeshBasicMaterial = new MeshBasicMaterial({
            side: DoubleSide,
            map: this.loadRepeatingTexture(STARTING_LINE_PATH, STARTING_LINE_X_FACTOR, STARTING_LINE_Y_FACTOR)
        });

        return new Mesh(geometry, texture);
    }

    private setStartingLinePosition(): void {
        const startingLineVector: Vector3 = this._trackPoints.toTrackPoints[1].coordinate.clone().
            sub(this._trackPoints.toTrackPoints[0].coordinate).normalize();

        const startingLinePosition: number = this._trackPoints.toTrackPoints[1].coordinate.clone().
            sub(this._trackPoints.toTrackPoints[0].coordinate).length() / 2;

        const position: Vector3 = this._trackPoints.toTrackPoints[0].coordinate.clone().
            add(startingLineVector.clone().multiplyScalar(startingLinePosition));

        this._startingLine.position.set(position.x, position.z, START_LINE_HEIGHT);
    }

    private rotateStartingLine(): void {
        this._startingLine.setRotationFromAxisAngle(new Vector3(0, 0, 1), this.findFirstTrackSegmentAngle());
    }

    private findFirstTrackSegmentAngle(): number {
        const carfinalFacingVector: Vector3 = this._trackPoints.toTrackPoints[1].coordinate.clone()
            .sub(this._trackPoints.toTrackPoints[0].coordinate)
            .normalize();

        return new Vector3(0, 0, -1).cross(carfinalFacingVector).y < 0 ?
            new Vector3(0, 0, -1).angleTo(carfinalFacingVector) :
            -new Vector3(0, 0, -1).angleTo(carfinalFacingVector);
    }

    protected loadRepeatingTexture(pathToImage: string, imageRatioX: number, imageRatioY: number): Texture {
        const texture: Texture = new TextureLoader().load(pathToImage);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(imageRatioX, imageRatioY);

        return texture;
    }

    public removeStartingLine(): void {
        this.remove(this._startingLine);
    }
}
