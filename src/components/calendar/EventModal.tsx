
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarEvent } from '@/types/calendar';

interface EventModalProps {
  event?: CalendarEvent | null;
  onSave: (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

/**
 * Modal component for creating and editing calendar events
 * Provides form fields for all event properties including timer settings
 */
export const EventModal: React.FC<EventModalProps> = ({
  event,
  onSave,
  onDelete,
  onClose
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('#00bcd4');
  const [hasTimer, setHasTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [isRecurring, setIsRecurring] = useState(false);

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setAllDay(event.allDay);
      setColor(event.color || '#00bcd4');
      setHasTimer(event.hasTimer);
      setTimerDuration(event.timerDuration || 30);
      setIsRecurring(event.isRecurring);
    } else {
      // Set default start time to current time
      const now = new Date();
      const defaultStart = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000); // 2 hours from now
      
      setStartTime(formatDateTimeLocal(defaultStart));
      setEndTime(formatDateTimeLocal(defaultEnd));
    }
  }, [event]);

  /**
   * Format date for datetime-local input
   */
  const formatDateTimeLocal = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const eventData: Omit<CalendarEvent, 'id' | 'createdAt'> = {
      calendarId: event?.calendarId || '',
      title: title.trim(),
      description: description.trim(),
      startTime: allDay ? new Date(startTime).toISOString() : new Date(startTime).toISOString(),
      endTime: allDay ? new Date(endTime).toISOString() : new Date(endTime).toISOString(),
      allDay,
      color,
      hasTimer,
      timerDuration: hasTimer ? timerDuration : undefined,
      isRecurring,
      recurrenceRule: isRecurring ? {
        frequency: 'weekly',
        interval: 1
      } : undefined
    };

    onSave(eventData);
  };

  /**
   * Available color options for events
   */
  const colorOptions = [
    '#00bcd4', '#4caf50', '#ff9800', '#f44336', 
    '#9c27b0', '#3f51b5', '#795548', '#607d8b'
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-cyan-400/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyan-300">
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-cyan-300">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="bg-slate-700/50 border-cyan-400/30 text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-cyan-300">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              className="bg-slate-700/50 border-cyan-400/30 text-white"
            />
          </div>

          {/* All day toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="rounded border-cyan-400/30"
            />
            <Label htmlFor="allDay" className="text-cyan-300">All day event</Label>
          </div>

          {/* Time fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-cyan-300">Start Time</Label>
              <Input
                id="startTime"
                type={allDay ? 'date' : 'datetime-local'}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-slate-700/50 border-cyan-400/30 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-cyan-300">End Time</Label>
              <Input
                id="endTime"
                type={allDay ? 'date' : 'datetime-local'}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-slate-700/50 border-cyan-400/30 text-white"
                required
              />
            </div>
          </div>

          {/* Color selection */}
          <div>
            <Label className="text-cyan-300">Color</Label>
            <div className="flex space-x-2 mt-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          {/* Timer settings */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasTimer"
                checked={hasTimer}
                onChange={(e) => setHasTimer(e.target.checked)}
                className="rounded border-cyan-400/30"
              />
              <Label htmlFor="hasTimer" className="text-cyan-300">Enable timer</Label>
            </div>
            
            {hasTimer && (
              <div>
                <Label htmlFor="timerDuration" className="text-cyan-300">
                  Timer Duration (minutes)
                </Label>
                <Input
                  id="timerDuration"
                  type="number"
                  min="1"
                  max="480"
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(parseInt(e.target.value) || 30)}
                  className="bg-slate-700/50 border-cyan-400/30 text-white"
                />
              </div>
            )}
          </div>

          {/* Recurring event toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-cyan-400/30"
            />
            <Label htmlFor="isRecurring" className="text-cyan-300">Recurring event</Label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {event ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
