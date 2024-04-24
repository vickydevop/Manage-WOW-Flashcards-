import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWowFlashcardsComponent } from './your-wow-flashcards.component';

describe('YourWowFlashcardsComponent', () => {
  let component: YourWowFlashcardsComponent;
  let fixture: ComponentFixture<YourWowFlashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWowFlashcardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWowFlashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
