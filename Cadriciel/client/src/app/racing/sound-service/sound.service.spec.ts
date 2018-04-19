import { TestBed, inject } from "@angular/core/testing";
import { SoundService } from "./sound-manager.service";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundService, KeyboardEventService, InputTimeService]
        });
    });

    it("should be created", inject([SoundService], (service: SoundService) => {
        expect(service).toBeTruthy();
    }));
});
