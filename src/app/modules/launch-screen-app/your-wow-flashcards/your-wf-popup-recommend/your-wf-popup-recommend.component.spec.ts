import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWfPopupRecommendComponent } from './your-wf-popup-recommend.component';

describe('YourWfPopupRecommendComponent', () => {
  let component: YourWfPopupRecommendComponent;
  let fixture: ComponentFixture<YourWfPopupRecommendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWfPopupRecommendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWfPopupRecommendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
