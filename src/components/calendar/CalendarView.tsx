
import React from 'react';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { TimetableView } from './TimetableView';
import { ViewType, CalendarEvent, Timetable, TimetableSlot } from '@/types/calendar';

interface CalendarViewProps {
  currentDate: Date;
  viewType: ViewType;
  events: CalendarEvent[];
  timetable?: Timetable;
  onEventSelect: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
  onCreateEvent: (date: Date) => void;
  onCreateTimetableSlot?: (slot: Omit<TimetableSlot, 'id'>) => void;
  onEditTimetableSlot?: (slot: TimetableSlot) => void;
  onDeleteTimetableSlot?: (slotId: string) => void;
}

/**
 * Main calendar view component that renders different view types
 * Switches between month, week, day, and timetable views based on viewType prop
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  viewType,
  events,
  timetable,
  onEventSelect,
  onDateSelect,
  onCreateEvent,
  onCreateTimetableSlot,
  onEditTimetableSlot,
  onDeleteTimetableSlot
}) => {
  const commonProps = {
    currentDate,
    events,
    onEventSelect,
    onDateSelect,
    onCreateEvent
  };

  switch (viewType) {
    case 'month':
      return <MonthView {...commonProps} />;
    case 'week':
      return <WeekView {...commonProps} />;
    case 'day':
      return <DayView {...commonProps} />;
    case 'timetable':
      return (
        <TimetableView
          timetable={timetable}
          onCreateSlot={onCreateTimetableSlot || (() => {})}
          onEditSlot={onEditTimetableSlot || (() => {})}
          onDeleteSlot={onDeleteTimetableSlot || (() => {})}
        />
      );
    default:
      return <MonthView {...commonProps} />;
  }
};
