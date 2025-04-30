import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixingTeamIssuesComponent } from './fixing-team-issues.component';

describe('FixingTeamIssuesComponent', () => {
  let component: FixingTeamIssuesComponent;
  let fixture: ComponentFixture<FixingTeamIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixingTeamIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixingTeamIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});