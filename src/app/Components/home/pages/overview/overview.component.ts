import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, NgModel} from '@angular/forms';
import { TagModule } from 'primeng/tag'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [TableModule ,CommonModule,MultiSelectModule,FormsModule ,TagModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements AfterViewInit{

  constructor(private router: Router) {}

  reports = [
    { id: 1, category: 'Broken StreetLight', location: 'South 90', status: 'In-Progress', priority: 'Medium' },
    { id: 2, category: 'Flooding', location: 'Arabella Square', status: 'Pending', priority: 'High' },
    { id: 3, category: 'Broken StreetLight', location: 'South 90', status: 'In-Progress', priority: 'Medium' },
    { id: 4, category: 'Flooding', location: 'Arabella Square', status: 'Pending', priority: 'High' },
    { id: 5, category: 'Broken StreetLight', location: 'South 90', status: 'In-Progress', priority: 'Low' },
    { id: 6, category: 'Flooding', location: 'Arabella Square', status: 'Pending', priority: 'High' },
    { id: 7, category: 'Broken StreetLight', location: 'South 90', status: 'In-Progress', priority: 'Medium' },
    { id: 8, category: 'Flooding', location: 'Arabella Square', status: 'Pending', priority: 'Low' }
  ];
  getPriorityClass(priority: string) {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-danger fw-bold';
      case 'medium': return 'text-warning fw-bold';
      case 'low': return 'text-success fw-bold';
      default: return '';
    }
  }

  viewIssue(id: number) {
    this.router.navigate(['/home/issue', id]);
  }

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

var marker2 = this.L.marker([29.99077365957645, 31.431209539739736],
  {icon:customIcon})
  .addTo(this.map);
marker2.bindPopup("1");

var marker3 = this.L.marker([30.016173201206136, 31.42984610411218],
  {icon:customIcon})
  .addTo(this.map);
marker3.bindPopup("2");

var marker4 = this.L.marker([30.038109090153757, 31.51560555966048],
  {icon:customIcon})
  .addTo(this.map);
marker4.bindPopup("3");

var marker5 = this.L.marker([30.069819843886, 31.538727090999757],
  {icon:customIcon})
  .addTo(this.map);
marker5.bindPopup("4");

var marker6 = this.L.marker([29.978484538484324, 31.574365107656995],
  {icon:customIcon})
  .addTo(this.map);
marker6.bindPopup("5");

var marker7 = this.L.marker([30.002199629537937, 31.566657817488863],
  {icon:customIcon})
  .addTo(this.map);
marker7.bindPopup("6");

var marker8 = this.L.marker([30.056459504509412, 31.579232870147923],
  {icon:customIcon})
  .addTo(this.map);
marker8.bindPopup("7");

var marker9 = this.L.marker([30.026787071662486, 31.60052933029633],
  {icon:customIcon})
  .addTo(this.map);
marker9.bindPopup("8");

this.map.setView([30.022870358306598, 31.5278967587765], 11);

}
}

