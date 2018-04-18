import { TestBed, inject } from "@angular/core/testing";
import { SoundManagerService } from "./sound-manager.service";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, KeyboardEventService, InputTimeService]
        });
    });

    it("should be created", inject([SoundManagerService], (service: SoundManagerService) => {
        expect(service).toBeTruthy();
    }));
});
