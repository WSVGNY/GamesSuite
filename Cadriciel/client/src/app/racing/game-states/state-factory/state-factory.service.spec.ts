import { TestBed, inject } from '@angular/core/testing';

import { StateFactoryService } from './state-factory.service';

describe('StateFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateFactoryService]
    });
  });

  it('should be created', inject([StateFactoryService], (service: StateFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
