import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidGlobalWowFlashcardsComponent } from './paid-global-wow-flashcards.component';

describe('PaidGlobalWowFlashcardsComponent', () => {
  let component: PaidGlobalWowFlashcardsComponent;
  let fixture: ComponentFixture<PaidGlobalWowFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidGlobalWowFlashcardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidGlobalWowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
