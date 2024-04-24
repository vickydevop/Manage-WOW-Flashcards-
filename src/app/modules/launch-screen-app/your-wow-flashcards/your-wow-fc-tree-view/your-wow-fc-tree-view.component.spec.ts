import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWowFcTreeViewComponent } from './your-wow-fc-tree-view.component';

describe('YourWowFcTreeViewComponent', () => {
  let component: YourWowFcTreeViewComponent;
  let fixture: ComponentFixture<YourWowFcTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWowFcTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWowFcTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
