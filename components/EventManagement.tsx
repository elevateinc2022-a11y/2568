import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/supabaseService';
import { Loader2, Edit, Trash2 } from 'lucide-react';

interface EventManagementProps {
  initialEvents: Event[];
}

const EventManagement: React.FC<EventManagementProps> = ({ initialEvents }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list'); // 'list' to show events, 'form' to add/edit
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
      console.log("Fetched Events with IDs:", fetchedEvents.map(event => ({ id: event.id, title: event.title, date: new Date(event.date).toLocaleDateString(), location: event.location })));
      setLoading(false);
    };
    loadEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setEditingEvent(null);
    setActiveTab('list');
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setDate(event.date.split('T')[0]); // Assuming ISO string, take only date part for input type="date"
    setLocation(event.location);
    setDescription(event.description);
    setActiveTab('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const eventData = { title, date, location, description };
    let success = false;

    if (editingEvent) {
      const updated = await updateEvent(editingEvent.id, eventData);
      if (updated) {
        setEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev));
        success = true;
      }
    } else {
      const created = await createEvent(eventData);
      if (created) {
        setEvents(prev => [...prev, created]);
        success = true;
      }
    }

    if (success) {
      alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
      resetForm();
    } else {
      alert('Failed to save event.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setLoading(true);
      const success = await deleteEvent(id);
      if (success) {
        setEvents(prev => prev.filter(ev => ev.id !== id));
        alert('Event deleted successfully!');
      } else {
        alert('Failed to delete event.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => resetForm()}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'list' ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Manage Events
        </button>
        <button
          onClick={() => { setEditingEvent(null); setActiveTab('form'); }}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'form' && !editingEvent ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Add New Event
        </button>
        {editingEvent && (
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'form' && editingEvent ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Edit Event
          </button>
        )}
      </div>

      <div className="p-8">
        {activeTab === 'list' ? (
          loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-slate-100">
                    <th className="py-3 font-medium">Title</th>
                    <th className="py-3 font-medium">Date</th>
                    <th className="py-3 font-medium">Location</th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500 italic">No events found.</td>
                    </tr>
                  ) : (
                    events.map(event => (
                      <tr key={event.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 pr-4 font-medium text-slate-900">{event.title}</td>
                        <td className="py-4 text-slate-600">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="py-4 text-slate-500 text-sm">{event.location}</td>
                        <td className="py-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(event)}
                            className="text-brand-500 hover:text-brand-700 p-2 hover:bg-brand-50 rounded"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Event Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none hover:border-brand-300"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none hover:border-brand-300"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none hover:border-brand-300"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none hover:border-brand-300"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (editingEvent ? 'Update Event' : 'Create Event')}
            </button>
            {editingEvent && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="w-full mt-4 text-slate-600 hover:text-slate-800"
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default EventManagement;