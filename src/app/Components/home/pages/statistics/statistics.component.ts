import { Issue, ApiResponse } from './../../../../models/issue';
import { StatisticsService } from './../../../../Services/statistics.service';
import { IssuesService } from './../../../../Services/issues.service';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StatisticsComponent implements OnInit {

  taskPerformanceData: any;
  priorityDistributionData: any;
  issuesCount: any;
  inProgressCount: number = 0;
  barChartData: any;
  lastDayIssuesCount: number = 0;
  unassignedIssuesCount: number = 0;
  allCategories: string[] = ['Pothole', 'Broken streetlight', 'Garbage', 'Graffiti', 'Manhole', 'Unknown'];
  mostCommonIssue: any;

  constructor(private statisticsService: StatisticsService, private router: Router, private issuesService: IssuesService) { }

  ngOnInit(): void {
    this.loadTaskPerformance();
    this.loadPriorityDistribution();
    this.getTotalIssues();
    this.getStatusCounts();
    this.loadCategoryDistribution();
    this.getLastDayIssuesCount();
    this.getUnassignedIssuesCount();
    this.getMostCommonIssue();
  }

  getStatusCounts() {
    this.statisticsService.getIssuesStatusCount().subscribe((data: { name: string, count: number }[]) => {
      const inProgress = data.find(item => item.name === 'InProgress');
      this.inProgressCount = inProgress ? inProgress.count : 0;
    });
  }

  getTotalIssues() {
    this.issuesService.getTotalIssuesCount().subscribe((data) => {
      this.issuesCount = data.totatIssues;
    });
  }

  getLastDayIssuesCount() {
    this.statisticsService.getLastDayIssuesCount().subscribe({
      next: (data) => {
        console.log('Last 24 hours issues count:', data);
        this.lastDayIssuesCount = data.count || 0;
      },
      error: (error) => {
        console.error('Error fetching last 24 hours count:', error);
        this.lastDayIssuesCount = 0;
      }
    });
  }

  getMostCommonIssue() {
    this.statisticsService.getMostCommonIssue().subscribe((data: { name: string; count: number }[]) => {
      if (data && data.length > 0) {
        // Find the issue with the highest count
        this.mostCommonIssue = data.reduce((max, current) => 
          current.count > max.count ? current : max
        );
      } else {
        // Default value when no data is available
        this.mostCommonIssue = { name: 'No data', count: 0 };
      }
    });
  }

  getUnassignedIssuesCount() {
    this.statisticsService.getUnassignedIssuesCount().subscribe({
      next: (count) => {
        console.log('Unassigned issues count:', count);
        this.unassignedIssuesCount = count;
      },
      error: (error) => {
        console.error('Error getting unassigned issues count:', error);
        this.unassignedIssuesCount = 0;
      }
    });
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
      // Define all possible priorities, even with 0 values.
      const allPriorities = ['High', 'Medium', 'Low'];
      const priorityData = allPriorities.map(priority => {
        const priorityItem = data.find(item => item.name === priority);
        return priorityItem ? priorityItem.count : 0;
      });

      // Update the chart data
      this.priorityDistributionData = {
        labels: allPriorities,
        datasets: [
          {
            data: priorityData,
            backgroundColor: ['#FF3B30', '#FFCC00', '#34C759'],
          },
        ],
      };
    });
  }

  DoughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          padding: 20,
          color: 'white',
          font: {
            weight: 'bold', // Make text bold
            size: 13, // Adjust font size if needed
          },
        },
        position: 'bottom'
      }
    },
    onClick: (event: any, elements: any, chart: any) => {
      if (elements && elements.length > 0) {
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
          stepSize: 5, // Adjust steps as needed
          color: 'white',
          font: {
            size: 14
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // ✅ Light gray grid lines
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)' // ✅ Light gray border line
        }
      },
      y: {
        ticks: {
          stepSize: 5,
          color: 'white',
          font: {
            size: 20, // ✅ Make labels more visible
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // ✅ Light gray grid lines
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)' // ✅ Light gray border line
        }
      }
    },
    elements: {
      bar: {
        barThickness: 5,
        borderRadius: 20,
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  verticalBarOptions = {
    responsive:true,
    maintainAspectRatio:false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Adjust steps as needed
          color: 'black',
          font: {
            size: 14
          }
        }
      },
      y: {
        ticks: {
          stepSize: 10,
          color: 'black',
          font: {
            size: 14, // ✅ Make labels more visible
            weight: 'bold'
          }
        }
      }
    },
    elements: {
      bar: {
        barThickness: 2,
        borderRadius: 30,
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }

  }


  loadCategoryDistribution() {
    this.issuesService.getAllIssuesData().subscribe((response: ApiResponse) => {
      const issues: Issue[] = response.data || [];
  
      // Define the full list of expected categories
      const allCategories = [
        'Pothole',
        'Broken streetlight',
        'Garbage',
        'Graffiti',
        'Manhole',
        'Unknown'
      ];
  
      // Initialize a map with all categories set to 0
      const categoryCountMap: { [key: string]: number } = {};
      allCategories.forEach(category => {
        categoryCountMap[category] = 0;
      });
  
      // Count actual issues in each category
      issues.forEach((issue: Issue) => {
        if (categoryCountMap.hasOwnProperty(issue.category)) {
          categoryCountMap[issue.category]++;
        }
      });
  
      // Prepare data for the chart
      const categoryData = allCategories.map(category => categoryCountMap[category]);
  
      this.barChartData = {
        labels: allCategories,
        datasets: [
          {
            data: categoryData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9575CD', '#FF7043']
          }
        ]
      };
    });
  }
  




}