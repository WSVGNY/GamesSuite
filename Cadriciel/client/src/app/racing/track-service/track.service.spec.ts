import { TestBed, inject } from '@angular/core/testing';

import { PistesService } from './track.service';

import { AppModule } from '../../app.module';

import {APP_BASE_HREF} from '@angular/common';

describe('PistesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PistesService,
        {provide: APP_BASE_HREF, useValue : '/' }],
      imports:[AppModule]
    });
  });

  it('should be created', inject([PistesService], (service: PistesService) => {
    expect(service).toBeTruthy();
  }));
});
