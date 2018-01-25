import { TestBed, inject } from "@angular/core/testing";

import { EmptyGridService } from "./empty-grid.service";

describe("EmptyGridService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmptyGridService]
    });
  });

  it("should be created", inject([EmptyGridService], (service: EmptyGridService) => {
    expect(service).toBeTruthy();
  }));
});
