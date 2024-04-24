import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMoneEarningDetailsComponent } from './popup-mone-earning-details.component';

describe('PopupMoneEarningDetailsComponent', () => {
  let component: PopupMoneEarningDetailsComponent;
  let fixture: ComponentFixture<PopupMoneEarningDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMoneEarningDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMoneEarningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
