import { TestBed, inject } from "@angular/core/testing";

import { MouseEventService } from "./mouse-event-handler.service";

describe("MouseEventHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MouseEventService]
        });
    });

    it("should be created", inject([MouseEventService], (service: MouseEventService) => {
        expect(service).toBeTruthy();
    }));
});
