import { TestBed, inject } from '@angular/core/testing';

import { GameUpdateManagerService } from './game-update-manager.service';

describe('GameUpdateManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameUpdateManagerService]
    });
  });

  it('should be created', inject([GameUpdateManagerService], (service: GameUpdateManagerService) => {
    expect(service).toBeTruthy();
  }));
});
