import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGlobalCourseComponent } from './edit-global-course.component';

describe('EditGlobalCourseComponent', () => {
  let component: EditGlobalCourseComponent;
  let fixture: ComponentFixture<EditGlobalCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGlobalCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGlobalCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
