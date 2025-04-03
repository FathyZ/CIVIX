import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { IssuesService } from '../../../../Services/issues.service';
import { ApiResponse, Issue } from '../../../../models/issue';
import { forkJoin } from 'rxjs';
import { GeocodingService } from '../../../../Services/geocoding.service'; // Import GeocodingService for address lookup

@Component({
  standalone: true,
  selector: 'app-active-issues',
  templateUrl: './active-issues.component.html',
  styleUrls: ['./active-issues.component.scss'],
  imports: [CommonModule, TableModule, InputTextModule, TagModule]
})
export class ActiveIssuesComponent implements OnInit {

  issues: Issue[] = [];
  private addressCache = new Map<string, string>(); // Cache for addresses

  constructor(private router: Router, private IssuesService: IssuesService, private geocodingService: GeocodingService) {}

  getPriorityClass(priority: string) {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-danger fw-bold';
      case 'medium': return 'text-warning fw-bold';
      case 'low': return 'text-success fw-bold';
      default: return '';
    }
  }

  viewIssue(id: string) { 
    this.router.navigate(['/home/issue', id]);
  }

  ngOnInit(): void { 
    this.fetchIssues();  
  }

  fetchIssues() {
    this.issues = []; // Clear the array to prevent duplicate issues

    this.IssuesService.getIssues(1, 5).subscribe((response: ApiResponse) => {
      const totalIssues = response.totatIssues;
      const pageSize = response.pageSize;
      const totalPages = Math.ceil(totalIssues / pageSize);

      let requests = [];
      for (let page = 1; page <= totalPages; page++) {
        requests.push(this.IssuesService.getIssues(page, pageSize));
      }

      forkJoin(requests).subscribe(results => {
        this.issues = results.flatMap(res => res.data); // Merge all pages into one array

        // Handle address fetching for each issue
        this.issues.forEach((issue) => {
          const cacheKey = `${issue.latitude},${issue.longitude}`;
          if (this.addressCache.has(cacheKey)) {
            issue.address = this.addressCache.get(cacheKey); // Use cached address if available
          } else {
            this.geocodingService.getAddressFromCoords(issue.latitude, issue.longitude)
          .subscribe((address: string) => {
            issue.address = address; // Directly assign the fetched address
            console.log(`Fetched Address: ${address}`);
            this.addressCache.set(cacheKey, address); // Cache the address

              });
          }
        });
      });
    });
  }

  filterTable(event: Event, dt: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt.filterGlobal(inputValue, 'contains');
  }

  goToIssue(event: any) {
    this.router.navigate(['/issue', event.data.id]);
  }
}
