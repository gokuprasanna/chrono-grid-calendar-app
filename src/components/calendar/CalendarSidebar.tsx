
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Calendar, User } from '@/types/calendar';

interface CalendarSidebarProps {
  calendars: Calendar[];
  activeCalendarId: string;
  onCalendarSelect: (calendarId: string) => void;
  onCreateCalendar: (calendar: Omit<Calendar, 'id' | 'createdAt'>) => void;
  user: User | null;
  onShowAuth: () => void;
  onLogout: () => void;
}

/**
 * Sidebar component for calendar navigation and management
 * Displays user info, calendar list, and creation controls
 */
export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  calendars,
  activeCalendarId,
  onCalendarSelect,
  onCreateCalendar,
  user,
  onShowAuth,
  onLogout
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarColor, setNewCalendarColor] = useState('#00ff88');

  /**
   * Handle creating a new calendar
   */
  const handleCreateCalendar = () => {
    if (newCalendarName.trim()) {
      onCreateCalendar({
        name: newCalendarName.trim(),
        description: `Calendar: ${newCalendarName}`,
        color: newCalendarColor,
        isDefault: false
      });
      setNewCalendarName('');
      setShowCreateForm(false);
    }
  };

  /**
   * Available color options for calendars
   */
  const colorOptions = [
    '#00ff88', '#ff6b6b', '#4ecdc4', '#45b7d1', 
    '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'
  ];

  return (
    <div className="w-80 bg-slate-800/60 backdrop-blur-md border-r border-cyan-400/30 flex flex-col">
      {/* User section */}
      <div className="p-4 border-b border-cyan-400/20">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-cyan-300 text-sm">
                  {user.isAnonymous ? 'Anonymous User' : user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-cyan-300 mb-3">Welcome to ChronoGrid</p>
            <Button
              onClick={onShowAuth}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Sign In / Register
            </Button>
          </div>
        )}
      </div>

      {/* Calendars section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Calendars</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Create calendar form */}
        {showCreateForm && (
          <div className="mb-4 p-3 bg-slate-700/50 rounded-lg border border-cyan-400/30">
            <Input
              placeholder="Calendar name"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
              className="mb-3 bg-slate-600/50 border-cyan-400/30 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCalendar()}
            />
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-cyan-300">Color:</span>
              <div className="flex space-x-1">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCalendarColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newCalendarColor === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleCreateCalendar}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
                className="text-cyan-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Calendar list */}
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <button
              key={calendar.id}
              onClick={() => onCalendarSelect(calendar.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                activeCalendarId === calendar.id
                  ? 'bg-cyan-400/20 border border-cyan-400/50'
                  : 'hover:bg-slate-700/50'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border-2 border-white/50"
                style={{ backgroundColor: calendar.color }}
              />
              <div className="flex-1 text-left">
                <p className="text-white font-medium">{calendar.name}</p>
                <p className="text-cyan-300 text-xs">{calendar.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-cyan-400/20">
        <p className="text-cyan-300 text-xs text-center">
          ChronoGrid Nexus v1.0
        </p>
        <p className="text-cyan-400/60 text-xs text-center mt-1">
          Space Station Calendar System
        </p>
      </div>
    </div>
  );
};
