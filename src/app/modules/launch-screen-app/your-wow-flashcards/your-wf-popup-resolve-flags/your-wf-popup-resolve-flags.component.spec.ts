import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWfPopupResolveFlagsComponent } from './your-wf-popup-resolve-flags.component';

describe('YourWfPopupResolveFlagsComponent', () => {
  let component: YourWfPopupResolveFlagsComponent;
  let fixture: ComponentFixture<YourWfPopupResolveFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWfPopupResolveFlagsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWfPopupResolveFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
