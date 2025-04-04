
export interface TeamMember {
  name: string;
  usn: string;
  branch: string; // Making branch required
}

export interface Registration {
  id: string;
  event_id: string;
  name: string;
  usn: string;
  branch: string;
  phone: string;
  email: string;
  utr?: string;
  registration_type?: 'solo' | 'team';
  team_members?: TeamMember[];
}

export const REGISTRATIONS_DATA: Registration[] = [];
