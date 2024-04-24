import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneOfUrWfMonetizationPricesComponent } from './mone-of-ur-wf-monetization-prices.component';

describe('MoneOfUrWfMonetizationPricesComponent', () => {
  let component: MoneOfUrWfMonetizationPricesComponent;
  let fixture: ComponentFixture<MoneOfUrWfMonetizationPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneOfUrWfMonetizationPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneOfUrWfMonetizationPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
