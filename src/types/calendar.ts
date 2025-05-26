
/**
 * Calendar application type definitions
 * These types define the structure of all calendar-related data
 */

export type ViewType = 'month' | 'week' | 'day' | 'timetable';

export type ThemeType = 'sci-fi' | 'cyberpunk' | 'retro' | 'starwars' | 'startrek' | 'minimal';

export interface User {
  id: string;
  username: string;
  email?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Calendar {
  id: string;
  name: string;
  description: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  color?: string;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  hasTimer: boolean;
  timerDuration?: number; // in minutes
  createdAt: string;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6, Sunday = 0
}

export interface TimerSession {
  id: string;
  eventId: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  isActive: boolean;
}

export interface TimetableSlot {
  id: string;
  day: number; // 0-6, Sunday = 0
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  subject: string;
  location?: string;
  instructor?: string;
  color?: string;
}

export interface Timetable {
  id: string;
  name: string;
  description?: string;
  slots: TimetableSlot[];
  isActive: boolean;
  createdAt: string;
}

export interface CalendarSettings {
  theme: ThemeType;
  defaultView: ViewType;
  weekStartsOn: number; // 0-6, Sunday = 0
  timeFormat: '12h' | '24h';
  showWeekNumbers: boolean;
  showWeekends: boolean;
  notifications: {
    enabled: boolean;
    defaultReminder: number; // minutes before event
  };
  timetable: {
    showInCalendar: boolean;
    activeTimetableId?: string;
  };
}
