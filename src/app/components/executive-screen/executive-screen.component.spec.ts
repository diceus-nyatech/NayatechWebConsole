import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveScreenComponent } from './executive-screen.component';

describe('ExecutiveScreenComponent', () => {
  let component: ExecutiveScreenComponent;
  let fixture: ComponentFixture<ExecutiveScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
