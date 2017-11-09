import { TestBed, inject } from '@angular/core/testing';

import { GuidGeneratorService } from './guid-generator.service';

describe('GuidGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuidGeneratorService]
    });
  });

  it('should be created', inject([GuidGeneratorService], (service: GuidGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
