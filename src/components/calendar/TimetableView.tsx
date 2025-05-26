
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimetableSlot, Timetable } from '@/types/calendar';

interface TimetableViewProps {
  timetable?: Timetable;
  onCreateSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  onEditSlot: (slot: TimetableSlot) => void;
  onDeleteSlot: (slotId: string) => void;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
);

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetable,
  onCreateSlot,
  onEditSlot,
  onDeleteSlot
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleCellClick = (day: number, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    
    // Create a new slot
    const endTime = `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
    onCreateSlot({
      day,
      startTime: time,
      endTime,
      subject: 'New Subject',
      color: '#0099ff'
    });
  };

  const getSlotForCell = (day: number, time: string) => {
    if (!timetable) return null;
    
    return timetable.slots.find(slot => {
      const slotStartHour = parseInt(slot.startTime.split(':')[0]);
      const slotEndHour = parseInt(slot.endTime.split(':')[0]);
      const currentHour = parseInt(time.split(':')[0]);
      
      return slot.day === day && currentHour >= slotStartHour && currentHour < slotEndHour;
    });
  };

  const getSlotHeight = (slot: TimetableSlot) => {
    const startHour = parseInt(slot.startTime.split(':')[0]);
    const endHour = parseInt(slot.endTime.split(':')[0]);
    return (endHour - startHour) * 60; // 60px per hour
  };

  const getSlotTop = (slot: TimetableSlot) => {
    const startHour = parseInt(slot.startTime.split(':')[0]);
    const startMinute = parseInt(slot.startTime.split(':')[1]);
    return (startHour * 60) + startMinute; // 60px per hour
  };

  return (
    <div className="flex-1 bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {timetable ? timetable.name : 'Weekly Timetable'}
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Slot
          </Button>
        </div>
      </div>

      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-8 min-w-full">
          {/* Time column */}
          <div className="border-r border-white/20">
            <div className="h-12 border-b border-white/20 bg-white/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white/70" />
            </div>
            {timeSlots.map(time => (
              <div
                key={time}
                className="h-15 border-b border-white/20 flex items-center justify-center text-sm text-white/70"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIndex) => (
            <div key={day} className="border-r border-white/20 relative">
              <div className="h-12 border-b border-white/20 bg-white/10 flex items-center justify-center">
                <span className="font-medium text-white text-sm">{day}</span>
              </div>
              
              <div className="relative">
                {timeSlots.map(time => {
                  const slot = getSlotForCell(dayIndex, time);
                  const isFirstHourOfSlot = slot && slot.startTime === time;
                  
                  return (
                    <div
                      key={time}
                      className="h-15 border-b border-white/20 cursor-pointer hover:bg-white/10 transition-colors relative"
                      onClick={() => !slot && handleCellClick(dayIndex, time)}
                    >
                      {isFirstHourOfSlot && (
                        <div
                          className="absolute inset-x-1 rounded-md p-2 text-xs text-white overflow-hidden"
                          style={{
                            backgroundColor: slot.color || '#0099ff',
                            height: `${getSlotHeight(slot)}px`,
                            top: 0
                          }}
                        >
                          <div className="font-medium truncate">{slot.subject}</div>
                          {slot.location && (
                            <div className="flex items-center gap-1 mt-1 opacity-80">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{slot.location}</span>
                            </div>
                          )}
                          {slot.instructor && (
                            <div className="flex items-center gap-1 mt-1 opacity-80">
                              <User className="h-3 w-3" />
                              <span className="truncate">{slot.instructor}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditSlot(slot);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-white hover:bg-white/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSlot(slot.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
