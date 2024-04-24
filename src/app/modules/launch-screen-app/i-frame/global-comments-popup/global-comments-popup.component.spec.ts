import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCommentsPopupComponent } from './global-comments-popup.component';

describe('GlobalCommentsPopupComponent', () => {
  let component: GlobalCommentsPopupComponent;
  let fixture: ComponentFixture<GlobalCommentsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalCommentsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalCommentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
