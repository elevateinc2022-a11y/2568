import React, { useState, useEffect } from 'react';
import { GlobalConference } from '../types';
import { getGlobalConferences, createGlobalConference, updateGlobalConference, deleteGlobalConference } from '../services/supabaseService';
import { Loader2, Edit, Trash2 } from 'lucide-react';

interface ConferenceManagementProps {
  initialConferences: GlobalConference[];
}

const ConferenceManagement: React.FC<ConferenceManagementProps> = ({ initialConferences }) => {
  const [conferences, setConferences] = useState<GlobalConference[]>(initialConferences);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list'); // 'list' to show conferences, 'form' to add/edit
  const [editingConference, setEditingConference] = useState<GlobalConference | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const loadConferences = async () => {
      setLoading(true);
      const fetchedConferences = await getGlobalConferences();
      setConferences(fetchedConferences);
      setLoading(false);
    };
    loadConferences();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setLocation('');
    setDescription('');
    setLink('');
    setEditingConference(null);
    setActiveTab('list');
  };

  const handleEditClick = (conference: GlobalConference) => {
    setEditingConference(conference);
    setTitle(conference.title);
    setDate(conference.date.split('T')[0]); // Assuming ISO string, take only date part for input type="date"
    setLocation(conference.location);
    setDescription(conference.description || '');
    setLink(conference.link || '');
    setActiveTab('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const conferenceData = { title, date, location, description, link };
    let success = false;

    if (editingConference) {
      const updated = await updateGlobalConference(editingConference.id, conferenceData);
      if (updated) {
        setConferences(prev => prev.map(conf => conf.id === updated.id ? updated : conf));
        success = true;
      }
    } else {
      const created = await createGlobalConference(conferenceData);
      if (created) {
        setConferences(prev => [...prev, created]);
        success = true;
      }
    }

    if (success) {
      alert(editingConference ? 'Conference updated successfully!' : 'Conference created successfully!');
      resetForm();
    } else {
      alert('Failed to save conference.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this conference?')) {
      setLoading(true);
      const success = await deleteGlobalConference(id);
      if (success) {
        setConferences(prev => prev.filter(conf => conf.id !== id));
        alert('Conference deleted successfully!');
      } else {
        alert('Failed to delete conference.');
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
          Manage Conferences
        </button>
        <button
          onClick={() => { setEditingConference(null); setActiveTab('form'); }}
          className={`px-6 py-4 font-medium text-sm ${activeTab === 'form' && !editingConference ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Add New Conference
        </button>
        {editingConference && (
          <button
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'form' && editingConference ? 'bg-brand-50 text-brand-700 border-b-2 border-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Edit Conference
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
                  {conferences.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500 italic">No conferences found.</td>
                    </tr>
                  ) : (
                    conferences.map(conference => (
                      <tr key={conference.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-4 pr-4 font-medium text-slate-900">{conference.title}</td>
                        <td className="py-4 text-slate-600">{new Date(conference.date).toLocaleDateString()}</td>
                        <td className="py-4 text-slate-500 text-sm">{conference.location}</td>
                        <td className="py-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(conference)}
                            className="text-brand-500 hover:text-brand-700 p-2 hover:bg-brand-50 rounded"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(conference.id)}
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Conference Title</label>
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
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none hover:border-brand-300"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Link (URL)</label>
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none hover:border-brand-300"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (editingConference ? 'Update Conference' : 'Create Conference')}
            </button>
            {editingConference && (
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

export default ConferenceManagement;
