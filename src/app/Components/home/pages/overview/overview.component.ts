import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
// import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TableModule ,CommonModule ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements AfterViewInit{

  private map!: L.Map;
  private L!: any; // Store Leaflet dynamically

  async ngAfterViewInit(): Promise<void> {
    if (typeof window !== 'undefined') { // ✅ Ensure we're in the browser
      const leaflet = await import('leaflet');
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
    var marker = this.L.marker([30.0771130,31.6568641],
       {icon:customIcon})
       .addTo(this.map);
marker.bindPopup("Fathy Lives Here!!").openPopup();
  }
}
