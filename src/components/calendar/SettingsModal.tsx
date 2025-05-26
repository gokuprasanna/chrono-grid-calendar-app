
import React, { useState } from 'react';
import { X, Settings, Palette, Calendar, Clock, Bell, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarSettings, ThemeType, ViewType, Timetable } from '@/types/calendar';
import { themes } from '@/utils/themes';

interface SettingsModalProps {
  settings: CalendarSettings;
  timetables: Timetable[];
  onSave: (settings: CalendarSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  timetables,
  onSave,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<CalendarSettings>(settings);
  const [activeTab, setActiveTab] = useState('appearance');

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const updateSetting = (key: keyof CalendarSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNestedSetting = (parentKey: keyof CalendarSettings, childKey: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey] as any,
        [childKey]: value
      }
    }));
  };

  const TabButton = ({ id, icon: Icon, label, isActive, onClick }: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white mb-3 block">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      localSettings.theme === key
                        ? 'border-blue-400 bg-blue-400/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => updateSetting('theme', key as ThemeType)}
                  >
                    <div className="text-white font-medium">{theme.name}</div>
                    <div className="text-white/70 text-xs mt-1">{theme.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Default View</label>
                <Select
                  value={localSettings.defaultView}
                  onValueChange={(value: ViewType) => updateSetting('defaultView', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month View</SelectItem>
                    <SelectItem value="week">Week View</SelectItem>
                    <SelectItem value="day">Day View</SelectItem>
                    <SelectItem value="timetable">Timetable View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Week Starts On</label>
                <Select
                  value={localSettings.weekStartsOn.toString()}
                  onValueChange={(value) => updateSetting('weekStartsOn', parseInt(value))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Time Format</label>
                <Select
                  value={localSettings.timeFormat}
                  onValueChange={(value: '12h' | '24h') => updateSetting('timeFormat', value)}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Show Week Numbers</label>
                <Switch
                  checked={localSettings.showWeekNumbers}
                  onCheckedChange={(checked) => updateSetting('showWeekNumbers', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Show Weekends</label>
                <Switch
                  checked={localSettings.showWeekends}
                  onCheckedChange={(checked) => updateSetting('showWeekends', checked)}
                />
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Enable Notifications</label>
                <Switch
                  checked={localSettings.notifications.enabled}
                  onCheckedChange={(checked) => updateNestedSetting('notifications', 'enabled', checked)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Default Reminder</label>
                <Select
                  value={localSettings.notifications.defaultReminder.toString()}
                  onValueChange={(value) => updateNestedSetting('notifications', 'defaultReminder', parseInt(value))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes before</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'timetable':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Show Timetable in Calendar</label>
                <Switch
                  checked={localSettings.timetable.showInCalendar}
                  onCheckedChange={(checked) => updateNestedSetting('timetable', 'showInCalendar', checked)}
                />
              </div>

              {timetables.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Active Timetable</label>
                  <Select
                    value={localSettings.timetable.activeTimetableId || ''}
                    onValueChange={(value) => updateNestedSetting('timetable', 'activeTimetableId', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a timetable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {timetables.map((timetable) => (
                        <SelectItem key={timetable.id} value={timetable.id}>
                          {timetable.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Calendar Settings</h2>
          </div>
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
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-6 bg-white/10 p-1 rounded-lg">
              <TabButton
                id="appearance"
                icon={Palette}
                label="Theme"
                isActive={activeTab === 'appearance'}
                onClick={() => setActiveTab('appearance')}
              />
              <TabButton
                id="general"
                icon={Calendar}
                label="General"
                isActive={activeTab === 'general'}
                onClick={() => setActiveTab('general')}
              />
              <TabButton
                id="notifications"
                icon={Bell}
                label="Alerts"
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
              />
              <TabButton
                id="timetable"
                icon={Grid3X3}
                label="Timetable"
                isActive={activeTab === 'timetable'}
                onClick={() => setActiveTab('timetable')}
              />
            </div>

            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/20">
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white hover:bg-white/20">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
