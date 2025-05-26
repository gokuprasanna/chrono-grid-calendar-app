import React, { useState, useEffect } from 'react';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarSidebar } from '@/components/calendar/CalendarSidebar';
import { EventModal } from '@/components/calendar/EventModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { SettingsModal } from '@/components/calendar/SettingsModal';
import { TimetableModal } from '@/components/calendar/TimetableModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Calendar, CalendarEvent, User, ViewType, CalendarSettings, Timetable, TimetableSlot, ThemeType } from '@/types/calendar';
import { getThemeConfig } from '@/utils/themes';

const Index = () => {
  // User authentication state
  const [user, setUser] = useLocalStorage<User | null>('calendar_user', null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Calendar state
  const [calendars, setCalendars] = useLocalStorage<Calendar[]>('user_calendars', []);
  const [activeCalendarId, setActiveCalendarId] = useLocalStorage<string>('active_calendar', '');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');
  
  // Event management
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendar_events', []);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Settings
  const [settings, setSettings] = useLocalStorage<CalendarSettings>('calendar_settings', {
    theme: 'sci-fi',
    defaultView: 'month',
    weekStartsOn: 0,
    timeFormat: '12h',
    showWeekNumbers: false,
    showWeekends: true,
    notifications: {
      enabled: true,
      defaultReminder: 15
    },
    timetable: {
      showInCalendar: false
    }
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Timetable management
  const [timetables, setTimetables] = useLocalStorage<Timetable[]>('calendar_timetables', []);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  
  // Initialize default calendar if none exists
  useEffect(() => {
    if (calendars.length === 0) {
      const defaultCalendar: Calendar = {
        id: 'default',
        name: 'Main Calendar',
        description: 'Your primary calendar',
        color: '#00ff88',
        isDefault: true,
        createdAt: new Date().toISOString()
      };
      setCalendars([defaultCalendar]);
      setActiveCalendarId('default');
    }
  }, [calendars, setCalendars, setActiveCalendarId]);

  // Apply theme
  const themeConfig = getThemeConfig(settings.theme);

  const activeCalendar = calendars.find(cal => cal.id === activeCalendarId);
  const activeEvents = events.filter(event => event.calendarId === activeCalendarId);
  const activeTimetable = settings.timetable.activeTimetableId 
    ? timetables.find(t => t.id === settings.timetable.activeTimetableId)
    : undefined;

  /**
   * Handle creating a new event
   * @param eventData - The event data from the form
   */
  const handleCreateEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
      calendarId: activeCalendarId,
      createdAt: new Date().toISOString()
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
  };

  /**
   * Handle updating an existing event
   * @param eventId - The ID of the event to update
   * @param eventData - The updated event data
   */
  const handleUpdateEvent = (eventId: string, eventData: Partial<CalendarEvent>) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...eventData } : event
    ));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  /**
   * Handle deleting an event
   * @param eventId - The ID of the event to delete
   */
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  /**
   * Handle creating a new calendar
   * @param calendarData - The calendar data
   */
  const handleCreateCalendar = (calendarData: Omit<Calendar, 'id' | 'createdAt'>) => {
    const newCalendar: Calendar = {
      ...calendarData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCalendars([...calendars, newCalendar]);
  };

  /**
   * Handle user authentication
   * @param userData - The user data from login/register
   */
  const handleAuth = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  /**
   * Handle creating/updating timetables
   */
  const handleSaveTimetable = (timetableData: Omit<Timetable, 'id' | 'createdAt'>) => {
    if (selectedTimetable) {
      setTimetables(timetables.map(t => 
        t.id === selectedTimetable.id 
          ? { ...selectedTimetable, ...timetableData }
          : t
      ));
    } else {
      const newTimetable: Timetable = {
        ...timetableData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTimetables([...timetables, newTimetable]);
    }
    setShowTimetableModal(false);
    setSelectedTimetable(null);
  };

  const handleCreateTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    if (!activeTimetable) return;
    
    const newSlot: TimetableSlot = {
      ...slotData,
      id: Date.now().toString()
    };
    
    const updatedTimetable = {
      ...activeTimetable,
      slots: [...activeTimetable.slots, newSlot]
    };
    
    setTimetables(timetables.map(t => 
      t.id === activeTimetable.id ? updatedTimetable : t
    ));
  };

  const handleEditTimetableSlot = (slot: TimetableSlot) => {
    // This would open a slot editing modal - simplified for now
    console.log('Edit slot:', slot);
  };

  const handleDeleteTimetableSlot = (slotId: string) => {
    if (!activeTimetable) return;
    
    const updatedTimetable = {
      ...activeTimetable,
      slots: activeTimetable.slots.filter(slot => slot.id !== slotId)
    };
    
    setTimetables(timetables.map(t => 
      t.id === activeTimetable.id ? updatedTimetable : t
    ));
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradients.main}`}>
      {/* Theme-based background effects */}
      <div className={`fixed inset-0 ${themeConfig.gradients.accent}`}></div>
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
      </div>
      
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <CalendarSidebar
          calendars={calendars}
          activeCalendarId={activeCalendarId}
          onCalendarSelect={setActiveCalendarId}
          onCreateCalendar={handleCreateCalendar}
          user={user}
          onShowAuth={() => setShowAuthModal(true)}
          onLogout={() => setUser(null)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <CalendarHeader
            currentDate={currentDate}
            viewType={viewType}
            onDateChange={setCurrentDate}
            onViewChange={setViewType}
            onCreateEvent={() => setShowEventModal(true)}
            activeCalendar={activeCalendar}
          />

          {/* Calendar view */}
          <CalendarView
            currentDate={currentDate}
            viewType={viewType}
            events={activeEvents}
            timetable={activeTimetable}
            onEventSelect={(event) => {
              setSelectedEvent(event);
              setShowEventModal(true);
            }}
            onDateSelect={(date) => setCurrentDate(date)}
            onCreateEvent={(date) => {
              setCurrentDate(date);
              setShowEventModal(true);
            }}
            onCreateTimetableSlot={handleCreateTimetableSlot}
            onEditTimetableSlot={handleEditTimetableSlot}
            onDeleteTimetableSlot={handleDeleteTimetableSlot}
          />
        </div>
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onSave={selectedEvent ? 
            (data) => handleUpdateEvent(selectedEvent.id, data) : 
            handleCreateEvent
          }
          onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          timetables={timetables}
          onSave={setSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showTimetableModal && (
        <TimetableModal
          timetable={selectedTimetable}
          onSave={handleSaveTimetable}
          onClose={() => {
            setShowTimetableModal(false);
            setSelectedTimetable(null);
          }}
        />
      )}

      {/* Quick access buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={() => setShowSettingsModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Settings"
        >
          ⚙️
        </button>
        <button
          onClick={() => {
            setSelectedTimetable(null);
            setShowTimetableModal(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Create Timetable"
        >
          📅
        </button>
      </div>
    </div>
  );
};

export default Index;
