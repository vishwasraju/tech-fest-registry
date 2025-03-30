
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';

export type EventType = Event;
export type RegistrationType = Registration;

export interface BackgroundImageType {
  url: string;
  name: string;
}
