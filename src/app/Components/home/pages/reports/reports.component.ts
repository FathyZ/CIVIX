import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})


export class ReportsComponent {
  today = new Date();
  regionName = 'Cairo';

  stats = [
    { label: 'Total Issues', value: 243, icon: 'pi pi-exclamation-circle' },
    { label: 'Resolved', value: 181, icon: 'pi pi-check-circle' },
    { label: 'Pending', value: 62, icon: 'pi pi-clock' },
    { label: 'Avg. Resolution Time', value: '2.3 days', icon: 'pi pi-calendar' }
  ];

  issues = [
    {
      title: 'Broken Streetlight',
      no:"1",
      status: 'Resolved',
      location: 'Tahrir Square',
      dateReported: new Date('2025-02-15'),
      assignedTeam: 'Lighting Fixers',
      priority: 'High',
      description: 'Streetlight has been out for 3 days, causing safety concerns.'
    },
    {
      title: 'Broken Streetlight',
      no:"2",
      status: 'Pending',
      location: 'Tahrir Square',
      dateReported: new Date('2025-02-15'),
      assignedTeam: 'Lighting Fixers',
      priority: 'High',
      description: 'Streetlight has been out for 3 days, causing safety concerns.'
    },
    {
      title: 'Pothole',
      no:"1",
      status: 'Pending',
      location: 'Zamalek Main Street',
      dateReported: new Date('2025-03-10'),
      assignedTeam: 'Road Repair Unit',
      priority: 'Medium',
      description: 'Large pothole making the road dangerous for cars.'
    },
    {
      title: 'Pothole',
      no:"2",
      status: 'Resolved',
      location: 'Zamalek Main Street',
      dateReported: new Date('2025-03-10'),
      assignedTeam: 'Road Repair Unit',
      priority: 'Medium',
      description: 'Large pothole making the road dangerous for cars.'
    },

    {
      title: 'Flooding',
      no:"1",
      status: 'Pending',
      location: 'Zamalek Main Street',
      dateReported: new Date('2025-03-10'),
      assignedTeam: 'Road Repair Unit',
      priority: 'Medium',
      description: 'Large pothole making the road dangerous for cars.'
    }
    ,{
      title: 'Pothole',
      no:"3",
      status: 'Denied',
      location: 'Zamalek Main Street',
      dateReported: new Date('2025-03-10'),
      assignedTeam: 'Road Repair Unit',
      priority: 'Medium',
      description: 'Large pothole making the road dangerous for cars.'
    }

  ];

  groupedIssues: { [key: string]: any[] } = {};

  ngOnInit() {
    this.groupIssuesByTitle();
  }
  groupIssuesByTitle() {
    this.groupedIssues = this.issues.reduce((groups, issue) => {
      if (!groups[issue.title]) {
        groups[issue.title] = [];  
      }
      groups[issue.title].push(issue);
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