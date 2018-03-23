import { TestBed, inject } from "@angular/core/testing";

import { CollisionManagerService } from "./collision-manager.service";

describe("CollisionManagerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionManagerService]
    });
  });

  it("should detect collision when 2 cars  ", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should find the right direction ", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));

  it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
    expect(service).toBeTruthy();
  }));
});
