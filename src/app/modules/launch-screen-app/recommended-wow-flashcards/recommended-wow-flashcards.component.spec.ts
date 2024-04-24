import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedWowFlashcardsComponent } from './recommended-wow-flashcards.component';

describe('RecommendedWowFlashcardsComponent', () => {
  let component: RecommendedWowFlashcardsComponent;
  let fixture: ComponentFixture<RecommendedWowFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedWowFlashcardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedWowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
