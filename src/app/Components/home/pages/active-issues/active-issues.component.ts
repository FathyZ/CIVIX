import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-active-issues',
    templateUrl: './active-issues.component.html',
    styleUrls: ['./active-issues.component.scss'],
    imports: [CommonModule, TableModule, InputTextModule, TagModule]
})
export class ActiveIssuesComponent {
    issues = [
        { id: 1, name: 'Pothole', location: 'Downtown Cairo', imageUrl: '../../../../../assets/civix_tastot.png', teamAssigned: 'Road Team', timeSubmitted: '2 hours ago', status: 'In Progress' },
        { id: 2, name: 'Streetlight Outage', location: 'Zahraa Nasr City', imageUrl: '../../../../../assets/civix_ 1.png', teamAssigned: 'Electricians', timeSubmitted: '5 hours ago', status: 'Pending' },
        { id: 3, name: 'Flooded Road', location: 'ElMaadi', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 4, name: 'Graffiti', location: 'Nasr City', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 5, name: 'Flooded Road', location: 'Al Shorouk', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 6, name: 'Electric Hazard', location: 'Masr ElGdeda', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 7, name: 'Flooded Road', location: 'Faisal', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 8, name: 'Flooded Road', location: 'Gelim Bay', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 9, name: 'Flooded Road', location: 'Downtown Cairo', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 10, name: 'Flooded Road', location: 'Zahraa Nasr City', imageUrl: '../../../../../assets/Background.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
        { id: 11, name: 'Flooded Road', location: 'Al Shorouk', imageUrl: '../../../../../assets/civix_testting.png', teamAssigned: 'Emergency', timeSubmitted: '1 day ago', status: 'Resolved' },
    ];

    constructor(private router: Router) {}


    // Filter function for the table
    filterTable(event: Event, dt: any) {
        const inputValue = (event.target as HTMLInputElement).value;
        dt.filterGlobal(inputValue, 'contains');
    }

    // Navigate to Single Issue Page
    goToIssue(event: any) {
        this.router.navigate(['/issue', event.data.id]);
    }

    // Get status color
    getSeverity(status: string): any {
      const severityMap: { [key: string]: string } = {
          'in progress': 'info',
          'pending': 'danger',
          'resolved': 'success',
      };
  
      return severityMap[status.toLowerCase()] || 'secondary'; 
  }
  
  
}
