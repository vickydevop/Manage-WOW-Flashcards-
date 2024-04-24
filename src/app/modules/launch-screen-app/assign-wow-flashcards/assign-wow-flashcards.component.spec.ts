import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignWowFlashcardsComponent } from './assign-wow-flashcards.component';

describe('AssignWowFlashcardsComponent', () => {
  let component: AssignWowFlashcardsComponent;
  let fixture: ComponentFixture<AssignWowFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignWowFlashcardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignWowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
