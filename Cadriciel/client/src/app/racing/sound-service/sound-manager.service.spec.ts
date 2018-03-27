import { TestBed, inject } from "@angular/core/testing";

import { SoundManagerService } from "./sound-manager.service";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, KeyboardEventHandlerService]
        });
    });

    it("should be created", inject([SoundManagerService], (service: SoundManagerService) => {
        expect(service).toBeTruthy();
    }));
});
