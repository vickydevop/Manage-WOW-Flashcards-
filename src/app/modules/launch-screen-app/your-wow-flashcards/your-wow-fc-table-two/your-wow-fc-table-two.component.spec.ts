import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWowFcTableTwoComponent } from './your-wow-fc-table-two.component';

describe('YourWowFcTableTwoComponent', () => {
  let component: YourWowFcTableTwoComponent;
  let fixture: ComponentFixture<YourWowFcTableTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWowFcTableTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWowFcTableTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
