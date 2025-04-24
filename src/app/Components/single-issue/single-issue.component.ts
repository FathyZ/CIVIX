import { GeocodingService } from './../../Services/geocoding.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssuesService } from '../../Services/issues.service';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel'; 
import { tap } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { FixingTeam } from '../../models/fixingTeams'; // if you create the interface
import { FixingTeamsService } from '../../Services/fixing-teams.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { fadeInOut, popInOut, slideInOut } from '../../animations';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown'; 

@Component({
  selector: 'app-single-issue',
  standalone: true,
  imports: [CommonModule, CarouselModule,DialogModule,ToastModule,FormsModule,DropdownModule],
  providers: [MessageService],
  templateUrl: './single-issue.component.html',
  styleUrl: './single-issue.component.scss'
})
export class SingleIssueComponent implements OnInit {
  issue: any;  
  @ViewChild('carouselImg') carouselImg!: ElementRef<HTMLImageElement>;
  @ViewChild('singleImage') singleImage!: ElementRef<HTMLImageElement>;
  @ViewChild('ConfirmDeleteDialog') ConfirmDeleteDialog: any;
  @ViewChild('UpdateStatusDialog') UpdateStatusDialog: any;
  fullscreenImage: string | null = null;

  private map!: L.Map;
  private L!: any; // Store Leaflet dynamically
  showTeamPopup = false;
  fixingTeams: FixingTeam[] = [];
  selectedStatus: string = 'Open';

  statusOptions: { label: string, value: string }[] = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'Resolved', value: 'Resolved' }
  ];

  constructor(private route: ActivatedRoute,
     private issueService: IssuesService,
     private geocodingService: GeocodingService ,
     private fixingTeamsService: FixingTeamsService  ,
     private messageService: MessageService,
    private router: Router) {}

  toggleTeamPopup(): void {
    this.showTeamPopup = !this.showTeamPopup;
  
    if (this.showTeamPopup && this.fixingTeams.length === 0) {
      this.fixingTeamsService.getAllTeams().subscribe({
        next: (teams) => {
          this.fixingTeams = teams;
        },
        error: (err) => {
          console.error('Failed to load fixing teams', err);
          alert('Could not fetch teams.');
        }
      });
    }
  }
  assignToTeam(teamId: number) {
    const issueId = this.issue.id;
    this.fixingTeamsService.assignIssueToTeam(issueId, teamId).subscribe({
      next: () => {
        this.showTeamPopup = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Assigned Successfully',
          detail: 'The issue has been assigned to the selected team.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Assignment Failed',
          detail: 'Something went wrong while assigning the issue.',
        });
        console.error('Assignment failed:', err);
      }
    });
  }
   
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


  deleteIssue(){
    this.issueService.deleteIssue(this.issue.id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Issue Deleted',
          detail: 'The issue has been successfully deleted.',
        });
        this.router.navigate(['/home'])
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Deletion Failed',
          detail: 'Something went wrong while deleting the issue.',
        });
        console.error('Deletion failed:', error);
      }
    );
  }

  updateStatus() {
    const issueId = this.issue.id;
    const status = this.selectedStatus; 
  
    if (!status || !issueId) {
      alert('Invalid status or issue ID.');
      return;
    }
  
    this.issueService.updateIssueStatus(issueId, status).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: 'The issue status has been successfully updated.',
        });
  
        
        this.issue.status = status;
  
        
        this.closeUpdateStatusDialog();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Something went wrong while updating the issue status.',
        });
      }
    });
  }
  

  openDeleteDialog(): void {
    const dialog = this.ConfirmDeleteDialog.nativeElement as HTMLDialogElement;
    dialog.showModal();
    dialog.classList.remove('closing');
  }
  
  closeConfirmDeleteDialog(): void {
    this.ConfirmDeleteDialog.nativeElement.close();
  }

  openUpdateStatusDialog(): void {
    const dialog = this.UpdateStatusDialog.nativeElement as HTMLDialogElement;
    dialog.showModal();
    dialog.classList.remove('closing');
  }

  closeUpdateStatusDialog(): void {
    this.UpdateStatusDialog.nativeElement.close();
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
