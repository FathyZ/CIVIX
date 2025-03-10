import { Component,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { OnInit } from '@angular/core';
import { IssuesService } from '../../../../Services/issues.service';
import { ApiResponse, Issue } from '../../../../models/issue';

@Component({
    standalone: true,
    selector: 'app-active-issues',
    templateUrl: './active-issues.component.html',
    styleUrls: ['./active-issues.component.scss'],
    imports: [CommonModule, TableModule, InputTextModule, TagModule]
})
export class ActiveIssuesComponent implements OnInit {


    constructor(private router: Router, private IssuesService: IssuesService) {}




    issues: Issue[] = [];

    getPriorityClass(priority: string) {
      switch (priority.toLowerCase()) {
        case 'high': return 'text-danger fw-bold';
        case 'medium': return 'text-warning fw-bold';
        case 'low': return 'text-success fw-bold';
        default: return '';
      }
    }

    viewIssue(id: string) { // Redirect to the single issue page
      this.router.navigate(['/home/issue', id]);
    }

    ngOnInit(): void { // Fetch issues when the component is initialized
      this.fetchIssues();  
    }

    fetchIssues() { // Fetch issues from the API
      this.IssuesService.getIssues(10).subscribe((response: ApiResponse) => { // Subscribe to the API response
        this.issues = response.data; // Access the `data` property
        console.log(this.issues);// Log the issues to the console for debugging
      }, (error) => {
        console.log(error); // Log any errors to the console for debugging
      });
    }

    

    filterTable(event: Event, dt: any) {
      const inputValue = (event.target as HTMLInputElement).value;
      dt.filterGlobal(inputValue, 'contains');
  }
  
    // Navigate to Single Issue Page
    goToIssue(event: any) {
        this.router.navigate(['/issue', event.data.id]);
    }

}
