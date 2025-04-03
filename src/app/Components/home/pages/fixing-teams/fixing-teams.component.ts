import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-fixing-teams',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './fixing-teams.component.html',
  styleUrl: './fixing-teams.component.scss'
})
export class FixingTeamsComponent {
  teams = [
    {
      name: 'Engineering Team 1',
      teamLeader: 'Michael Johnson',
      members: [
        { name: 'Sarah Lee' },
        { name: 'David Smith' },
        { name: 'Laura Brown' }
      ]
    },
    {
      name: 'Flooding Team 1',
      teamLeader: 'Emma Williams',
      members: [
        { name: 'James Wilson' },
        { name: 'Olivia Davis' },
        { name: 'Ethan Thomas' }
      ]
    },
    {
      name: 'Graffiti Team 1',
      teamLeader: 'Daniel Martinez',
      members: [
        { name: 'Sophia White' },
        { name: 'William Harris' },
        { name: 'Emily Clark' }
      ]
    },
    {
      name: 'Electricity Team 1',
      teamLeader: 'Benjamin Moore',
      members: [
        { name: 'Liam Anderson' },
        { name: 'Mia Walker' },
        { name: 'Noah Young' }
      ]
    },
    {
      name: 'Manhole Team 1',
      teamLeader: 'Alexander Scott',
      members: [
        { name: 'Charlotte Hall' },
        { name: 'Henry King' },
        { name: 'Grace Adams' }
      ]
    },
    {
      name: 'Garbage Team 1',
      teamLeader: 'Lucas Green',
      members: [
        { name: 'Amelia Baker' },
        { name: 'Mason Wright' },
        { name: 'Isabella Perez' }
      ]
    }
  ];

  getTotalMembers(teamName: string): number {
    const team = this.teams.find(t => t.name === teamName);
    return team ? team.members.length : 0;
  }
}
