import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWfPopupLinkNewEditComponent } from './your-wf-popup-link-new-edit.component';

describe('YourWfPopupLinkNewEditComponent', () => {
  let component: YourWfPopupLinkNewEditComponent;
  let fixture: ComponentFixture<YourWfPopupLinkNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWfPopupLinkNewEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWfPopupLinkNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
