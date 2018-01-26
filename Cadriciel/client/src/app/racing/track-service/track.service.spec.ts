import { TestBed, inject } from '@angular/core/testing';

import { TrackService } from './track.service';

import { AppModule } from '../../app.module';

import {APP_BASE_HREF} from '@angular/common';

describe('PistesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackService,
        {provide: APP_BASE_HREF, useValue : '/' }],
      imports:[AppModule]
    });
  });

  it('should be created', inject([TrackService], (service: TrackService) => {
    expect(service).toBeTruthy();
  }));
});
