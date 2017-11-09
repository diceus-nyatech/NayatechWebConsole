import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDescriptionComponent } from './feature-description.component';

describe('FeatureDescriptionComponent', () => {
  let component: FeatureDescriptionComponent;
  let fixture: ComponentFixture<FeatureDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
