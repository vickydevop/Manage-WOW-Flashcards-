import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizationOfYourWowFlashcardsComponent } from './monetization-of-your-wow-flashcards.component';

describe('MonetizationOfYourWowFlashcardsComponent', () => {
  let component: MonetizationOfYourWowFlashcardsComponent;
  let fixture: ComponentFixture<MonetizationOfYourWowFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonetizationOfYourWowFlashcardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonetizationOfYourWowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
