import { TestBed, inject } from "@angular/core/testing";

import { TimeService } from "./game-time-manager.service";

describe("LapTimeManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TimeService]
        });
    });

    it("should be created", inject([TimeService], (service: TimeService) => {
        expect(service).toBeTruthy();
    }));
});
