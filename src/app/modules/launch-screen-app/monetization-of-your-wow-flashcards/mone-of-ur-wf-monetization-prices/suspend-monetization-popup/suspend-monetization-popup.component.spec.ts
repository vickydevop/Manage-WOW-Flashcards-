import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendMonetizationPopupComponent } from './suspend-monetization-popup.component';

describe('SuspendMonetizationPopupComponent', () => {
  let component: SuspendMonetizationPopupComponent;
  let fixture: ComponentFixture<SuspendMonetizationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspendMonetizationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspendMonetizationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
