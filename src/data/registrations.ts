
export interface Registration {
  id: string;
  event_id: string;
  name: string;
  usn: string;
  phone: string;
  email: string;
  utr?: string;
}

export const REGISTRATIONS_DATA: Registration[] = [
  {
    id: "reg-1",
    event_id: "event-1",
    name: "Aditya Sharma",
    usn: "1CS19CS001",
    phone: "9876543210",
    email: "aditya.s@example.com",
    utr: "UTR123456789"
  },
  {
    id: "reg-2",
    event_id: "event-1",
    name: "Priya Patel",
    usn: "1CS19CS045",
    phone: "8765432109",
    email: "priya.p@example.com",
    utr: "UTR987654321"
  },
  {
    id: "reg-3",
    event_id: "event-2",
    name: "Rahul Kumar",
    usn: "1CS20CS078",
    phone: "7654321098",
    email: "rahul.k@example.com",
    utr: "UTR456789012"
  },
  {
    id: "reg-4",
    event_id: "event-3",
    name: "Sneha Gupta",
    usn: "1CS19CS112",
    phone: "6543210987",
    email: "sneha.g@example.com",
    utr: "UTR345678901"
  },
  {
    id: "reg-5",
    event_id: "event-4",
    name: "Varun Singh",
    usn: "1CS21CS067",
    phone: "5432109876",
    email: "varun.s@example.com"
  },
  {
    id: "reg-6",
    event_id: "event-4",
    name: "Divya Reddy",
    usn: "1CS20CS033",
    phone: "4321098765",
    email: "divya.r@example.com"
  },
  {
    id: "reg-7",
    event_id: "event-5",
    name: "Karthik Nair",
    usn: "1CS19CS056",
    phone: "3210987654",
    email: "karthik.n@example.com",
    utr: "UTR234567890"
  },
  {
    id: "reg-8",
    event_id: "event-6",
    name: "Ananya Mishra",
    usn: "1CS22CS012",
    phone: "2109876543",
    email: "ananya.m@example.com"
  }
];
