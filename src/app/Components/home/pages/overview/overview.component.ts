import { resolve } from 'node:path';
import { GeocodingService } from './../../../../Services/geocoding.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, NgModel } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { IssuesService } from '../../../../Services/issues.service';
import { FixingTeamsService } from '../../../../Services/fixing-teams.service';
import { ApiResponse, Issue } from '../../../../models/issue';
import { ChangeDetectorRef } from '@angular/core';
import { FixingTeam } from '../../../../models/fixingTeams';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TableModule, CommonModule, MultiSelectModule, FormsModule, TagModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, AfterViewInit {
  issues: Issue[] = []; // Will hold the fetched issues
  totalIssues: number = 0;
  resolvedIssues : number =0; // Count resolved issues 
  teamNumber: number = 0; 
  openTeamsNumber: number = 0; // Count open teams
  busyTeamsNumber: number = 0;
  productivity: number = 0; // Productivity percentage
  private addressCache = new Map<string, string>(); // ✅ Caching for reverse geocoding
  private map!: L.Map;
  private L!: any; // Store Leaflet dynamically
  private markers: L.Marker[] = []; // Declare an array to store markers

  constructor(private router: Router, private issueService: IssuesService, private geocodingService: GeocodingService,private cdRef: ChangeDetectorRef , private fixingTeamService: FixingTeamsService) {}

  ngOnInit(): void {
    this.fetchIssues();
    this.fetchTeamInfo();
  }

  
  fetchTeamInfo(){
    this.fixingTeamService.getAllTeams().subscribe((response: any) => {
      this.teamNumber = response.length;
      this.busyTeamsNumber = response.filter((team: any) => team.availabilityStatus == "Busy").length;
      this.openTeamsNumber = this.teamNumber - this.busyTeamsNumber; // Calculate open teams
    },
    (error) => {
      console.log("Error fetching teams:", error);
    });
  }
    


 fetchIssues() {
  this.issueService.getIssues().subscribe((response: ApiResponse) => {
    this.issues = response.data;
    this.totalIssues = response.totatIssues;
    this.resolvedIssues = this.issues.filter((issue) => issue.status === 'Resolved').length;
    this.productivity = Math.round((this.resolvedIssues / this.totalIssues) * 100); // Calculate productivity percentage
    console.log("productivity:", this.productivity);
    console.log("Resolved Issues:", this.resolvedIssues);
    this.issues.forEach((issue) => {
      const cacheKey = `${issue.latitude},${issue.longitude}`;
      if (this.addressCache.has(cacheKey)) {
        issue.address = this.addressCache.get(cacheKey); // Use cached address if available
      } else {
        this.geocodingService.getAddressFromCoords(issue.latitude, issue.longitude)
          .subscribe((address: string) => {
            issue.address = address; // Directly assign the fetched address
            console.log(`Fetched Address: ${address}`);
            this.addressCache.set(cacheKey, address); // Cache the address

            // Manually trigger change detection to update the UI (if necessary)
            // this.cdRef.detectChanges();
          });
      }
    });

    console.log(response); // Log the issues to the console for debugging
    if (this.map) {
      this.addMarkers();
      this.fitMapToMarkers();
    }
  },
  (error) => {
    console.log(error); // Log any errors to the console for debugging
  });
}

  // Adds markers on the map for the issues
  private addMarkers(): void {
    if (!this.map) return;

    const customIcon = new this.L.Icon({
      iconUrl: '../../../../../assets/marker-icon-2x.png',
      shadowUrl: '../../../../../assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add markers after issues are fetched
    this.issues.forEach((issue, index) => {
      if (issue.latitude && issue.longitude) {
        const marker = this.L.marker([issue.latitude, issue.longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup((index + 1).toString()); // Show issue index in popup

        this.markers.push(marker); // Store marker in array
      }
    });
  }

  // Adjusts the map's zoom and bounds to fit all markers
  private fitMapToMarkers() {
    if (!this.issues.length) return;

    const bounds = this.L.latLngBounds(this.issues.map((issue) => [issue.latitude, issue.longitude]));
    this.map.fitBounds(bounds); // Adds padding to prevent tight zoom-in
  }

  // Initialize Leaflet after the view is initialized
  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') {
      const leaflet = await import('leaflet'); // Dynamically import Leaflet library
      this.L = leaflet; // Store the module
      this.initMap();
    }
  }

  // Initializes the map with Leaflet and adds markers
  private initMap(): void {
    this.map = this.L.map('map').setView([30.0784937, 31.6578639], 15);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const customIcon = new this.L.Icon({
      iconUrl: '../../../../../assets/marker-icon-2x.png',
      shadowUrl: '../../../../../assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.issues.forEach((issue, index) => {
      if (issue.latitude && issue.longitude) {
        const marker = this.L.marker([issue.latitude, issue.longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup((index + 1).toString()); // Show issue index in popup

        this.markers.push(marker); // Store marker in array
      }
    });
  }

  // Determines CSS class based on issue priority
  getPriorityClass(priority: string) {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-danger fw-bold';
      case 'medium':
        return 'text-warning fw-bold';
      case 'low':
        return 'text-success fw-bold';
      default:
        return '';
    }
  }

  // Navigate to the single issue page
  viewIssue(id: string) {
    this.router.navigate(['/home/issue', id]);
  }
}
