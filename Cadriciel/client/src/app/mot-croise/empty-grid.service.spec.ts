import { TestBed, inject } from "@angular/core/testing";

import { EmptyGridService } from "./empty-grid.service";

import { AppModule } from '../app.module';

import {APP_BASE_HREF} from '@angular/common';

describe('EmptyGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmptyGridService,
        {provide: APP_BASE_HREF, useValue : '/' }],
      imports:[AppModule],
    });
  });

  it("should be created", inject([EmptyGridService], (service: EmptyGridService) => {
    expect(service).toBeTruthy();
  }));
});
