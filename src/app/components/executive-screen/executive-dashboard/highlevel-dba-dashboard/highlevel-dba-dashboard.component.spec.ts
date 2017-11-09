import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlevelDbaDashboardComponent } from './highlevel-dba-dashboard.component';

describe('HighlevelDbaDashboardComponent', () => {
  let component: HighlevelDbaDashboardComponent;
  let fixture: ComponentFixture<HighlevelDbaDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlevelDbaDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlevelDbaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
