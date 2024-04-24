import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizationPricesTreeViewComponent } from './monetization-prices-tree-view.component';

describe('MonetizationPricesTreeViewComponent', () => {
  let component: MonetizationPricesTreeViewComponent;
  let fixture: ComponentFixture<MonetizationPricesTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonetizationPricesTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonetizationPricesTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
