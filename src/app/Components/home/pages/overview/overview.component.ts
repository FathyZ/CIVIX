import { GeocodingService } from './../../../../Services/geocoding.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, NgModel} from '@angular/forms';
import { TagModule } from 'primeng/tag'; 
import { Router } from '@angular/router';
import { IssuesService } from '../../../../Services/issues.service';
import { ApiResponse, Issue } from '../../../../models/issue';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TableModule ,CommonModule,MultiSelectModule,FormsModule ,TagModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit{

  constructor(private router: Router,private issueService:IssuesService , private geocodingService: GeocodingService) {}

  issues: Issue[] = []; // Will hold the fetched issues
  totalIssues : number = 0;
  getPriorityClass(priority: string) {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-danger fw-bold';
      case 'medium': return 'text-warning fw-bold';
      case 'low': return 'text-success fw-bold';
      default: return '';
    }
  }

  viewIssue(id: string) { // Redirect to the single issue page
    this.router.navigate(['/home/issue', id]);
  }

  private map!: L.Map;
  private L!: any; // Store Leaflet dynamically
  private markers: L.Marker[] = []; // Declare an array to store markers

  ngOnInit(): void { // Fetch issues when the component is initialized
    this.fetchIssues();  
  }

  fetchIssues() { // Fetch issues from the API
    this.issueService.getIssues(5).subscribe((response: ApiResponse) => { // Subscribe to the API response
      this.issues = response.data; // Access the `data` property
      this.totalIssues = response.totatIssues;
      this.issues.forEach((issue)=>{
        this.geocodingService.getAddressFromCoords(issue.latitude,issue.longitude).subscribe((res:any)=>{
          issue.address = res.display_name;
      });
    });
  
      
      console.log(response);// Log the issues to the console for debugging
      if(this.map) {
        this.addMarkers();
        this.fitMapToMarkers();
      }
    }, (error) => {
      console.log(error); // Log any errors to the console for debugging
    });

    
  }


  private addMarkers(): void {
    if (!this.map) return;

    const customIcon = new this.L.Icon({
      iconUrl: '../../../../../assets/marker-icon-2x.png',
      shadowUrl: '../../../../../assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // ✅ Add markers AFTER issues are fetched
    this.issues.forEach((issue, index) => {
      if (issue.latitude && issue.longitude) {
        const marker = this.L.marker([issue.latitude, issue.longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup((index + 1).toString()); // Show issue index in popup

        this.markers.push(marker);
      }
    });}

    private fitMapToMarkers() {
      if (!this.issues.length) return;
    
      const bounds = this.L.latLngBounds(this.issues.map(issue => [issue.latitude, issue.longitude]));
      this.map.fitBounds(bounds); // Adds padding to prevent tight zoom-in
    }


  async ngAfterViewInit(): Promise<void> { // Initialize Leaflet after the view is initialized
    if (typeof window !== 'undefined') { // ✅ Ensure we're in the browser
      const leaflet = await import('leaflet');// Dynamically import the Leaflet library
      this.L = leaflet; // Store the module
      this.initMap();
    
    
    }
  }

  private initMap(): void {
    this.map = this.L.map('map').setView([30.0784937, 31.6578639], 15);

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

    this.issues.forEach((issue, index) => {
      if (issue.latitude && issue.longitude) {
        const marker = this.L.marker([issue.latitude, issue.longitude], { icon: customIcon })
          .addTo(this.map)
          .bindPopup((index + 1).toString()); // Show issue index in popup

        this.markers.push(marker); // Store marker in array
      }
    });

}
}

