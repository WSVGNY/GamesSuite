import { TestBed, inject } from "@angular/core/testing";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";


describe("MultiplayerCommunicationService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MultiplayerCommunicationService]
        });
    });

    it("should be created", inject([MultiplayerCommunicationService], (service: MultiplayerCommunicationService) => {
        expect(service).toBeTruthy();
    }));

    it("should connect to server", inject([MultiplayerCommunicationService], (service: MultiplayerCommunicationService) => {
        service.connectToSocket();
        expect(service.isSocketDefined).toBeDefined();
    }));

});
