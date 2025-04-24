export interface TeamMember {
    name: string;
    age: number;
    jobTitle: string;
    phoneNumber: string;
  }
  
  export interface FixingTeam {
    id: number;
    category: string;
    teamLeaderId: string;
    teamLeaderName: string;
    teamLeaderEmail: string;
    teamMembers: TeamMember[];
  }
  