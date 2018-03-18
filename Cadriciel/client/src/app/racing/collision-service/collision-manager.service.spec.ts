import { TestBed, inject } from "@angular/core/testing";

import { CollisionManagerService } from "./collision-manager.service";

describe("CollisionManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionManagerService]
    });
  });

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));
});
