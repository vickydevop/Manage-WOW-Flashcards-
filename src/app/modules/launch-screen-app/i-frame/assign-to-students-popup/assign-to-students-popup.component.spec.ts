import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToStudentsPopupComponent } from './assign-to-students-popup.component';

describe('AssignToStudentsPopupComponent', () => {
  let component: AssignToStudentsPopupComponent;
  let fixture: ComponentFixture<AssignToStudentsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignToStudentsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignToStudentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
