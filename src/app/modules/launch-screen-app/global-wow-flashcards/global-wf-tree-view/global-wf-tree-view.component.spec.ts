import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalWfTreeViewComponent } from './global-wf-tree-view.component';

describe('GlobalWfTreeViewComponent', () => {
  let component: GlobalWfTreeViewComponent;
  let fixture: ComponentFixture<GlobalWfTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalWfTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalWfTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
