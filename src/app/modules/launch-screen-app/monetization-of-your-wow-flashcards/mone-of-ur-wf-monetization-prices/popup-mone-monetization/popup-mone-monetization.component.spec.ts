import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMoneMonetizationComponent } from './popup-mone-monetization.component';

describe('PopupMoneMonetizationComponent', () => {
  let component: PopupMoneMonetizationComponent;
  let fixture: ComponentFixture<PopupMoneMonetizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMoneMonetizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMoneMonetizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
