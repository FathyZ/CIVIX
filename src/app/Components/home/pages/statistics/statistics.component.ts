import { Issue, ApiResponse } from './../../../../models/issue';
import { StatisticsService } from './../../../../Services/statistics.service';
import { IssuesService } from './../../../../Services/issues.service';
import { Component, ViewEncapsulation, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnInit {

  // Loading states
  isLoadingCards = true;
  isLoadingCharts = true;
  isLoadingCategory = true;

  taskPerformanceData: any;
  priorityDistributionData: any;
  issuesCount: any;
  inProgressCount: number = 0;
  barChartData: any;
  lastDayIssuesCount: number = 0;
  unassignedIssuesCount: number = 0;
  allCategories: string[] = ['Pothole', 'Broken streetlight', 'Garbage', 'Graffiti', 'Manhole', 'Unknown'];
  mostCommonIssue: any;

  constructor(
    private statisticsService: StatisticsService, 
    private router: Router, 
    private issuesService: IssuesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Load data progressively to prevent lag
    this.loadCardData();
    setTimeout(() => this.loadChartData(), 100);
    setTimeout(() => this.loadCategoryDistribution(), 300);
  }

  // Load card data first (most important)
  loadCardData(): void {
    this.isLoadingCards = true;
    
    forkJoin({
      statusCounts: this.statisticsService.getIssuesStatusCount().pipe(
        catchError(error => {
          console.error('Error loading status counts:', error);
          return of([]);
        })
      ),
      totalIssues: this.issuesService.getTotalIssuesCount().pipe(
        catchError(error => {
          console.error('Error loading total issues:', error);
          return of({ totatIssues: 0 });
        })
      ),
      lastDayCount: this.statisticsService.getLastDayIssuesCount().pipe(
        catchError(error => {
          console.error('Error loading last day count:', error);
          return of({ count: 0 });
        })
      ),
      unassignedCount: this.statisticsService.getUnassignedIssuesCount().pipe(
        catchError(error => {
          console.error('Error loading unassigned count:', error);
          return of(0);
        })
      ),
      mostCommon: this.statisticsService.getMostCommonIssue().pipe(
        catchError(error => {
          console.error('Error loading most common issue:', error);
          return of([]);
        })
      )
    }).pipe(
      finalize(() => {
        this.isLoadingCards = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        // Process status counts
        const inProgress = data.statusCounts.find((item: any) => item.name === 'InProgress');
        this.inProgressCount = inProgress ? inProgress.count : 0;

        // Process total issues
        this.issuesCount = data.totalIssues.totatIssues;

        // Process last day count
        this.lastDayIssuesCount = data.lastDayCount.count || 0;

        // Process unassigned count
        this.unassignedIssuesCount = data.unassignedCount;

        // Process most common issue
        if (data.mostCommon && data.mostCommon.length > 0) {
          this.mostCommonIssue = data.mostCommon.reduce((max: any, current: any) => 
            current.count > max.count ? current : max
          );
        } else {
          this.mostCommonIssue = { name: 'No data', count: 0 };
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading card data:', error);
        this.setDefaultCardValues();
        this.cdr.detectChanges();
      }
    });
  }

  // Load chart data second (secondary priority)
  loadChartData(): void {
    this.isLoadingCharts = true;

    forkJoin({
      taskPerformance: this.statisticsService.getTaskPerformance().pipe(
        catchError(error => {
          console.error('Error loading task performance:', error);
          return of([]);
        })
      ),
      priorityDistribution: this.statisticsService.getPriorityDistribution().pipe(
        catchError(error => {
          console.error('Error loading priority distribution:', error);
          return of([]);
        })
      )
    }).pipe(
      finalize(() => {
        this.isLoadingCharts = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (data) => {
        this.processTaskPerformanceData(data.taskPerformance);
        this.processPriorityDistributionData(data.priorityDistribution);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.cdr.detectChanges();
      }
    });
  }

  private setDefaultCardValues(): void {
    this.inProgressCount = 0;
    this.issuesCount = 0;
    this.lastDayIssuesCount = 0;
    this.unassignedIssuesCount = 0;
    this.mostCommonIssue = { name: 'No data', count: 0 };
  }

  private processTaskPerformanceData(data: { name: string; count: number }[]): void {
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
  }

  private processPriorityDistributionData(data: { name: string; count: number }[]): void {
    const allPriorities = ['High', 'Medium', 'Low'];
    const priorityData = allPriorities.map(priority => {
      const priorityItem = data.find(item => item.name === priority);
      return priorityItem ? priorityItem.count : 0;
    });

    this.priorityDistributionData = {
      labels: allPriorities,
      datasets: [
        {
          data: priorityData,
          backgroundColor: ['#FF3B30', '#FFCC00', '#34C759'],
        },
      ],
    };
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
    this.isLoadingCategory = true;
    
    this.issuesService.getAllIssuesData().pipe(
      catchError(error => {
        console.error('Error loading category distribution:', error);
        return of({ data: [] as Issue[], count: 0, pageIndex: 0, pageSize: 0, totatIssues: 0 } as ApiResponse);
      }),
      finalize(() => {
        this.isLoadingCategory = false;
        this.cdr.detectChanges();
      })
    ).subscribe((response: ApiResponse) => {
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
      
      this.cdr.detectChanges();
    });
  }
}