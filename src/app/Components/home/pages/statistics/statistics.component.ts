import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartModule, TableModule, CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StatisticsComponent {

  doughnutChartData = {
    labels: ['Completed 78%', 'Behind 12%', 'In Progress 10%'],
    datasets: [
      {
        label: 'No. of Issues',
        data: [300, 50, 100], 
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',  
          'rgba(54, 162, 235, 0.5)',  
          'rgba(153, 102, 255, 0.5)', 
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 3
      }
    ]
  };

  DoughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white' 
        },
        position: 'bottom' 
      }
    }
  };

  // BarChart


  barChartData = {
    labels: ['Satisfied', 'Neutral', 'Dissatisfied'], // Categories
    datasets: [
      {
        label: 'User Reviews',
        data: [120, 50, 30], // Number of votes (change these values dynamically)
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'], // Green, Yellow, Red
        borderRadius: 80, // Rounded edges for bars
      }
    ]
  };
  
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
  
  // TABLE FOR MOST REPORTED ISSUES

  reportedIssues = [
    { id: 101, name: 'Pothole on Main St', priority: 'High'},
    { id: 102, name: 'Streetlight Outage', priority: 'Medium'},
    { id: 103, name: 'Garbage Overflow', priority: 'Low',},
    { id: 104, name: 'Broken Traffic Light', priority: 'High'}
  ];

}
