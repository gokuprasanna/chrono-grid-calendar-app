
import React from 'react';
import { CalendarEvent } from '@/types/calendar';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onDateSelect: (date: Date) => void;
  onCreateEvent: (date: Date) => void;
}

/**
 * Day view component for the calendar
 * Displays a detailed hourly view of a single day
 */
export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventSelect,
  onDateSelect,
  onCreateEvent
}) => {
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
   * Get events for a specific hour
   */
  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return (
        eventStart.toDateString() === currentDate.toDateString() &&
        eventStart.getHours() === hour
      );
    });
  };

  /**
   * Check if the current date is today
   */
  const isToday = () => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  };

  /**
   * Format the date for display
   */
  const formatDate = () => {
    return currentDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hourSlots = getHourSlots();
  const currentHour = new Date().getHours();

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-cyan-400/20">
        {/* Day header */}
        <div className="bg-slate-700/50 p-6 border-b border-cyan-400/20">
          <h2 className="text-2xl font-bold text-white mb-1">{formatDate()}</h2>
          <p className="text-cyan-300">
            {isToday() ? 'Today' : 'Day View'}
          </p>
        </div>

        {/* Time slots */}
        <div className="divide-y divide-cyan-400/10">
          {hourSlots.map((hour) => {
            const hourEvents = getEventsForHour(hour);
            const isCurrentHour = isToday() && hour === currentHour;

            return (
              <div 
                key={hour} 
                className={`flex ${isCurrentHour ? 'bg-cyan-400/10' : ''}`}
              >
                {/* Time label */}
                <div className="w-20 flex-shrink-0 p-4 text-center bg-slate-700/30 border-r border-cyan-400/20">
                  <div className={`text-sm font-medium ${isCurrentHour ? 'text-cyan-300' : 'text-cyan-400'}`}>
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                {/* Event area */}
                <div
                  className="flex-1 min-h-[80px] p-4 cursor-pointer transition-all hover:bg-cyan-400/5"
                  onClick={() => {
                    const clickDate = new Date(currentDate);
                    clickDate.setHours(hour, 0, 0, 0);
                    onDateSelect(clickDate);
                    onCreateEvent(clickDate);
                  }}
                >
                  <div className="space-y-2">
                    {hourEvents.map((event) => {
                      const startTime = new Date(event.startTime);
                      const endTime = new Date(event.endTime);
                      
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventSelect(event);
                          }}
                          className="p-3 rounded-lg cursor-pointer transition-all hover:opacity-80 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white border border-cyan-400/30"
                          style={{ backgroundColor: event.color || '#00bcd4' }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm opacity-90">
                            {startTime.toLocaleTimeString(undefined, { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {endTime.toLocaleTimeString(undefined, { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          {event.description && (
                            <div className="text-sm opacity-80 mt-1">
                              {event.description}
                            </div>
                          )}
                          {event.hasTimer && (
                            <div className="text-xs opacity-75 mt-1">
                              ⏱️ Timer: {event.timerDuration || 0}min
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {hourEvents.length === 0 && (
                      <div className="text-slate-500 text-sm py-2">
                        Click to add event
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
