import { TestBed, inject } from "@angular/core/testing";
import { ConfigurationService } from "./configuration.service";
import { Player } from "../../../../../common/crossword/player";

const createMockPlayer: Function = (colorString: string, nameString: string, scoreNumber: number) => {
    return {
        color: colorString,
        name: nameString,
        score: scoreNumber
    } as Player;
};

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
        service.playerOne = createMockPlayer("color", "name", 0);
        expect(service.playerOne).toBeTruthy();
    }));

    it("the other player is created", inject([ConfigurationService], (service: ConfigurationService) => {
        service.playerTwo = createMockPlayer("color", "name", 0);
        expect(service.playerTwo).toBeTruthy();
    }));

    it("the current player and the other player are different", inject([ConfigurationService], (service: ConfigurationService) => {
        service.playerOne = createMockPlayer("color", "name", 0);
        service.playerTwo = createMockPlayer("color", "name", 0);
        expect(service.playerOne === service.playerTwo).toBeFalsy();
    }));
});
