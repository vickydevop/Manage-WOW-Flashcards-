import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneEarningDetailsTableTwoComponent } from './mone-earning-details-table-two.component';

describe('MoneEarningDetailsTableTwoComponent', () => {
  let component: MoneEarningDetailsTableTwoComponent;
  let fixture: ComponentFixture<MoneEarningDetailsTableTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneEarningDetailsTableTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneEarningDetailsTableTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
