import { TestBed, inject } from "@angular/core/testing";

import { GameTimeManagerService } from "./game-time-manager.service";

describe("LapTimeManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameTimeManagerService]
    });
  });

  it("should be created", inject([GameTimeManagerService], (service: GameTimeManagerService) => {
    expect(service).toBeTruthy();
  }));
});
