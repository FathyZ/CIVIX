import { TeamMember } from './../../models/fixingTeams';
import { CommonModule } from '@angular/common';
import { FixingTeamsService } from './../../Services/fixing-teams.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from '../../models/issue';


@Component({
  selector: 'app-fixing-team-issues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fixing-team-issues.component.html',
  styleUrl: './fixing-team-issues.component.scss'
})
export class FixingTeamIssuesComponent implements OnInit {
  teamId: string = '';
  issues:any[] = [];
  constructor(private router : Router ,private route: ActivatedRoute, private FixingTeamsService:FixingTeamsService) {}

  viewIssue(id: string) {
    this.router.navigate(['/home/issue', id]);
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id')!;
    console.log("Team ID from route:", this.teamId); // Add this for debugging
  
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
  
}

