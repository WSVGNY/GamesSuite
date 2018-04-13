import { TestBed, inject } from "@angular/core/testing";

import { CarTrackingManagerService } from "./car-tracking-manager.service";

describe("CarTrackingManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CarTrackingManagerService]
        });
    });

    it("should be created", inject([CarTrackingManagerService], (service: CarTrackingManagerService) => {
        expect(service).toBeTruthy();
    }));
});
