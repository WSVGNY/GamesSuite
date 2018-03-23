import { TestBed, inject } from "@angular/core/testing";
import { ConfigurationService } from "./configuration.service";

describe("ConfigurationService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConfigurationService]
        });
    });

    it("should be created", inject([ConfigurationService], (service: ConfigurationService) => {
        expect(service).toBeTruthy();
    }));

    it("the current player is created", inject([ConfigurationService], (service: ConfigurationService) => {
        expect(false).toBeTruthy();
    }));

    it("the other player is created", inject([ConfigurationService], (service: ConfigurationService) => {
        expect(false).toBeTruthy();
    }));

    it("the current player and the other player are different", inject([ConfigurationService], (service: ConfigurationService) => {
        expect(false).toBeTruthy();
    }));
});
