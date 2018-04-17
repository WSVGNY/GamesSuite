import { TestBed, inject } from "@angular/core/testing";
import { SoundManagerService } from "./sound-manager.service";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, KeyboardEventHandlerService, InputTimeService]
        });
    });

    it("should be created", inject([SoundManagerService], (service: SoundManagerService) => {
        expect(service).toBeTruthy();
    }));
});
