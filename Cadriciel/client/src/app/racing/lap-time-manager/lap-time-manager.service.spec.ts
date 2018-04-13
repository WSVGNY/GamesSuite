import { TestBed, inject } from "@angular/core/testing";

import { LapTimeManagerService } from "./lap-time-manager.service";

describe("LapTimeManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LapTimeManagerService]
    });
  });

  it("should be created", inject([LapTimeManagerService], (service: LapTimeManagerService) => {
    expect(service).toBeTruthy();
  }));
});
