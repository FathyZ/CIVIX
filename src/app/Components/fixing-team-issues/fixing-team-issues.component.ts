import { TeamMember } from './../../models/fixingTeams';
import { CommonModule } from '@angular/common';
import { FixingTeamsService } from './../../Services/fixing-teams.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../models/issue';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-fixing-team-issues',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './fixing-team-issues.component.html',
  styleUrl: './fixing-team-issues.component.scss'
})
export class FixingTeamIssuesComponent implements OnInit {
  teamId: string = '';
  issues:any[] = [];
  constructor(
    private router : Router, 
    private route: ActivatedRoute, 
    private FixingTeamsService:FixingTeamsService,
    private messageService: MessageService
  ) {}

  viewIssue(id: string) {
    this.router.navigate(['/home/issue', id]);
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id')!;
    console.log("Team ID from route:", this.teamId); // Add this for debugging
  
    this.loadTeamIssues();
  }

  loadTeamIssues(): void {
    this.FixingTeamsService.getTeamsWithIssues().subscribe((teams) => {
      console.log("Teams data:", teams); // Log the response to see if it's being fetched correctly
      
      // Now, find the team with the correct ID
      const selectedTeam = teams.find((team: any) => team.id.toString() === this.teamId);
  
      // If the team is found, set the issues array
      if (selectedTeam) {
        this.issues = selectedTeam.issues ?? [];
        console.log("Issues for the selected team:", this.issues); // Debugging issues data
      } else {
        this.issues = [];
        console.warn('No team found with the given ID');
      }
    });
  }

  removeAssignment(issueId: number): void {
    const teamIdNumber = parseInt(this.teamId);
    
    this.FixingTeamsService.unassignIssueFromTeam(issueId, teamIdNumber).subscribe({
      next: (response) => {

        

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Issue has been successfully unassigned from the team.'
        });


        this.issues = this.issues.filter(issue => issue.id !== issueId);
        

      },
      error: (error) => {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unassign the issue. Please try again.'
        });
      }
    });
  }
  
}

