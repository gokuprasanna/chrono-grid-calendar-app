
import React from 'react';
import { CalendarEvent } from '@/types/calendar';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
  onCreateEvent: (date: Date) => void;
}

/**
 * Week view component for the calendar
 * Displays a weekly timeline with hourly slots
 */
export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventSelect,
  onDateSelect,
  onCreateEvent
}) => {
  /**
   * Get the start of the week for the current date
   */
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  /**
   * Generate the days for the current week
   */
  const getWeekDays = () => {
    const weekStart = getWeekStart(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  /**
   * Generate hour slots for the day (24 hours)
   */
  const getHourSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  /**
   * Get events for a specific date and hour
   */
  const getEventsForDateTime = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return (
        eventStart.toDateString() === date.toDateString() &&
        eventStart.getHours() === hour
      );
    });
  };

  /**
   * Check if a date is today
   */
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDays = getWeekDays();
  const hourSlots = getHourSlots();
  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-cyan-400/20 overflow-hidden">
        {/* Week header */}
        <div className="grid grid-cols-8 bg-slate-700/50">
          {/* Time column header */}
          <div className="p-4 text-center text-cyan-300 font-medium border-r border-cyan-400/20">
            Time
          </div>
          
          {/* Day headers */}
          {weekDays.map((date, index) => (
            <div
              key={index}
              className={`p-4 text-center border-r border-cyan-400/20 last:border-r-0 ${
                isToday(date) ? 'bg-cyan-400/20 text-cyan-300' : 'text-cyan-300'
              }`}
            >
              <div className="font-medium">{weekDayNames[index]}</div>
              <div className={`text-sm ${isToday(date) ? 'text-cyan-200' : 'text-slate-400'}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        {hourSlots.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-cyan-400/10 last:border-b-0">
            {/* Time label */}
            <div className="p-2 text-center text-cyan-400 text-sm border-r border-cyan-400/20 bg-slate-700/30">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* Day cells */}
            {weekDays.map((date, dayIndex) => {
              const cellEvents = getEventsForDateTime(date, hour);
              
              return (
                <div
                  key={dayIndex}
                  onClick={() => {
                    const clickDate = new Date(date);
                    clickDate.setHours(hour, 0, 0, 0);
                    onDateSelect(clickDate);
                    onCreateEvent(clickDate);
                  }}
                  className={`
                    min-h-[60px] p-1 border-r border-cyan-400/20 last:border-r-0
                    cursor-pointer transition-all hover:bg-cyan-400/10
                    ${isToday(date) ? 'bg-cyan-400/5' : 'bg-slate-800/10'}
                  `}
                >
                  {cellEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventSelect(event);
                      }}
                      className="text-xs p-1 mb-1 rounded cursor-pointer truncate bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white hover:opacity-80"
                      style={{ backgroundColor: event.color || '#00bcd4' }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
