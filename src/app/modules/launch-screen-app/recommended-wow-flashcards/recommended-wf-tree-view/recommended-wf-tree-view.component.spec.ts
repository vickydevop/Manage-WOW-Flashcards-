import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedWfTreeViewComponent } from './recommended-wf-tree-view.component';

describe('RecommendedWfTreeViewComponent', () => {
  let component: RecommendedWfTreeViewComponent;
  let fixture: ComponentFixture<RecommendedWfTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedWfTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedWfTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
