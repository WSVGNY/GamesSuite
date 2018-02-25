import { TestBed, inject } from "@angular/core/testing";
import { TrackPoint, TrackPointList } from "./trackPoint";
// import { Object3D } from "three";
import assert = require("assert");
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";

describe("TrackPoint", () => {
    const track: TrackPoint = new TrackPoint();
    const trackList: TrackPointList = new TrackPointList(new Array<CommonCoordinate3D>());
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [TrackPoint]
        });
    });

    it("should be created", inject([TrackPoint], (service: TrackPoint) => {
        expect(service).toBeTruthy();
    }));

    /*it("should accelerate when accelerator is pressed", () => {

        expect().toBeGreaterThan(initialSpeed);
    });*/
});
