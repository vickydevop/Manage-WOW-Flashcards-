import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignWowDeletePopupComponent } from './assign-wow-delete-popup.component';

describe('AssignWowDeletePopupComponent', () => {
  let component: AssignWowDeletePopupComponent;
  let fixture: ComponentFixture<AssignWowDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignWowDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignWowDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
