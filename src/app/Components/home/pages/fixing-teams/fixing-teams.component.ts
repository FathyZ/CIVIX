import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FixingTeamsService } from '../../../../Services/fixing-teams.service';
import { FixingTeam } from '../../../../models/fixingTeams';

@Component({
  selector: 'app-fixing-teams',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './fixing-teams.component.html',
  styleUrl: './fixing-teams.component.scss'
})
export class FixingTeamsComponent {
  teamname: string = '';
  teams: FixingTeam[] = [];

  constructor(private fixingTeamsService: FixingTeamsService) {}

  ngOnInit(): void {
    this.getAllTeams();
  }

  getAllTeams() {
    this.fixingTeamsService.getAllTeams().subscribe((response) => {
      this.teams = response;
      console.log(this.teams);
    });
  }

  getTotalMembers(teamName: string): number {
    const team = this.teams.find(t => t.category === teamName);
    return team ? team.teamMembers.length : 0;
  }
}
