import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupViewResolveYwfpComponent } from './popup-view-resolve-ywfp.component';

describe('PopupViewResolveYwfpComponent', () => {
  let component: PopupViewResolveYwfpComponent;
  let fixture: ComponentFixture<PopupViewResolveYwfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupViewResolveYwfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupViewResolveYwfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
