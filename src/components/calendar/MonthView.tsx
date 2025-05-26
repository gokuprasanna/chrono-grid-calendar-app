
import React from 'react';
import { CalendarEvent } from '@/types/calendar';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
  onCreateEvent: (date: Date) => void;
}

/**
 * Month view component for the calendar
 * Displays a full month grid with events
 */
export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventSelect,
  onDateSelect,
  onCreateEvent
}) => {
  /**
   * Generate the calendar grid for the current month
   */
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the beginning of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End at the end of the week containing the last day
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  /**
   * Get events for a specific date
   */
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  /**
   * Check if a date is in the current month
   */
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  /**
   * Check if a date is today
   */
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-1 p-4">
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-cyan-400/20 overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-slate-700/50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center text-cyan-300 font-medium border-r border-cyan-400/20 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                onClick={() => {
                  onDateSelect(date);
                  onCreateEvent(date);
                }}
                className={`
                  min-h-[120px] p-2 border-r border-b border-cyan-400/20 
                  cursor-pointer transition-all hover:bg-cyan-400/10
                  ${!isCurrentMonthDay ? 'bg-slate-700/30 text-slate-500' : 'bg-slate-800/20'}
                  ${isTodayDate ? 'bg-cyan-400/20 border-cyan-400/50' : ''}
                  last:border-r-0
                `}
              >
                {/* Date number */}
                <div className={`
                  text-sm font-medium mb-1
                  ${isTodayDate ? 'text-cyan-300' : isCurrentMonthDay ? 'text-white' : 'text-slate-500'}
                `}>
                  {date.getDate()}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventSelect(event);
                      }}
                      className={`
                        text-xs p-1 rounded cursor-pointer truncate
                        hover:opacity-80 transition-opacity
                        bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white
                      `}
                      style={{ backgroundColor: event.color || '#00bcd4' }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-cyan-400 font-medium">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
