import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomWfTableTwoComponent } from './recom-wf-table-two.component';

describe('RecomWfTableTwoComponent', () => {
  let component: RecomWfTableTwoComponent;
  let fixture: ComponentFixture<RecomWfTableTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecomWfTableTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecomWfTableTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
