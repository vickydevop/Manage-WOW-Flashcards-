import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalWfPopupFlagComponent } from './global-wf-popup-flag.component';

describe('GlobalWfPopupFlagComponent', () => {
  let component: GlobalWfPopupFlagComponent;
  let fixture: ComponentFixture<GlobalWfPopupFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalWfPopupFlagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalWfPopupFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
