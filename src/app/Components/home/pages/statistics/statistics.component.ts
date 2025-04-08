import { Issue, ApiResponse } from './../../../../models/issue';
import { StatisticsService } from './../../../../Services/statistics.service';
import { IssuesService } from './../../../../Services/issues.service';
import { Component, ViewEncapsulation,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { response } from 'express';


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StatisticsComponent implements OnInit{

  taskPerformanceData:any;
  priorityDistributionData:any;
  issuesCount:any;
  inProgressCount: number = 0;


  

  constructor(private statisticsService: StatisticsService, private router: Router, private issuesService: IssuesService){}

  ngOnInit(): void {
    this.loadTaskPerformance();
    this.loadPriorityDistribution();
    this.getTotalIssues();
    this.getStatusCounts();
  }

  getStatusCounts() {
    this.statisticsService.getIssuesStatusCount().subscribe((data: { name: string, count: number }[]) => {
      const inProgress = data.find(item => item.name === 'InProgress');
      this.inProgressCount = inProgress ? inProgress.count : 0;
    });
  }


  getTotalIssues(){
    this.issuesService.getTotalIssuesCount().subscribe((data) => {
      this.issuesCount = data.count;
    })

  }

  loadTaskPerformance() {
    this.statisticsService.getTaskPerformance().subscribe((data: { name: string; count: number }[]) => {
      
  
      if (data && data.length) {
        this.taskPerformanceData = {
          labels: data.map((item) => item.name), 
          datasets: [
            {
              data: data.map((item) => item.count), 
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        };
      } 
    });
  }
  
  loadPriorityDistribution() {
    this.statisticsService.getPriorityDistribution().subscribe((data: { name: string; count: number }[]) => {
      if (data && data.length) {
        this.priorityDistributionData = {
          labels: data.map((item) => item.name),
          datasets: [
            {
              data: data.map((item) => item.count),
              backgroundColor: ['#dc3545', '#8B0000', '#FFFF00']
            }
          ]
        };
      }
    });
  }


  DoughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          padding:20,
          color: 'white' ,
          font: {
            weight: 'bold', // Make text bold
            size: 13, // Adjust font size if needed
          },
        },
        position: 'bottom' 
      }

      
    },
    onClick: (event: any, elements: any, chart: any) => {
      console.log('Chart clicked!', event, elements);
    
      if (elements && elements.length > 0) {
        console.log('Navigating to Active Issues page...');
        this.router.navigate(['/home/active-issues']);
      }
    },
  };

  // BarChart


  
  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // ✅ Makes it horizontal
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 20, // Adjust steps as needed
          color: 'white',
          font: {
            size: 14
          }
        }
      },
      y: {
        ticks: {
          color: 'white',
          font: {
            size: 20, // ✅ Make labels more visible
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  


  issues = [
    { issueCount: 26, name: 'Pothole', priority: 'High', status: 'Open' },
    { issueCount: 13, name: 'Streetlight Out', priority: 'Medium', status: 'In Progress' },
    { issueCount: 41, name: 'Garbage Collection', priority: 'Low', status: 'Resolved' }
  ];

}
