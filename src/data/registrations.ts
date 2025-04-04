
export interface Registration {
  id: string;
  event_id: string;
  name: string;
  usn: string;
  branch: string;
  phone: string;
  email: string;
  utr?: string;
  team_members?: Array<{
    name: string;
    usn: string;
    branch?: string;
  }>;
}

export const REGISTRATIONS_DATA: Registration[] = [];
