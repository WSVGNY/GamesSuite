import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotCroiseComponent } from './mot-croise.component';

describe('MotCroiseComponent', () => {
  let component: MotCroiseComponent;
  let fixture: ComponentFixture<MotCroiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotCroiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotCroiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
