
import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timetable, TimetableSlot } from '@/types/calendar';

interface TimetableModalProps {
  timetable?: Timetable;
  onSave: (timetableData: Omit<Timetable, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const colors = [
  '#0099ff', '#00ff88', '#ff0099', '#ffff00', '#ff6600', 
  '#9900ff', '#00ffff', '#ff3333', '#33ff33', '#3333ff'
];

export const TimetableModal: React.FC<TimetableModalProps> = ({
  timetable,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(timetable?.name || '');
  const [description, setDescription] = useState(timetable?.description || '');
  const [slots, setSlots] = useState<TimetableSlot[]>(timetable?.slots || []);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      slots,
      isActive: timetable?.isActive || false
    });
  };

  const addSlot = () => {
    const newSlot: TimetableSlot = {
      id: Date.now().toString(),
      day: 1, // Monday
      startTime: '09:00',
      endTime: '10:00',
      subject: 'New Subject',
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlot = (index: number, updates: Partial<TimetableSlot>) => {
    setSlots(slots.map((slot, i) => i === index ? { ...slot, ...updates } : slot));
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-semibold text-white">
            {timetable ? 'Edit Timetable' : 'Create Timetable'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Timetable Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Spring 2024 Schedule"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={1}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Time Slots</h3>
                <Button onClick={addSlot} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slot
                </Button>
              </div>

              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <div key={slot.id} className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <div className="grid grid-cols-6 gap-3 items-end">
                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Day</label>
                        <Select
                          value={slot.day.toString()}
                          onValueChange={(value) => updateSlot(index, { day: parseInt(value) })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day, dayIndex) => (
                              <SelectItem key={dayIndex} value={dayIndex.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Start Time</label>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(index, { startTime: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/70 mb-1 block">End Time</label>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(index, { endTime: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Subject</label>
                        <Input
                          value={slot.subject}
                          onChange={(e) => updateSlot(index, { subject: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Color</label>
                        <div className="flex gap-1">
                          {colors.slice(0, 5).map(color => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded border-2 ${
                                slot.color === color ? 'border-white' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => updateSlot(index, { color })}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSlot(index)}
                          className="text-red-400 hover:bg-red-400/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Location (optional)</label>
                        <Input
                          value={slot.location || ''}
                          onChange={(e) => updateSlot(index, { location: e.target.value })}
                          placeholder="Room 101"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/70 mb-1 block">Instructor (optional)</label>
                        <Input
                          value={slot.instructor || ''}
                          onChange={(e) => updateSlot(index, { instructor: e.target.value })}
                          placeholder="Dr. Smith"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {slots.length === 0 && (
                  <div className="text-center py-8 text-white/50">
                    No time slots added yet. Click "Add Slot" to create your first slot.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/20">
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/20">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Timetable
          </Button>
        </div>
      </div>
    </div>
  );
};
