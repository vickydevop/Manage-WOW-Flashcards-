import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalWowFlashcardsComponent } from './global-wow-flashcards.component';

describe('GlobalWowFlashcardsComponent', () => {
  let component: GlobalWowFlashcardsComponent;
  let fixture: ComponentFixture<GlobalWowFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalWowFlashcardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalWowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
