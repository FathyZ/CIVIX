import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { IssuesService } from '../../../../Services/issues.service';
import { GeocodingService } from './../../../../Services/geocoding.service';
import { FixingTeamsService } from '../../../../Services/fixing-teams.service';
import { ApiResponse, Issue } from '../../../../models/issue';
import { FixingTeam } from '../../../../models/fixingTeams';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TableModule, CommonModule, MultiSelectModule, FormsModule, TagModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, AfterViewInit {
  issues: Issue[] = [];
  totalIssues: number = 0;
  resolvedIssues: number = 0;
  teamNumber: number = 0;
  openTeamsNumber: number = 0;
  busyTeamsNumber: number = 0;
  productivity: number = 0;
  private addressCache = new Map<string, string>();
  private map!: L.Map;
  private L!: any;
  private markers: L.Marker[] = [];
  isBrowser = false;

  constructor(
    private router: Router,
    private issueService: IssuesService,
    private geocodingService: GeocodingService,
    private cdRef: ChangeDetectorRef,
    private fixingTeamService: FixingTeamsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchIssues();
    this.fetchTeamInfo();
  }

async ngAfterViewInit(): Promise<void> {
  if (!this.isBrowser) return;

  try {
    const leaflet = await import('leaflet');
    this.L = leaflet.default ?? leaflet; // ✅ This line is critical
    this.initMap();
  } catch (err) {
    console.error('Leaflet failed to load:', err);
  }
}

  fetchTeamInfo() {
    this.fixingTeamService.getAllTeams().subscribe(
      (response: any) => {
        this.teamNumber = response.length;
        this.busyTeamsNumber = response.filter((team: any) => team.availabilityStatus === 'Busy').length;
        this.openTeamsNumber = this.teamNumber - this.busyTeamsNumber;
      },
      (error) => {
        console.log('Error fetching teams:', error);
      }
    );
  }

  fetchIssues() {
    this.issueService.getIssues().subscribe(
      (response: ApiResponse) => {
        this.issues = response.data;
        this.totalIssues = response.totatIssues;
        this.resolvedIssues = this.issues.filter((issue) => issue.status === 'Resolved').length;
        this.productivity = this.totalIssues > 0 ? Math.round((this.resolvedIssues / this.totalIssues) * 100) : 0;

        this.issues.forEach((issue) => {
          const cacheKey = `${issue.latitude},${issue.longitude}`;
          if (this.addressCache.has(cacheKey)) {
            issue.address = this.addressCache.get(cacheKey);
          } else {
            this.geocodingService.getAddressFromCoords(issue.latitude, issue.longitude).subscribe((address: string) => {
              issue.address = address;
              this.addressCache.set(cacheKey, address);
            });
          }
        });

        if (this.isBrowser && this.map) {
          this.addMarkers();
          this.fitMapToMarkers();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private initMap(): void {
    if (!this.L) {
      console.error('Leaflet not loaded yet.');
      return;
    }

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
          .bindPopup((index + 1).toString());

        this.markers.push(marker);
      }
    });
  }

  private addMarkers(): void {
    if (!this.map || !this.L) return;

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
          .bindPopup((index + 1).toString());

        this.markers.push(marker);
      }
    });
  }

  private fitMapToMarkers() {
    if (!this.issues.length || !this.L) return;

    const bounds = this.L.latLngBounds(this.issues.map((issue) => [issue.latitude, issue.longitude]));
    this.map.fitBounds(bounds);
  }

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

  viewIssue(id: string) {
    this.router.navigate(['/home/issue', id]);
  }
}