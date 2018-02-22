import { TestBed, inject } from '@angular/core/testing';

import { KeyboardEventHandlerService } from './keyboard-event-handler.service';

describe('KeyboardEventHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardEventHandlerService]
    });
  });

  it('should be created', inject([KeyboardEventHandlerService], (service: KeyboardEventHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
