
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { ViewType, Calendar } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: ViewType;
  onDateChange: (date: Date) => void;
  onViewChange: (view: ViewType) => void;
  onCreateEvent: () => void;
  activeCalendar?: Calendar;
}

/**
 * Header component for the calendar application
 * Contains navigation controls, view switcher, and action buttons
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewType,
  onDateChange,
  onViewChange,
  onCreateEvent,
  activeCalendar
}) => {
  /**
   * Navigate to previous time period based on current view
   */
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    onDateChange(newDate);
  };

  /**
   * Navigate to next time period based on current view
   */
  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    onDateChange(newDate);
  };

  /**
   * Format the current date for display based on view type
   */
  const formatDisplayDate = () => {
    const options: Intl.DateTimeFormatOptions = {};
    switch (viewType) {
      case 'month':
        options.year = 'numeric';
        options.month = 'long';
        break;
      case 'week':
        options.year = 'numeric';
        options.month = 'short';
        options.day = 'numeric';
        break;
      case 'day':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        break;
    }
    return currentDate.toLocaleDateString(undefined, options);
  };

  return (
    <header className="bg-slate-800/50 backdrop-blur-md border-b border-cyan-400/30 p-4">
      <div className="flex items-center justify-between">
        {/* Left section - Calendar info and navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-xl font-bold text-white">
                {activeCalendar?.name || 'Calendar'}
              </h1>
              <p className="text-sm text-cyan-300">{formatDisplayDate()}</p>
            </div>
          </div>

          {/* Date navigation */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onDateChange(new Date())}
              className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
            >
              Today
            </Button>
          </div>
        </div>

        {/* Right section - View controls and actions */}
        <div className="flex items-center space-x-4">
          {/* View switcher */}
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            {(['month', 'week', 'day'] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  viewType === view
                    ? 'bg-cyan-400 text-slate-900'
                    : 'text-cyan-300 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          {/* Create event button */}
          <Button
            onClick={onCreateEvent}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>
    </header>
  );
};
