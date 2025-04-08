import { TestBed } from '@angular/core/testing';

import { FixingTeamsService } from './fixing-teams.service';

describe('FixingTeamsService', () => {
  let service: FixingTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixingTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
