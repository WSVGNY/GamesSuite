import { TestBed, inject } from "@angular/core/testing";

import { MouseEventHandlerService } from "./mouse-event-handler.service";

describe("MouseEventHandlerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MouseEventHandlerService]
    });
  });

  it("should be created", inject([MouseEventHandlerService], (service: MouseEventHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
