import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-issue',
  standalone: true,
  imports: [],
  templateUrl: './single-issue.component.html',
  styleUrl: './single-issue.component.scss'
})
export class SingleIssueComponent implements AfterViewInit{


  issue:any; //store the issue object
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

  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const issueId = Number(this.route.snapshot.paramMap.get('id')); //get the id from the URL
    this.issue = this.reports.find(report => report.id === issueId); //find the issue with the id
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
}
}