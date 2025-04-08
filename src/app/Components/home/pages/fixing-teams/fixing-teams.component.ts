import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FixingTeamsService } from '../../../../Services/fixing-teams.service';

@Component({
  selector: 'app-fixing-teams',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './fixing-teams.component.html',
  styleUrl: './fixing-teams.component.scss'
})
export class FixingTeamsComponent {

  teamname: string='';

  constructor(private fixingTeamsService: FixingTeamsService){}

 

  teams = [
    {
      name: 'Engineering Team 1',
      teamLeader: 'Ziad Fathy Elsayed',
      members: [
        { name: 'Islam Bahaa', phone: '01234567890' },
        { name: 'Ahmed Amin', phone: '01234567890' },
        { name: 'Ahmed Sherif', phone: '01234567890' }
      ]
    },
    {
      name: 'Flooding Team 1',
      teamLeader: 'Islam Bahaa',
      members: [
        { name: 'Ziad Fathy', phone: '01234567890' },
        { name: 'Ebram Adel', phone: '01234567890' },
        { name: 'Hana Adel', phone: '01234567890' }
      ]
    },
    {
      name: 'Graffiti Team 1',
      teamLeader: 'Ahmed Amin',
      members: [
        { name: 'Ziad Fathy', phone: '01234567890' },
        { name: 'Ebram Adel', phone: '01234567890' },
        { name: 'Hana Adel', phone: '01234567890' }
      ]
    },
    {
      name: 'Electricity Team 1',
      teamLeader: 'Ziad Fathy Elsayed',
      members: [
        { name: 'Islam Bahaa', phone: '01234567890' },
        { name: 'Ahmed Amin', phone: '01234567890' },
        { name: 'Ahmed Sherif', phone: '01234567890' }
      ]
    },
    {
      name: 'Manhole Team 1',
      teamLeader: 'Islam Bahaa',
      members: [
        { name: 'Ziad Fathy', phone: '01234567890' },
        { name: 'Ebram Adel', phone: '01234567890' },
        { name: 'Hana Adel', phone: '01234567890' }
      ]
    },
    {
      name: 'Garbage Team 1',
      teamLeader: 'Ahmed Amin',
      members: [
        { name: 'Ziad Fathy', phone: '01234567890' },
        { name: 'Ebram Adel', phone: '01234567890' },
        { name: 'Hana Adel', phone: '01234567890' }
      ]
    }
  ];

  getTotalMembers(teamName: string): number {
    const team = this.teams.find(t => t.name === teamName);
    return team ? team.members.length : 0;
  }
}
