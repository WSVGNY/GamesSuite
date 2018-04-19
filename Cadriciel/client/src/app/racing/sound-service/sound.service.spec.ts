import { TestBed, inject } from "@angular/core/testing";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";
import { InputNameService } from "../scoreboard/input-name/input-name.service";
import { SoundService } from "./sound.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundService, KeyboardEventService, InputNameService]
        });
    });

    it("should be created", inject([SoundService], (service: SoundService) => {
        expect(service).toBeTruthy();
    }));
});
