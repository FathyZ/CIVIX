import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IssuesService } from '../../../../Services/issues.service';
import { ApiResponse, Issue } from '../../../../models/issue';
import { GeocodingService } from '../../../../Services/geocoding.service';

@Component({
  standalone: true,
  selector: 'app-active-issues',
  templateUrl: './active-issues.component.html',
  styleUrls: ['./active-issues.component.scss'],
  imports: [CommonModule, TableModule, InputTextModule, TagModule],
})
export class ActiveIssuesComponent implements OnInit {
  issues: Issue[] = [];
  private addressCache = new Map<string, string>();

  constructor(
    private router: Router,
    private IssuesService: IssuesService,
    private geocodingService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.fetchIssues();
  }

  fetchIssues() {
    this.issues = [];

    this.IssuesService.getAllIssuesData().subscribe((response: ApiResponse) => {
      this.issues = response.data;

      this.issues.forEach((issue) => {
        const cacheKey = `${issue.latitude},${issue.longitude}`;
        if (this.addressCache.has(cacheKey)) {
          issue.address = this.addressCache.get(cacheKey)!;
        } else {
          this.geocodingService.getAddressFromCoords(issue.latitude, issue.longitude).subscribe((address: string) => {
            issue.address = address;
            this.addressCache.set(cacheKey, address);
          });
        }
      });
    });
  }

  filterTable(event: Event, dt: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt.filterGlobal(inputValue, 'contains');
  }

  viewIssue(id: string) {
    this.router.navigate(['/home/issue', id]);
  }

  getPriorityClass(priority: string) {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-danger fw-bold';
      case 'medium':
        return 'text-warning fw-bold';
      case 'low':
        return 'text-success fw-bold';
      default:
        return '';
    }
  }
}