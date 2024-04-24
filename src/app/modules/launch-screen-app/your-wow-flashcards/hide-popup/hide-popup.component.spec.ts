import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HidePopupComponent } from './hide-popup.component';

describe('HidePopupComponent', () => {
  let component: HidePopupComponent;
  let fixture: ComponentFixture<HidePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HidePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HidePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
