import { TestBed, inject } from "@angular/core/testing";
import { TrackPoint } from "./trackPoint";
// import { Object3D } from "three";
import assert = require("assert");

describe("TrackPoint", () => {

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
