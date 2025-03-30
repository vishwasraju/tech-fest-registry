
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';

export type EventType = Event;
export type RegistrationType = Registration;

export interface BackgroundImageType {
  url: string;
  name: string;
}

export interface QRCodeImageType {
  url: string;
  eventId: string;
}

export const BRANCH_OPTIONS = [
  'ALL',
  'AIML', 'CSE', 'CSD', 'AIDS', 'ECE', 'AEROSPACE', 
  'AERONAUTICAL', 'MECHANICAL', 'CIVIL', 'MBA'
];
