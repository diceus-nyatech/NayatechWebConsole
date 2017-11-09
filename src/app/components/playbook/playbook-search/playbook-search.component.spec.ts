import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybookSearchComponent } from './playbook-search.component';

describe('PlaybookSearchComponent', () => {
  let component: PlaybookSearchComponent;
  let fixture: ComponentFixture<PlaybookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaybookSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaybookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
