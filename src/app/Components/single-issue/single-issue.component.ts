import { GeocodingService } from './../../Services/geocoding.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssuesService } from '../../Services/issues.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel'; 
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-single-issue',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './single-issue.component.html',
  styleUrl: './single-issue.component.scss'
})
export class SingleIssueComponent implements OnInit {
  issue: any;  
  @ViewChild('carouselImg') carouselImg!: ElementRef<HTMLImageElement>;
  @ViewChild('singleImage') singleImage!: ElementRef<HTMLImageElement>;
  fullscreenImage: string | null = null;

  private map!: L.Map;
  private L!: any; // Store Leaflet dynamically

  constructor(private route: ActivatedRoute, private issueService: IssuesService, private geocodingService: GeocodingService) {}

  ngOnInit() {
    const issueId = this.route.snapshot.paramMap.get('id');
    if (!issueId) {
      console.error('No issue ID found in URL');
      return;
    }

    console.log('Fetching issue with ID:', issueId);

    this.issueService.getIssueById(issueId).subscribe(
      async (data) => {
        console.log('Issue data received:', data);
        this.issue = data;

        this.geocodingService.getAddressFromCoords(this.issue.latitude, this.issue.longitude).pipe(
          tap(address => console.log(`Fetched Address: ${address}`))
        ).subscribe(
          (address) => {
            this.issue.address = address; // ✅ Assign cached or new address
          },
          (error) => {
            console.error('Error fetching address:', error);
          }
        );

        // ✅ Initialize Leaflet AFTER fetching data
        if (typeof window !== 'undefined') {
          const leaflet = await import('leaflet');
          this.L = leaflet;
          this.initMap(this.issue.latitude, this.issue.longitude);
        }
      },
      (error) => {
        console.error('Error fetching issue:', error);
      }
    );
  }

  openFullScreen(imageUrl: string): void {
    this.fullscreenImage = imageUrl;
  }

  closeFullScreen(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.fullscreenImage = null;
  }

  private initMap(lat: number, lng: number): void {
    this.map = this.L.map('map').setView([lat, lng], 15);

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const customIcon = new this.L.Icon({
      iconUrl: '../../../../../assets/marker-icon-2x.png',
      shadowUrl: '../../../../../assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
  }
}
