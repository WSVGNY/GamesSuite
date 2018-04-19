import { TestBed, inject } from "@angular/core/testing";
import { SoundManagerService } from "./sound-manager.service";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";
import { InputNameService } from "../scoreboard/input-name/input-name.service";

describe("SoundManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, KeyboardEventService, InputNameService]
        });
    });

    it("should be created", inject([SoundManagerService], (service: SoundManagerService) => {
        expect(service).toBeTruthy();
    }));
});
