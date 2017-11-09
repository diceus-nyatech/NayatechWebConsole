import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedDbaDashboardComponent } from './detailed-dba-dashboard.component';

describe('DetailedDbaDashboardComponent', () => {
  let component: DetailedDbaDashboardComponent;
  let fixture: ComponentFixture<DetailedDbaDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedDbaDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedDbaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
