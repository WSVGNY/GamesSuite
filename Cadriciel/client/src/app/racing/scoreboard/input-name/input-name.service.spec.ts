import { TestBed, inject } from "@angular/core/testing";
import { InputNameService } from "./input-name.service";

describe("InputTimeService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InputNameService]
        });
    });

    it("should be created", inject([InputNameService], (service: InputNameService) => {
        expect(service).toBeTruthy();
    }));
});
