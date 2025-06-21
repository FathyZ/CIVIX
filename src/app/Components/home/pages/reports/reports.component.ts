import { AuthService } from './../../../../Services/auth.service';
import { IssuesService } from './../../../../Services/issues.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ApiResponse, Issue } from '../../../../models/issue';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})


export class ReportsComponent {
  today = new Date();
  area :string = '';
   issues2: Issue[] = []; 
    totalIssues: number = 0;
    resolvedIssues : number =0;
    unresolvedIssues: number = 0;
  
  constructor(private IssuesService: IssuesService , private AuthService: AuthService) {}
  ngOnInit() {
    this.groupIssuesByCategory(); // move this here
    this.getissues();
     const admin = this.AuthService.getAdminInfo();
    if (admin) {
      this.area = admin.area;
      console.log( "Area Is : " + this.area);
  }}

getissues(){
  this.IssuesService.getIssues().subscribe({
    next: (response: ApiResponse) => {
      this.issues2 = response.data;
      this.totalIssues = response.totatIssues;
      this.resolvedIssues = this.issues2.filter((issue) => issue.status === 'Resolved').length;
      this.unresolvedIssues = this.totalIssues - this.resolvedIssues;

      this.groupIssuesByCategory(); // move this here
    },
    error: (error) => {
      console.error('Error fetching issues:', error);
    }
  });
}

  stats = [
    { label: 'Total Issues', value: this.totalIssues, icon: 'pi pi-exclamation-circle' },
    { label: 'Resolved', value: this.resolvedIssues, icon: 'pi pi-check-circle' },
    { label: 'Pending', value:this.unresolvedIssues, icon: 'pi pi-clock' },
    { label: 'Avg. Resolution Time', value: '2.3 days', icon: 'pi pi-calendar' }
  ];

  // issues = [
  //   {
  //     title: 'Garbage',
  //     no:"1",
  //     status: 'resolved',
  //     location: 'Al Shohda Road, Cairo, 11837, Egypt',
  //     dateReported:  'Monday, June 16, 2025',
  //     assignedTeam: 'Garbage Team',
  //     priority: 'Medium',
  //     description: 'Garbage in the street causing bad smell'
  //   }

  // ];

  groupedIssues: { [key: string]: any[] } = {};


//   groupIssuesByTitle() {
//   this.groupedIssues = this.issues2.reduce((groups, issue) => {
//     if (!groups[issue.title]) {
//       groups[issue.title] = [];  
//     }
//     groups[issue.title].push({
//       no: groups[issue.title].length + 1,
//       location: `${issue.area ?? ''}`,
//       dateReported: issue.createdOn,
//       priority: issue.priority,
//       description: issue.description,
//       assignedTeam: issue.fixingTeamName ?? 'Unassigned',
//       status: issue.status
//     });
//     return groups;
//   }, {} as { [key: string]: any[] });
// }


groupIssuesByCategory() {
  this.groupedIssues = this.issues2.reduce((groups, issue) => {
    const category = issue.category || 'Uncategorized';

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push({
      no: groups[category].length + 1,
      location: `${issue.area ?? ''}`,
      dateReported: issue.createdOn,
      priority: issue.priority,
      description: issue.description,
      assignedTeam: issue.fixingTeamName ?? 'Unassigned',
      status: issue.status
    });

    return groups;
  }, {} as { [key: string]: any[] });
}

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'green';
      case 'pending':
        return 'orange';
      case 'denied':
        return 'red';
      default:
        return 'black';
    }
  }

  downloadReport() {
    const headerElement = document.getElementById('report-header');
    const tableElements = document.querySelectorAll('.issue-table-wrapper');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
  
    // 1. Capture the header section
    html2canvas(headerElement!, { scale: 3, useCORS: true }).then(headerCanvas => {
      const headerImg = headerCanvas.toDataURL('image/jpeg', 1.0);
      const headerHeight = (headerCanvas.height * (pageWidth - 2 * margin)) / headerCanvas.width;
  
      // Draw background color for first page
      pdf.setFillColor(240, 244, 248);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
      // Add header image to first page
      pdf.addImage(headerImg, 'JPEG', margin, margin, pageWidth - 2 * margin, headerHeight);
  
      const processNext = (index: number) => {
        if (index >= tableElements.length) {
          pdf.save('report.pdf');
          return;
        }
  
        const element = tableElements[index] as HTMLElement;
  
        html2canvas(element, { scale: 3, useCORS: true }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const imgHeight = (canvas.height * (pageWidth - 2 * margin)) / canvas.width;
  
          pdf.addPage();
  
          // Set background color for the new page
          pdf.setFillColor(240, 244, 248);
          pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
          // Draw table image
          pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, imgHeight);
  
          processNext(index + 1);
        });
      };
  
      processNext(0);
    });
  }
}