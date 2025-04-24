import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssuesService } from '../../Services/issues.service';
import { GeocodingService } from '../../Services/geocoding.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-issue-report',
  standalone: true,
  templateUrl: './single-issue-report.component.html',
  styleUrl: './single-issue-report.component.scss',
  imports: [CommonModule], 
})
export class SingleIssueReportComponent implements OnInit {
  issue: any;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssuesService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    const issueId = this.route.snapshot.paramMap.get('id');
    if (!issueId) return;

    this.issueService.getIssueById(issueId).subscribe(issue => {
      this.issue = issue;

      this.geocodingService.getAddressFromCoords(issue.latitude, issue.longitude).subscribe(
        address => this.issue.address = address,
        err => console.error(err)
      );
    });
  }
}
