import { TestBed, inject } from "@angular/core/testing";

import { InputTimeService } from "./input-time.service";

describe("InputTimeService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InputTimeService]
        });
    });

    it("should be created", inject([InputTimeService], (service: InputTimeService) => {
        expect(service).toBeTruthy();
    }));
});
