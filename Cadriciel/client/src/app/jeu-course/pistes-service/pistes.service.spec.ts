import { TestBed, inject } from '@angular/core/testing';

import { PistesService } from './pistes.service';

describe('PistesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PistesService]
    });
  });

  it('should be created', inject([PistesService], (service: PistesService) => {
    expect(service).toBeTruthy();
  }));
});
