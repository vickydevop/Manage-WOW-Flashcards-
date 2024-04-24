import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupMoneEarningHistoryComponent } from './popup-mone-earning-history.component';

describe('PopupMoneEarningHistoryComponent', () => {
  let component: PopupMoneEarningHistoryComponent;
  let fixture: ComponentFixture<PopupMoneEarningHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupMoneEarningHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupMoneEarningHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
