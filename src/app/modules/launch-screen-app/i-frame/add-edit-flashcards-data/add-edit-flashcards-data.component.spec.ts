import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFlashcardsDataComponent } from './add-edit-flashcards-data.component';

describe('AddEditFlashcardsDataComponent', () => {
  let component: AddEditFlashcardsDataComponent;
  let fixture: ComponentFixture<AddEditFlashcardsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFlashcardsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFlashcardsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
