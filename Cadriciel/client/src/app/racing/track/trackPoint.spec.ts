import { TestBed } from "@angular/core/testing";
import { TrackPoint } from "./trackPoint";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Vector3 } from "three";
import { TrackPointList } from "./trackPointList";

// tslint:disable:no-magic-numbers
describe("TrackPoint", () => {
    let trackPoint: TrackPoint;
    let trackList: TrackPointList;
    beforeEach(() => {
        trackPoint = new TrackPoint(new Vector3(0, 0, 0));
        trackList = new TrackPointList([]);
        TestBed.configureTestingModule({
            providers: [TrackPoint]
        });
    });

    it("a track point should be created", () => {
        expect(trackPoint).toBeTruthy();
    });

    it("should find interior point", () => {
        trackPoint.previous = new TrackPoint(new Vector3(1, 0, 0));
        trackPoint.next = new TrackPoint(new Vector3(0, 0, 1));
        trackPoint.findInteriorExteriorPoints();
        expect(trackPoint.interior.x).toBeGreaterThan(-10.0001);
    });

    it("should find interior opposite point", () => {
        trackPoint.next = new TrackPoint(new Vector3(1, 0, 0));
        trackPoint.previous = new TrackPoint(new Vector3(0, 0, 1));
        trackPoint.findInteriorExteriorPoints();
        expect(trackPoint.interior.z).toBeLessThan(10.0001);
    });

    it("should find exterior point", () => {
        trackPoint.previous = new TrackPoint(new Vector3(1, 0, 0));
        trackPoint.next = new TrackPoint(new Vector3(0, 0, 1));
        trackPoint.findInteriorExteriorPoints();
        expect(trackPoint.exterior.x).toBeLessThan(10.0001);
    });

    it("should find exterior opposite point", () => {
        trackPoint.next = new TrackPoint(new Vector3(1, 0, 0));
        trackPoint.previous = new TrackPoint(new Vector3(0, 0, 1));
        trackPoint.findInteriorExteriorPoints();
        expect(trackPoint.exterior.z).toBeGreaterThan(-10.0001);
    });

    it("a track list of points should be created", () => {
        expect(trackList).toBeTruthy();
    });

    it("a track list of points should be created in the clock direction", () => {
        const points: CommonCoordinate3D[] = [];
        const trackPoint1: Vector3 = new Vector3(0, 0, 0);
        const trackPoint2: Vector3 = new Vector3(1, 0, 0);
        const trackPoint3: Vector3 = new Vector3(0, 0, 1);
        points.push(trackPoint1);
        points.push(trackPoint2);
        points.push(trackPoint3);
        const newList: TrackPointList = new TrackPointList(points);
        expect(newList.toTrackPoints).toBeTruthy();
    });

    it("a track list of points should be created in the invert clock direction", () => {
        const points: CommonCoordinate3D[] = [];
        const trackPoint1: Vector3 = new Vector3(0, 0, 0);
        const trackPoint2: Vector3 = new Vector3(1, 0, 0);
        const trackPoint3: Vector3 = new Vector3(0, 0, 1);
        points.push(trackPoint3);
        points.push(trackPoint2);
        points.push(trackPoint1);
        const newList: TrackPointList = new TrackPointList(points);
        expect(newList.toTrackPoints).toBeTruthy();
    });
});
