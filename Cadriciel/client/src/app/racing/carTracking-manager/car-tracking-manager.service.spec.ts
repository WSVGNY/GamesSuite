import { TestBed, inject } from "@angular/core/testing";

import { CarTrackingManagerService } from "./car-tracking-manager.service";
import { RaceProgressTracker } from "./raceProgressTracker";
import { Vector3, Sphere } from "three";

describe("CarTrackingManagerService", () => {
    const raceProgressTracker: RaceProgressTracker = new RaceProgressTracker();
    const trackingManager: CarTrackingManagerService = new CarTrackingManagerService();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CarTrackingManagerService]
        });
    });

    it("should be created", inject([CarTrackingManagerService], (service: CarTrackingManagerService) => {
        expect(service).toBeTruthy();
    }));

    it("should be at finish line", () => {
        expect(trackingManager["isAtFinishLine"](new Vector3(0, 0, 0), raceProgressTracker)).toEqual(true);
    });

    it("shouldn't be at finish line", () => {
        expect(trackingManager["isAtFinishLine"](new Vector3(10, 10, 10), raceProgressTracker)).toEqual(false);
    });

    it("should compute finish line", () => {
        const MOCK_TRACK: Vector3[] = [
            new Vector3(0, 0, 0),
            new Vector3(100, 0, 0),
            new Vector3(100, 0, 100),
            new Vector3(0, 0, 100),
        ];
        trackingManager["computeFinishLine"](MOCK_TRACK);
        expect(trackingManager["_finishLineSegment"].getPositionFromMatrix).toEqual(new Vector3(0, 0, 0));
    });

    it("should contains the car", () => {
        const trackingSphere: Sphere = new Sphere(new Vector3(1, 0, 0));
        expect(trackingManager["sphereContainsCar"](trackingSphere, new Vector3(1, 0, 0))).toEqual(true);
    });

    it("shouldn't contains the car", () => {
        const trackingSphere: Sphere = new Sphere(new Vector3(1, 0, 0));
        expect(trackingManager["sphereContainsCar"](trackingSphere, new Vector3(10, 0, 30))).toEqual(false);
    });
});
