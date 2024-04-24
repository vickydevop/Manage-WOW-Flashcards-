import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalWfPopupRatingComponent } from './global-wf-popup-rating.component';

describe('GlobalWfPopupRatingComponent', () => {
  let component: GlobalWfPopupRatingComponent;
  let fixture: ComponentFixture<GlobalWfPopupRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalWfPopupRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalWfPopupRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
