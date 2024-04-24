import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneOfUrWfEarningDetailsComponent } from './mone-of-ur-wf-earning-details.component';

describe('MoneOfUrWfEarningDetailsComponent', () => {
  let component: MoneOfUrWfEarningDetailsComponent;
  let fixture: ComponentFixture<MoneOfUrWfEarningDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneOfUrWfEarningDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneOfUrWfEarningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
