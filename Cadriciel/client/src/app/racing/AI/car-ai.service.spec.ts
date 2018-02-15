import { TestBed, inject } from "@angular/core/testing";

import { CarAiService } from "./car-ai.service";

describe("CarAiService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarAiService]
    });
  });

  it("should be created", inject([CarAiService], (service: CarAiService) => {
    expect(service).toBeTruthy();
  }));
});
