import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleIssueReportComponent } from './single-issue-report.component';

describe('SingleIssueReportComponent', () => {
  let component: SingleIssueReportComponent;
  let fixture: ComponentFixture<SingleIssueReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleIssueReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleIssueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});