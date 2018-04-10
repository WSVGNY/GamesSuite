import { TestBed, inject } from "@angular/core/testing";

import { EndGameTableService } from "./end-game-table.service";

describe("EndGameTableService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EndGameTableService]
    });
  });

  it("should be created", inject([EndGameTableService], (service: EndGameTableService) => {
    expect(service).toBeTruthy();
  }));
});
