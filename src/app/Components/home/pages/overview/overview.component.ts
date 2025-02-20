import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, NgClass } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, NgModel} from '@angular/forms';
import { TagModule } from 'primeng/tag'; 
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TableModule ,CommonModule,MultiSelectModule,FormsModule ,TagModule],
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
    var marker1 = this.L.marker([30.0771130,31.6568641],
       {icon:customIcon})
       .addTo(this.map);
marker1.bindPopup("Fathy Lives Here!!").openPopup();

var marker2 = this.L.marker([29.99077365957645, 31.431209539739736],
  {icon:customIcon})
  .addTo(this.map);
marker2.bindPopup("2").openPopup();

var marker3 = this.L.marker([30.016173201206136, 31.42984610411218],
  {icon:customIcon})
  .addTo(this.map);
marker3.bindPopup("3").openPopup();
  }
}
