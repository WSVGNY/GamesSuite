import { TestBed, inject } from '@angular/core/testing';

import { ServiceLoaderService } from './service-loader.service';

describe('ServiceLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceLoaderService]
    });
  });

  it('should be created', inject([ServiceLoaderService], (service: ServiceLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
