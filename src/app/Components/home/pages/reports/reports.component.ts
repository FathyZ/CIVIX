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
      status: 'Resolved',
      location: 'Tahrir Square',
      dateReported: new Date('2025-02-15'),
      assignedTeam: 'Lighting Fixers',
      priority: 'High',
      description: 'Streetlight has been out for 3 days, causing safety concerns.'
    },
    {
      title: 'Pothole on Main Road',
      status: 'Pending',
      location: 'Zamalek Main Street',
      dateReported: new Date('2025-03-10'),
      assignedTeam: 'Road Repair Unit',
      priority: 'Medium',
      description: 'Large pothole making the road dangerous for cars.'
    }
  ];

  downloadReport() {
    const content = document.getElementById('report-content');

    if (content) {
      html2canvas(content, {
        scale: 3, 
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.8); 
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let position = 0;

        if (imgHeight > pageHeight) {
          // If content is taller than one page, slice into pages
          let heightLeft = imgHeight;

          while (heightLeft > 0) {
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            if (heightLeft > 0) {
              pdf.addPage();
              position = - (imgHeight - heightLeft);
            }
          }
        } else {
          // Fits in one page
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }

        pdf.save('report.pdf');
      });
    }
  }
}
