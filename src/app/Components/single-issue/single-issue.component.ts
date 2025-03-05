import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from '../../models/issue';
import { IssuesService } from '../../Services/issues.service';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-issue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-issue.component.html',
  styleUrl: './single-issue.component.scss'
})
export class SingleIssueComponent implements OnInit {
  issue: any;  // Will hold the fetched issue

  constructor(private route: ActivatedRoute, private issueService: IssuesService) {}

  ngOnInit() {
    const issueId = this.route.snapshot.paramMap.get('id'); // Get issue ID from URL

    if (!issueId) {
      console.error('No issue ID found in URL');
      return;
    }

    console.log('Fetching issue with ID:', issueId); // Debugging log

    this.issueService.getIssueById(issueId).subscribe(
      async (data) => {
        console.log('Issue data received:', data); // Check if API returns data
        this.issue = data;





        // Initialize Leaflet dynamically ONLY AFTER FETCHING DATA!!! 
        if (typeof window !== 'undefined') {
          const leaflet = await import('leaflet');
          this.L = leaflet; // Store the module

          // Initialize the map with the issue's latitude and longitude
          this.initMap(this.issue.latitude, this.issue.longitude);
        }
      },
      (error) => {
        console.error('Error fetching issue:', error);
      }
    );
  }

  private map!: L.Map;
  private L!: any; // Store Leaflet dynamically

  private initMap(lat: number, lng: number): void {
    this.map = this.L.map('map').setView([lat, lng], 15);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = new this.L.Icon({
      iconUrl: '../../../../../assets/marker-icon-2x.png',
      shadowUrl: '../../../../../assets/marker-shadow.png',
      iconSize: [25, 41],  // Default Leaflet icon size
      iconAnchor: [12, 41],  // Point where the icon is anchored
      popupAnchor: [1, -34], // Point where the popup opens
      shadowSize: [41, 41]   // Size of shadow
    });

    this.L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
  }
}